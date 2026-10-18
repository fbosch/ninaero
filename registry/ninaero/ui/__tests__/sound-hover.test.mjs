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
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const gate = createHoverSoundGate();
  const played = [];
  const enter = (target, allowed = true) =>
    gate.enter(target, () => {
      if (!allowed) return false;
      played.push(target);
      return true;
    });
  return { gate, played, enter, tick: (ms) => t.mock.timers.tick(ms) };
}

test("the first hover responds immediately and plays once while inside", (t) => {
  const { enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  assert.deepEqual(played, [target]);
  tick(1000);
  assert.equal(played.length, 1);
});

test("moving to a different control responds immediately", (t) => {
  const { gate, enter, played } = fixture(t);
  const first = { name: "first" };
  const second = { name: "second" };
  enter(first);
  gate.leave(first);
  enter(second);
  assert.deepEqual(played, [first, second]);
});

test("duplicate entry notifications play once per visit", (t) => {
  const { enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  tick(60);
  enter(target);
  tick(1000);
  enter(target);
  assert.deepEqual(played, [target]);
});

test("brief exits retain the latch until 200 ms continuously outside", (t) => {
  const { gate, enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  gate.leave(target);
  tick(199);
  enter(target);
  tick(1000);
  assert.equal(played.length, 1);
  gate.leave(target);
  tick(200);
  enter(target);
  assert.deepEqual(played, [target, target]);
});

test("repeated edge jitter stays silent after the first response", (t) => {
  const { gate, enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  for (let i = 0; i < 10; i++) {
    gate.leave(target);
    tick(50);
    enter(target);
    tick(50);
  }
  assert.deepEqual(played, [target]);
});

test("disposing a visit clears its rearm timer without erasing a fresh visit", (t) => {
  const { gate, enter, played, tick } = fixture(t);
  const target = {};
  enter(target);
  gate.leave(target);
  gate.dispose(target);
  enter(target);
  tick(350);
  enter(target);
  assert.deepEqual(played, [target, target]);
});

test("a previously ineligible control responds when it becomes eligible", (t) => {
  const { enter, played } = fixture(t);
  const target = {};
  enter(target, false);
  enter(target);
  assert.deepEqual(played, [target]);
});
