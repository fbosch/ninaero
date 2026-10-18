import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import * as foley from "@foleyjs/core";
import ts from "typescript";

const source = await readFile(new URL("../sound-runtime.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
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
    getSpec: foley.getSpec,
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
  assert.deepEqual(
    settings.filter(({ theme }) => typeof theme === "string"),
    [{ theme: "glass", volume: 0.35 }],
  );
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
  assert.deepEqual(
    settings.filter(({ theme }) => typeof theme === "string"),
    [
      { theme: "glass", volume: 0 },
      { theme: "mechanical", volume: 1 },
    ],
  );
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
  const latest = player.configure({
    enabled: true,
    theme: "soft",
    volume: 0.2,
  });
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
  await player.configure({ enabled: true, theme: "soft", volume: 0.4 });
  player.play("tick", { pitch: -6, volume: 0.2 });
  player.play("on", { pitch: 3, volume: 0 });
  player.play("tap");
  assert.deepEqual(performances, [
    { cue: "tick", options: { pitch: -6, volume: 0.2 } },
    { cue: "on", options: { pitch: 3, volume: 0 } },
    { cue: "tap", options: undefined },
  ]);
  assert.deepEqual(settings, Array(3).fill({ theme: "soft", volume: 0.4 }));
});

function acousticFixture(t) {
  const { player, engine } = fixture();
  const performances = [];
  t.after(() => foley.set({ theme: "default", volume: 0.7 }));
  engine.set = foley.set;
  engine.play = (cue, options) => {
    performances.push({
      cue,
      options,
      theme: foley.get().theme,
      transform: foley.getSet().transform,
      spec: foley.getSpec(cue),
    });
  };
  return { player, performances };
}

function toneSignature(performance) {
  const tone = performance.spec.find((layer) => layer.kind === "tone");
  assert.ok(tone);
  return {
    hz: tone.f * (performance.transform.pitch ?? 1) * 2 ** ((performance.options?.pitch ?? 0) / 12),
    ms:
      1000 *
      (tone.a * (performance.transform.attack ?? 1) + tone.d * (performance.transform.decay ?? 1)),
  };
}

test("glass pointer cues use short handheld-like pitches and envelopes through real Foley specs", async (t) => {
  const { player, performances } = acousticFixture(t);
  await player.configure({ enabled: true });
  player.play("hover");
  for (const pitch of [-6, 0, 6]) player.play("tick", { pitch, volume: 0.25 });
  assert.deepEqual(
    performances.map(({ cue }) => cue),
    ["hover", "tick", "tick", "tick"],
  );
  const [hover, low, middle, high] = performances.map(toneSignature);
  assert.ok(hover.hz >= 1000 && hover.hz <= 1400);
  assert.ok(hover.ms >= 20 && hover.ms <= 35);
  assert.ok(middle.hz >= 2200 && middle.hz <= 2400);
  assert.ok(middle.ms >= 5 && middle.ms <= 12);
  assert.ok(low.hz < middle.hz && middle.hz < high.hz);
  assert.ok(Math.abs(high.hz / low.hz - 2) < 1e-10);
  for (const performance of performances) {
    assert.notEqual(performance.transform.shimmer, true);
    assert.equal(performance.transform.send, 0);
  }
  assert.deepEqual(
    performances.slice(1).map(({ options }) => options.volume),
    [0.25, 0.25, 0.25],
  );
});

function cueSignature(performance) {
  const { spec, transform, options } = performance;
  return {
    tones: spec
      .filter((layer) => layer.kind === "tone")
      .map((layer) => ({
        hz: layer.f * (transform.pitch ?? 1) * 2 ** ((options?.pitch ?? 0) / 12),
        at: layer.at,
        wave: transform.wave?.[layer.wave] ?? layer.wave,
      })),
    ms:
      1000 *
      Math.max(
        ...spec.map(
          (layer) =>
            layer.at +
            ("a" in layer ? layer.a * (transform.attack ?? 1) : 0) +
            layer.d * (transform.decay ?? 1),
        ),
      ),
  };
}

