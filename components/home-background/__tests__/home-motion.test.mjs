import assert from "node:assert/strict";
import test from "node:test";

import { ambientFrameRate, isAmbientFrame } from "../home-motion.mjs";

function countAmbientFrames(refreshRate, seconds = 2) {
  let previous = null;
  let painted = 0;
  for (let frame = 0; frame < refreshRate * seconds; frame++) {
    const time = 1000 + (frame * 1000) / refreshRate;
    if (isAmbientFrame(time, previous)) {
      painted++;
      previous = time;
    }
  }
  return painted / seconds;
}

test("ambient motion paints at the capped rate on fast displays", () => {
  for (const refreshRate of [60, 120, 144, 240]) {
    const rate = countAmbientFrames(refreshRate);
    assert.ok(Math.abs(rate - ambientFrameRate) <= 1, `${refreshRate} Hz painted ${rate} fps`);
  }
});

test("ambient motion paints every frame on displays slower than the cap", () => {
  assert.equal(countAmbientFrames(24), 24);
});

test("the first frame after a pause always paints", () => {
  assert.equal(isAmbientFrame(1234.5, null), true);
});
