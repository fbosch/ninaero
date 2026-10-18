import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import ts from "typescript";

const source = await readFile(new URL("../sound-runtime.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { createHoverSoundGate } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

function fixture(t) {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const gate = createHoverSoundGate(Date.now);
  const played = [];
  const enter = (target, allowed = true) =>
    gate.enter(target, () => {
      if (!allowed) return false;
      played.push({ target, at: Date.now() });
      return true;
    });
  return { gate, played, enter, tick: (ms) => t.mock.timers.tick(ms) };
}

test("hover waits for 100 ms of intent and plays only once while inside", (t) => {
  const { enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  tick(99);
  assert.deepEqual(played, []);
  tick(1);
  assert.deepEqual(played, [{ target, at: 100 }]);
  tick(1000);
  assert.equal(played.length, 1);
});

test("leaving before the dwell finishes cancels the sound", (t) => {
  const { gate, enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  tick(50);
  gate.leave(target);
  tick(1000);
  assert.deepEqual(played, []);
});

test("duplicate entry notifications do not restart the dwell or replay a visit", (t) => {
  const { enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  tick(60);
  enter(target);
  tick(40);
  assert.deepEqual(played, [{ target, at: 100 }]);
  enter(target);
  tick(1000);
  assert.equal(played.length, 1);
});

test("brief exits retain the played latch until 200 ms continuously outside", (t) => {
  const { gate, enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  tick(100);
  gate.leave(target);
  tick(150);
  enter(target);
  tick(1000);
  assert.equal(played.length, 1);
  gate.leave(target);
  tick(200);
  enter(target);
  tick(100);
  assert.deepEqual(played, [
    { target, at: 100 },
    { target, at: 1550 },
  ]);
});

test("controls share a 300 ms cooldown and suppressed sounds are never queued", (t) => {
  const { gate, enter, played, tick } = fixture(t);
  const first = {};
  const second = {};
  enter(first);
  tick(100);
  enter(second);
  tick(100);
  assert.deepEqual(played, [{ target: first, at: 100 }]);
  tick(1000);
  assert.equal(played.length, 1);
  gate.leave(second);
  tick(200);
  enter(second);
  tick(100);
  assert.deepEqual(played, [
    { target: first, at: 100 },
    { target: second, at: 1500 },
  ]);
});

test("a new control can play exactly at the shared cooldown boundary", (t) => {
  const { enter, played, tick } = fixture(t);
  const first = {};
  const second = {};
  enter(first);
  tick(100);
  tick(200);
  enter(second);
  tick(99);
  assert.equal(played.length, 1);
  tick(1);
  assert.deepEqual(played, [
    { target: first, at: 100 },
    { target: second, at: 400 },
  ]);
});

test("activation or disabling cancels pending hover and consumes the current visit", (t) => {
  const { gate, enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  tick(50);
  gate.cancel(target);
  tick(1000);
  enter(target);
  tick(100);
  assert.deepEqual(played, []);
  gate.leave(target);
  tick(200);
  enter(target);
  tick(100);
  assert.deepEqual(played, [{ target, at: 1450 }]);
});

test("disposing a control cancels its pending sound", (t) => {
  const { gate, enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  tick(50);
  gate.dispose(target);
  tick(500);
  assert.deepEqual(played, []);
  enter(target);
  tick(100);
  assert.deepEqual(played, [{ target, at: 650 }]);
});

test("disposing an old visit cancels its rearm timer without erasing a new visit", (t) => {
  const { gate, enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  tick(50);
  gate.leave(target);
  gate.dispose(target);
  enter(target);
  tick(100);
  tick(350);
  enter(target);
  tick(100);
  assert.deepEqual(played, [{ target, at: 150 }]);
});

test("a target that becomes ineligible does not consume the shared sound budget", (t) => {
  const { enter, played, tick } = fixture(t);
  enter({}, false);
  tick(100);
  const target = {};
  enter(target);
  tick(100);
  assert.deepEqual(played, [{ target, at: 200 }]);
});
