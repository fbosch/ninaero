import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { createGlassGradientTokens, mixOklab } from "../../../registry/ninaero/glass-materials.mjs";
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

for (const mode of ["light", "dark"]) {
  test(`${mode} checkbox and radio selection marks retain contrast across accent materials`, () => {
    for (const [name, preset] of Object.entries(accentPresets)) {
      const palette = { ...theme[mode], ...preset[mode] };
      const glass = createGlassGradientTokens(palette);
      const stops = [0, 50, 100].map((offset) => glass[`glass-mark-face-${offset}`]);
      const pressed = palette["button-primary-pressed"];
      const tones = [
        palette["button-primary-fill"],
        mixOklab(stops[0], "#ffffff", 0.25),
        mixOklab(stops[2], "#000000", 0.08),
        pressed,
        mixOklab(pressed, "#000000", Number.parseFloat(palette["recess-shade-weight"]) / 100),
        mixOklab(pressed, "#ffffff", Number.parseFloat(palette["recess-highlight-weight"]) / 100),
        ...[0, 0.25, 0.5, 0.75, 1].flatMap((amount) => [
          mixOklab(stops[0], stops[1], amount),
          mixOklab(stops[1], stops[2], amount),
        ]),
      ];
      for (const tone of tones) {
        const ink = mixOklab(palette["button-primary-ink"], "#000000", 0.12);
        const ratio = contrast(ink, tone);
        assert.ok(ratio >= 4.5, `${name} ${mode} selection mark: ${ratio.toFixed(2)}:1`);
      }
    }
  });

  test(`${mode} invalid checked marks retain contrast on the destructive selection material`, () => {
    const palette = theme[mode];
    const hover = palette["button-destructive-hover"];
    const pressed = palette["button-destructive-pressed"];
    const middle = mixOklab(hover, pressed, 0.5);
    const tones = [
      palette["button-destructive-fill"],
      mixOklab(hover, "#ffffff", 0.25),
      mixOklab(pressed, "#000000", 0.08),
      mixOklab(pressed, "#000000", Number.parseFloat(palette["recess-shade-weight"]) / 100),
      mixOklab(pressed, "#ffffff", Number.parseFloat(palette["recess-highlight-weight"]) / 100),
      ...[0, 0.25, 0.5, 0.75, 1].flatMap((amount) => [
        mixOklab(hover, middle, amount),
        mixOklab(middle, pressed, amount),
      ]),
    ];
    for (const tone of tones) {
      const ink = mixOklab(palette["button-destructive-ink"], "#000000", 0.12);
      const ratio = contrast(ink, tone);
      assert.ok(ratio >= 4.5, `${mode} invalid selection mark: ${ratio.toFixed(2)}:1`);
    }
  });

  test(`${mode} checkbox and radio selection and invalid boundaries remain distinct on paper and panels`, () => {
    for (const [name, preset] of Object.entries(accentPresets)) {
      const palette = { ...theme[mode], ...preset[mode] };
      for (const fill of [
        palette.background,
        palette.card,
        palette.muted,
        palette["accent-soft"],
      ]) {
        for (const edge of [
          palette["button-primary-edge"],
          palette["button-focus"],
          palette.destructive,
        ]) {
          const ratio = contrast(edge, fill);
          assert.ok(ratio >= 3, `${name} ${mode} boundary: ${ratio.toFixed(2)}:1`);
        }
      }
    }
  });
}
