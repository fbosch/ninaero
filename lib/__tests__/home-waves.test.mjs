import assert from "node:assert/strict";
import test from "node:test";

import { waveLayers, wavePoint } from "../home-waves.mjs";

test("wavefronts stay in the lower page and leave quiet space above", () => {
  for (const layer of waveLayers) {
    for (let time = 0; time <= 120; time += 0.5) {
      for (let x = 0; x <= 1; x += 0.05) {
        const { y, slope } = wavePoint(layer, x, time);
        assert.ok(y > 0.6 && y < 0.8, `Wave escaped the lower band at ${x}, ${time}`);
        assert.ok(Number.isFinite(slope));
      }
    }
  }
});

test("crests change curvature over time instead of moving as rigid strips", () => {
  for (const layer of waveLayers) {
    const curvature = (time) =>
      wavePoint(layer, 0.5, time).y -
      (wavePoint(layer, 0, time).y + wavePoint(layer, 1, time).y) / 2;
    assert.ok(Math.abs(curvature(0) - curvature(4)) > 0.005);
  }
});

test("overlapping wavefronts pass through one another", () => {
  for (let index = 1; index < waveLayers.length; index++) {
    const separations = [];
    for (let time = 0; time <= 60; time += 0.5) {
      separations.push(
        wavePoint(waveLayers[0], 0.5, time).y - wavePoint(waveLayers[index], 0.5, time).y,
      );
    }
    assert.ok(Math.min(...separations) < -0.015);
    assert.ok(Math.max(...separations) > 0.015);
  }
});

test("profile tangents follow the curve and movement stays continuous", () => {
  for (const layer of waveLayers) {
    for (let time = 0; time <= 30; time += 0.25) {
      for (const x of [0, 0.25, 0.5, 0.75, 1]) {
        const point = wavePoint(layer, x, time);
        const epsilon = 0.0001;
        const slope =
          (wavePoint(layer, x + epsilon, time).y - wavePoint(layer, x - epsilon, time).y) /
          (2 * epsilon);
        assert.ok(Math.abs(point.slope - slope) < 0.00001);
        assert.ok(Math.abs(point.y - wavePoint(layer, x, time + 1 / 60).y) < 0.001);
      }
    }
  }
});
