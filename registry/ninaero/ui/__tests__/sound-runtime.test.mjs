import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import ts from "typescript";

const source = await readFile(new URL("../sound-runtime.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { createSoundPlayer, getSoundPitch } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

function fixture() {
  const settings = [];
  const cues = [];
  const stopped = [];
  let loads = 0;
  const engine = {
    set(value) {
      settings.push(value);
    },
    play(cue) {
      cues.push(cue);
      return {
        stop() {
          stopped.push(cue);
        },
      };
    },
  };
  const player = createSoundPlayer(async () => {
    loads++;
    return engine;
  });
  return { player, engine, settings, cues, stopped, loads: () => loads };
}

test("default and disabled players stay silent without loading Foley", async () => {
  const { player, cues, loads } = fixture();
  await player.configure();
  player.play("tap");
  await player.configure({ enabled: false });
  player.play("success");
  assert.equal(loads(), 0);
  assert.deepEqual(cues, []);
});

test("enabling loads Foley once and applies the glass, quiet defaults", async () => {
  const { player, settings, cues, loads } = fixture();
  await player.configure({ enabled: true });
  player.play("tap");
  assert.equal(loads(), 1);
  assert.deepEqual(settings, [{ theme: "glass", volume: 0.35 }]);
  assert.deepEqual(cues, ["tap"]);
  player.stop();
  await player.configure({ enabled: true });
  assert.equal(loads(), 1);
});

test("custom theme and volume take effect at playback, including zero volume", async () => {
  const { player, settings } = fixture();
  await player.configure({ enabled: true, theme: "glass", volume: 0 });
  player.play("on");
  await player.configure({ enabled: true, theme: "mechanical", volume: 1 });
  player.play("off");
  assert.deepEqual(settings, [
    { theme: "glass", volume: 0 },
    { theme: "mechanical", volume: 1 },
  ]);
});

test("turning sound off stops the active cue and blocks further playback", async () => {
  const { player, stopped, cues } = fixture();
  await player.configure({ enabled: true });
  player.play("success");
  await player.configure({ enabled: false });
  player.play("error");
  assert.deepEqual(stopped, ["success"]);
  assert.deepEqual(cues, ["success"]);
});

test("unmount cleanup stops the cue and is safe to repeat", async () => {
  const { player, stopped, cues } = fixture();
  await player.configure({ enabled: true });
  player.play("tap");
  player.stop();
  player.stop();
  player.play("on");
  assert.deepEqual(stopped, ["tap"]);
  assert.deepEqual(cues, ["tap"]);
});

test("new cues replace the previous cue instead of accumulating", async () => {
  const { player, stopped, cues } = fixture();
  await player.configure({ enabled: true });
  player.play("on");
  player.play("off");
  assert.deepEqual(cues, ["on", "off"]);
  assert.deepEqual(stopped, ["on"]);
});

test("Foley cooldown does not cut off a cue when the replacement is suppressed", async () => {
  const { player, engine, stopped } = fixture();
  await player.configure({ enabled: true });
  player.play("tap");
  engine.play = () => undefined;
  player.play("tap");
  assert.deepEqual(stopped, []);
  player.stop();
  assert.deepEqual(stopped, ["tap"]);
});

test("disabling during a pending load never re-enables or queues sounds", async () => {
  const { promise, resolve } = Promise.withResolvers();
  const cues = [];
  const player = createSoundPlayer(() => promise);
  const enabling = player.configure({ enabled: true });
  player.play("tap");
  await player.configure({ enabled: false });
  resolve({
    set() {},
    play(cue) {
      cues.push(cue);
    },
  });
  await enabling;
  player.play("success");
  assert.deepEqual(cues, []);
});

test("rapid enable, disable, and enable uses the latest settings and a single load", async () => {
  const { promise, resolve } = Promise.withResolvers();
  const settings = [];
  const cues = [];
  let loads = 0;
  const player = createSoundPlayer(() => {
    loads++;
    return promise;
  });
  const first = player.configure({ enabled: true, theme: "glass" });
  player.stop();
  const latest = player.configure({ enabled: true, theme: "soft", volume: 0.2 });
  resolve({
    set(value) {
      settings.push(value);
    },
    play(cue) {
      cues.push(cue);
    },
  });
  await Promise.all([first, latest]);
  player.play("tap");
  assert.equal(loads, 1);
  assert.deepEqual(settings, [{ theme: "soft", volume: 0.2 }]);
  assert.deepEqual(cues, ["tap"]);
});

test("load failures reach the caller and a later enable can retry", async () => {
  let attempts = 0;
  const failure = new Error("Unable to load Foley.");
  const player = createSoundPlayer(async () => {
    if (++attempts === 1) throw failure;
    return { set() {}, play() {} };
  });
  await assert.rejects(player.configure({ enabled: true }), failure);
  await player.configure({ enabled: true });
  assert.equal(attempts, 2);
});

test("invalid volumes reject before loading the audio engine", async () => {
  const { player, loads } = fixture();
  for (const volume of [-0.1, 1.1, NaN, Infinity]) {
    await assert.rejects(player.configure({ enabled: true, volume }), RangeError);
  }
  assert.equal(loads(), 0);
});

test("per-cue pitch and volume reach Foley without changing provider settings", async () => {
  const { player, engine, settings } = fixture();
  const performances = [];
  engine.play = (cue, options) => {
    performances.push({ cue, options });
  };
  await player.configure({ enabled: true, volume: 0.4 });
  player.play("tick", { pitch: -6, volume: 0.2 });
  player.play("on", { pitch: 3, volume: 0 });
  player.play("tap");
  assert.deepEqual(performances, [
    { cue: "tick", options: { pitch: -6, volume: 0.2 } },
    { cue: "on", options: { pitch: 3, volume: 0 } },
    { cue: "tap", options: undefined },
  ]);
  assert.deepEqual(settings, Array(3).fill({ theme: "glass", volume: 0.4 }));
});

test("invalid per-cue settings reject without producing sound", async () => {
  const { player, cues, settings } = fixture();
  await player.configure({ enabled: true });
  for (const volume of [-1, 2, NaN, Infinity]) {
    assert.throws(() => player.play("tick", { volume }), RangeError);
  }
  for (const pitch of [NaN, Infinity, -Infinity]) {
    assert.throws(() => player.play("tick", { pitch }), RangeError);
  }
  assert.deepEqual(cues, []);
  assert.deepEqual(settings, []);
});

test("value pitch follows its range across one octave and clamps at the limits", () => {
  assert.equal(getSoundPitch(0, 0, 100), -6);
  assert.equal(getSoundPitch(50, 0, 100), 0);
  assert.equal(getSoundPitch(100, 0, 100), 6);
  assert.equal(getSoundPitch(-1, 0, 100), -6);
  assert.equal(getSoundPitch(101, 0, 100), 6);
  assert.equal(getSoundPitch(0.25, 0, 1), -3);
  assert.equal(getSoundPitch(0, -10, 10), 0);
});

test("pitch mapping rejects non-finite values and invalid ranges", () => {
  for (const args of [
    [NaN, 0, 1],
    [0, -Infinity, 1],
    [0, 0, Infinity],
    [0, 1, 1],
    [0, 2, 1],
  ]) {
    assert.throws(() => getSoundPitch(...args), RangeError);
  }
});
