import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";

function neutralLightness(color) {
  const match = color.match(/^oklch\(([\d.]+) 0 0\)$/);
  assert.ok(match, `expected a neutral oklch color, received ${color}`);
  return Number(match[1]);
}

function luminance(color) {
  const neutral = color.match(/^oklch\(([\d.]+) 0 0\)$/);
  if (neutral) return Number(neutral[1]) ** 3;
  const [red, green, blue] = color
    .slice(1)
    .match(/../g)
    .map((channel) => {
      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

for (const mode of ["light", "dark"]) {
  test(`${mode} selected choice card text retains 4.5:1 on the flat accent fill`, () => {
    const palette = theme[mode];
    // Selected cards pull muted descriptions 15% toward foreground in Oklab; both are neutral.
    const muted = neutralLightness(palette["muted-foreground"]);
    const foreground = neutralLightness(palette.foreground);
    const description = `oklch(${muted * 0.85 + foreground * 0.15} 0 0)`;
    for (const [name, preset] of Object.entries(accentPresets)) {
      const fill = preset[mode]["accent-soft"];
      // Selected cards stay flat, so text only sits on the fill itself.
      const tones = [fill];
      for (const [role, ink] of [
        ["title", palette.foreground],
        ["description", description],
      ]) {
        for (const tone of tones) {
          const ratio = contrast(ink, tone);
          assert.ok(ratio >= 4.5, `${name} ${mode} ${role}: ${ratio.toFixed(2)}:1`);
        }
      }
    }
  });
}
