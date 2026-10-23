import assert from "node:assert/strict";
import test from "node:test";

import { createAmbientPause, createModalMotionGate } from "../home-motion.mjs";

function createFrames() {
  let nextId = 0;
  const pending = new Map();
  return {
    request(callback) {
      const id = nextId++;
      pending.set(id, callback);
      return id;
    },
    cancel(id) {
      pending.delete(id);
    },
    flush() {
      const callbacks = [...pending.values()];
      pending.clear();
      for (const callback of callbacks) callback();
    },
  };
}

test("ambient renderers stop synchronously before a modal open is queued", () => {
  const pause = createAmbientPause();
  const frames = createFrames();
  const events = [];
  pause.subscribe(() => events.push(pause.isPaused() ? "stop" : "resume"));
  const modal = createModalMotionGate(pause, frames);

  modal.open(() => events.push("open"));
  assert.deepEqual(events, ["stop"]);
  assert.equal(modal.isPending(), true);
  frames.flush();
  assert.deepEqual(events, ["stop", "open"]);
  assert.equal(modal.isPending(), false);
  assert.equal(pause.isPaused(), true);

  modal.finish();
  assert.deepEqual(events, ["stop", "open", "resume"]);
});

test("nested modals keep motion paused until the last modal finishes", () => {
  const pause = createAmbientPause();
  const frames = createFrames();
  const outer = createModalMotionGate(pause, frames);
  const inner = createModalMotionGate(pause, frames);
  outer.open(() => {});
  inner.open(() => {});
  frames.flush();

  outer.finish();
  assert.equal(pause.isPaused(), true);
  inner.finish();
  assert.equal(pause.isPaused(), false);
});

test("canceling a queued modal prevents a late open and releases its pause", () => {
  const pause = createAmbientPause();
  const frames = createFrames();
  const modal = createModalMotionGate(pause, frames);
  let opened = false;

  modal.open(() => {
    opened = true;
  });
  modal.finish();
  frames.flush();
  assert.equal(opened, false);
  assert.equal(modal.isPending(), false);
  assert.equal(pause.isPaused(), false);
});

test("reduced-motion opening is immediate but still pauses renderers first", () => {
  const pause = createAmbientPause();
  const events = [];
  pause.subscribe(() => events.push(pause.isPaused() ? "stop" : "resume"));
  const modal = createModalMotionGate(pause, {
    request() {
      assert.fail("Immediate opening must not request a frame");
    },
    cancel() {},
  });

  modal.open(() => events.push("open"), true);
  assert.deepEqual(events, ["stop", "open"]);
  assert.equal(modal.isPending(), false);
  modal.finish();
  assert.deepEqual(events, ["stop", "open", "resume"]);
});

test("repeated requests before the next frame open a modal only once", () => {
  const pause = createAmbientPause();
  const frames = createFrames();
  const modal = createModalMotionGate(pause, frames);
  let opens = 0;
  modal.open(() => opens++);
  modal.open(() => opens++);
  frames.flush();
  assert.equal(opens, 1);
  modal.finish();
  assert.equal(pause.isPaused(), false);
});

test("reopening during exit retains the existing pause without a running frame", () => {
  const pause = createAmbientPause();
  const frames = createFrames();
  const states = [];
  pause.subscribe(() => states.push(pause.isPaused()));
  const modal = createModalMotionGate(pause, frames);

  modal.open(() => {});
  frames.flush();
  modal.open(() => {}, true);
  assert.deepEqual(states, [true]);
  modal.finish();
  assert.deepEqual(states, [true, false]);
});

test("finishing a modal more than once cannot release another modal's pause", () => {
  const pause = createAmbientPause();
  const frames = createFrames();
  const first = createModalMotionGate(pause, frames);
  const second = createModalMotionGate(pause, frames);
  first.open(() => {});
  second.open(() => {});
  first.finish();
  first.finish();
  assert.equal(pause.isPaused(), true);
  frames.flush();
  second.finish();
  assert.equal(pause.isPaused(), false);
});

test("ambient subscribers can clean up without changing pause ownership", () => {
  const pause = createAmbientPause();
  let updates = 0;
  const unsubscribe = pause.subscribe(() => updates++);
  const release = pause.pause();
  assert.equal(updates, 1);
  unsubscribe();
  release();
  assert.equal(updates, 1);
  assert.equal(pause.isPaused(), false);
});
