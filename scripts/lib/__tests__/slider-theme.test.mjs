import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { mixOklab } from "../../../registry/ninaero/glass-materials.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";

function luminance(color) {
  const neutral = color.match(/^oklch\(([\d.]+) 0 0\)$/);
  if (neutral) return Number(neutral[1]) ** 3;
  const channels = color
    .slice(1)
    .match(/../g)
    .map((channel) => {
      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("slider tracks, accent ranges, and focus retain 3:1 contrast on paper and panels", () => {
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = { ...theme[mode], ...preset[mode] };
      const backgrounds = [
        palette.background,
        palette.card,
        palette["paper-fill"],
        palette["input-fill"],
      ];
      for (const background of backgrounds) {
        for (const color of [
          palette["input-edge"],
          palette["button-primary-edge"],
          palette["button-focus"],
        ]) {
          const ratio = contrast(color, background);
          assert.ok(ratio >= 3, `${name} ${mode} slider boundary ${color}: ${ratio.toFixed(2)}:1`);
        }
      }
    }
  }
});

test("slider thumbs retain a visible boundary through face shading, highlights, and press", () => {
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = { ...theme[mode], ...preset[mode] };
      const top = palette["slider-thumb-top"];
      const bottom = palette["slider-thumb-bottom"];
      const tones = [
        ...[0, 0.25, 0.5, 0.75, 1].map((amount) => mixOklab(top, bottom, amount)),
        mixOklab(top, "#ffffff", 0.06),
      ];
      for (const tone of tones) {
        const boundary = contrast(palette["slider-thumb-edge"], tone);
        assert.ok(boundary >= 3, `${name} ${mode} thumb edge: ${boundary.toFixed(2)}:1`);
        const range = contrast(tone, palette["button-primary-edge"]);
        assert.ok(range >= 3, `${name} ${mode} thumb against range: ${range.toFixed(2)}:1`);
      }
    }
  }
});
