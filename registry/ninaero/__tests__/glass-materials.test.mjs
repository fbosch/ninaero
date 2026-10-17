import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../accents.mjs";
import {
  createGlassGradientTokens,
  glassGradientOffsets,
  mixOklab,
  withGlassGradientVariables,
} from "../glass-materials.mjs";

function lightness(hex) {
  const [red, green, blue] = [1, 3, 5].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}

test("Oklab mixing preserves endpoints and known perceptual midpoints", () => {
  assert.equal(mixOklab("#ff0000", "#0000ff", 0), "#ff0000");
  assert.equal(mixOklab("#ff0000", "#0000ff", 1), "#0000ff");
  assert.equal(mixOklab("#000000", "#ffffff", 0.5), "#636363");
  assert.equal(mixOklab("#ff0000", "#0000ff", 0.5), "#8c53a2");
});

test("invalid source colors and mixing amounts fail before publishing gradients", () => {
  for (const color of ["red", "#fff", "#12345678", undefined]) {
    assert.throws(() => mixOklab(color, "#ffffff", 0.5), /six-digit sRGB hex/);
  }
  for (const amount of [-1, 2, NaN, Infinity]) {
    assert.throws(() => mixOklab("#000000", "#ffffff", amount), /between zero and one/);
  }
  assert.throws(() => createGlassGradientTokens({}), /six-digit sRGB hex/);
});

for (const [name, preset] of Object.entries(accentPresets)) {
  for (const mode of ["light", "dark"]) {
    test(`${name} ${mode}: glass shading remains lighter at the top with a perceptual midpoint`, () => {
      const palette = preset[mode];
      const tokens = createGlassGradientTokens(palette);
      for (const [part, start, end] of [
        [
          "rim",
          palette["button-primary-edge"],
          mixOklab(palette["button-primary-edge"], "#000000", 0.08),
        ],
        ["face", palette["button-primary-hover"], palette["button-primary-pressed"]],
      ]) {
        const colors = glassGradientOffsets.map((offset) => tokens[`glass-mark-${part}-${offset}`]);
        assert.equal(colors[0], start);
        assert.equal(colors.at(-1), end);
        assert.equal(colors[glassGradientOffsets.indexOf(50)], mixOklab(start, end, 0.5));
        const levels = colors.map(lightness);
        assert.ok(levels[0] >= levels.at(-1), `${part}: top must be lighter than bottom`);
        for (let index = 1; index < levels.length; index++) {
          assert.ok(
            levels[index] <= levels[index - 1] + 0.001,
            `${part}: stop ${index} reverses the light`,
          );
        }
      }
    });
  }
}

test("accent variables retain their existing values when material stops are added", () => {
  const source = Object.fromEntries(
    Object.entries(accentPresets.tidepool.light).map(([name, value]) => [`--${name}`, value]),
  );
  const original = { ...source };
  const result = withGlassGradientVariables(source);
  assert.equal(result["--button-focus"], source["--button-focus"]);
  assert.equal(result["--glass-mark-rim-0"], source["--button-primary-edge"]);
  assert.equal(result["--glass-mark-face-100"], source["--button-primary-pressed"]);
  assert.deepEqual(source, original);
});
