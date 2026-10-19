import assert from "node:assert/strict";
import test from "node:test";

import { bubbleHoldOutcome } from "../bubble-hold.mjs";

test("canceling a newly spawned bubble plays its pop", () => {
  assert.equal(bubbleHoldOutcome("cancel", true), "pop");
});

test("explicit pops play the pop while canceled existing bubbles are released", () => {
  assert.equal(bubbleHoldOutcome("pop", false), "pop");
  assert.equal(bubbleHoldOutcome("cancel", false), "release");
});

test("launching a newly spawned bubble keeps it in play", () => {
  assert.equal(bubbleHoldOutcome("launch", true), "launch");
});
