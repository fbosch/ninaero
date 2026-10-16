import assert from "node:assert/strict";
import test from "node:test";

import { bubbleRefractionPixels, bubbleRefractionStrength } from "../bubble-refraction.mjs";

test("convex refraction samples inward and smoothly returns to normal at the rim", () => {
  const size = 65;
  const pixels = bubbleRefractionPixels(size);
  const sample = (x, y) => Array.from(pixels.slice((y * size + x) * 4, (y * size + x) * 4 + 4));
  assert.equal(pixels.length, size * size * 4);
  assert.deepEqual(sample(32, 32), [128, 128, 128, 255]);
  assert.deepEqual(sample(0, 0), [128, 128, 128, 255]);
  assert.deepEqual(sample(0, 32), [128, 128, 128, 255]);
  assert.ok(sample(18, 32)[0] > 128);
  assert.ok(sample(46, 32)[0] < 128);
  assert.ok(sample(32, 18)[1] > 128);
  assert.ok(sample(32, 46)[1] < 128);
  const sourceX = (x) =>
    (x + 0.5) / size + bubbleRefractionStrength * (sample(x, 32)[0] / 255 - 0.5);
  const magnification = 4 / size / (sourceX(34) - sourceX(30));
  assert.ok(magnification > 1.25 && magnification < 1.4);
  for (let x = 1; x < size; x++) assert.ok(sourceX(x) > sourceX(x - 1));
});

test("refraction is symmetric, opaque, and bounded at every sample", () => {
  const size = 64;
  const pixels = bubbleRefractionPixels(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const offset = (y * size + x) * 4;
      const oppositeX = (y * size + size - x - 1) * 4;
      const oppositeY = ((size - y - 1) * size + x) * 4;
      assert.ok(Math.abs(pixels[offset] + pixels[oppositeX] - 255) <= 1);
      assert.ok(Math.abs(pixels[offset + 1] + pixels[oppositeY + 1] - 255) <= 1);
      assert.equal(pixels[offset + 3], 255);
    }
  }
});

test("refraction map sizes have a bounded allocation budget", () => {
  for (const size of [0, 3, 257, 1.5, NaN, Infinity]) {
    assert.throws(() => bubbleRefractionPixels(size), RangeError);
  }
  assert.equal(bubbleRefractionPixels(4).length, 64);
});
