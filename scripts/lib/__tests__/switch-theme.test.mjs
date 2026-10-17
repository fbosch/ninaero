import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
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

test("selected switch tracks retain a defined boundary on paper and panels", () => {
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = { ...theme[mode], ...preset[mode] };
      for (const surface of [palette.background, palette.card, palette.muted]) {
        const ratio = contrast(palette["button-primary-edge"], surface);
        assert.ok(ratio >= 3, `${name} ${mode} selected track edge: ${ratio.toFixed(2)}:1`);
      }
    }
  }
});