for (const [cue, count, lowHz, highHz, lowMs, highMs] of [
  ["tap", 1, 700, 780, 25, 45],
  ["on", 2, 350, 580, 100, 140],
  ["off", 2, 350, 580, 100, 140],
  ["ping", 2, 350, 580, 70, 110],
  ["success", 3, 700, 1050, 160, 220],
  ["complete", 3, 600, 1400, 220, 280],
  ["warning", 2, 1100, 1250, 100, 160],
  ["error", 2, 800, 1250, 100, 160],
  ["loading", 3, 350, 520, 150, 220],
]) {
  test(`glass ${cue} uses a short, dry handheld envelope and register`, async (t) => {
    const { player, performances } = acousticFixture(t);
    await player.configure({ enabled: true });
    player.play(cue);
    const performance = performances.at(-1);
    const { tones, ms } = cueSignature(performance);
    assert.equal(tones.length, count);
    assert.ok(ms >= lowMs && ms <= highMs, `${cue}: ${ms} ms`);
    for (const tone of tones) {
      assert.ok(tone.hz >= lowHz && tone.hz <= highHz, `${cue}: ${tone.hz} Hz`);
      assert.equal(tone.wave, "sine");
    }
    assert.equal(performance.transform.send, 0);
    assert.notEqual(performance.transform.shimmer, true);
  });
}

test("state and outcome figures remain distinguishable by direction, rhythm, and resolution", async (t) => {
  const { player, performances } = acousticFixture(t);
  await player.configure({ enabled: true });
  for (const cue of ["on", "off", "ping", "success", "complete", "warning", "error", "loading"]) {
    player.play(cue);
  }
  const [on, off, ping, success, complete, warning, error, loading] =
    performances.map(cueSignature);
  assert.ok(on.tones[0].hz < on.tones[1].hz);
  assert.deepEqual(
    off.tones.map(({ hz }) => hz),
    on.tones.map(({ hz }) => hz).reverse(),
  );
  assert.ok(Math.abs(on.tones[1].hz / on.tones[0].hz - 1.5) < 0.005);
  assert.equal(ping.tones[0].at, ping.tones[1].at);
  for (const phrase of [success, complete, loading]) {
    assert.ok(phrase.tones[0].hz < phrase.tones[1].hz);
    assert.ok(phrase.tones[1].hz < phrase.tones[2].hz);
    assert.ok(phrase.tones[0].at < phrase.tones[1].at);
    assert.ok(phrase.tones[1].at < phrase.tones[2].at);
  }
  assert.ok(complete.tones.at(-1).hz > success.tones.at(-1).hz);
  assert.ok(complete.ms > success.ms);
  assert.equal(warning.tones[0].hz, warning.tones[1].hz);
  assert.ok(warning.tones[1].at > warning.tones[0].at);
  assert.ok(error.tones[0].hz > error.tones[1].hz);
  assert.ok(loading.tones.at(-1).hz < success.tones[0].hz);
});

test("handheld profiles preserve per-call transposition and zero-volume playback", async (t) => {
  const { player, performances } = acousticFixture(t);
  await player.configure({ enabled: true, volume: 0.2 });
  player.play("on");
  player.play("on", { pitch: 12, volume: 0 });
  const [base, octave] = performances.map(cueSignature);
  assert.deepEqual(
    octave.tones.map(({ hz }) => hz),
    base.tones.map(({ hz }) => hz * 2),
  );
  assert.equal(performances.at(-1).options.volume, 0);
  assert.equal(foley.get().volume, 0.2);
});

test("other cues and explicit themes retain their stock Foley identities", async (t) => {
  const { player, performances } = acousticFixture(t);
  await player.configure({ enabled: true });
  player.play("tap");
  player.play("bell");
  assert.equal(performances.at(-1).theme, "glass");
  assert.equal(performances.at(-1).transform.shimmer, true);
  for (const theme of ["default", "soft", "mechanical"]) {
    await player.configure({ enabled: true, theme });
    foley.set({ theme });
    const transform = foley.getSet().transform;
    for (const cue of [
      "hover",
      "tick",
      "tap",
      "on",
      "off",
      "ping",
      "success",
      "complete",
      "warning",
      "error",
      "loading",
    ]) {
      const spec = foley.getSpec(cue);
      player.play(cue);
      const performance = performances.at(-1);
      assert.equal(performance.theme, theme);
      assert.deepEqual(performance.transform, transform);
      assert.deepEqual(performance.spec, spec);
    }
  }
});

test("a source cue with incompatible voices fails explicitly before playback", async () => {
  const { player, engine, cues } = fixture();
  await player.configure({ enabled: true });
  engine.getSpec = () => foley.getSpec("tap");
  assert.throws(() => player.play("on"), {
    name: "RangeError",
    message: "Sound profile must match the source cue's tone count.",
  });
  assert.deepEqual(cues, []);
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
