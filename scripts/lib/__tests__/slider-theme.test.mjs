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

test("slider track boundaries and focus retain 3:1 contrast on paper and panels", () => {
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = { ...theme[mode], ...preset[mode] };
      for (const background of [
        palette.background,
        palette.card,
        palette["paper-fill"],
        palette["input-fill"],
      ]) {
        for (const color of [palette["input-edge"], palette["button-focus"]]) {
          const ratio = contrast(color, background);
          assert.ok(ratio >= 3, `${name} ${mode} slider boundary: ${ratio.toFixed(2)}:1`);
        }
      }
    }
  }
});

test("neutral Aero grabbers keep legible grip marks across presets and pressed lighting", () => {
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = { ...theme[mode], ...preset[mode] };
      const fill = palette["button-paper-fill"];
      const pressed = palette["button-paper-pressed"];
      const ink = palette["button-paper-ink"];
      const edge = palette["button-paper-edge"];
      const top = mixOklab(fill, "#ffffff", 0.15);
      const sheen = [palette["slider-sheen-weight"], palette["slider-sheen-hover-weight"]].map(
        (weight) => mixOklab(fill, "#ffffff", Number.parseFloat(weight) / 100),
      );
      const face = [
        ...[0, 0.25, 0.5, 0.75, 1].flatMap((amount) => [
          mixOklab(top, fill, amount),
          mixOklab(fill, pressed, amount),
        ]),
        ...sheen,
        mixOklab(pressed, "#000000", 0.08),
        mixOklab(pressed, "#000000", 0.06),
        mixOklab(pressed, "#ffffff", 0.08),
      ];
      for (const tone of [edge, ink, ...face]) {
        const channels = tone.slice(1).match(/../g);
        assert.equal(channels[0], channels[1], `${name} ${mode} neutral grabber`);
        assert.equal(channels[1], channels[2], `${name} ${mode} neutral grabber`);
      }
      // The central grip crosses at most half of the localized upper reflection.
      const gripBackgrounds = [
        pressed,
        mixOklab(pressed, "#000000", 0.06),
        mixOklab(pressed, "#ffffff", 0.08),
        ...[0.35, 0.48, 0.65].flatMap((position) => {
          const body =
            position <= 0.48
              ? mixOklab(top, fill, position / 0.48)
              : mixOklab(fill, pressed, (position - 0.48) / 0.52);
          return [body, ...sheen.map((highlight) => mixOklab(body, highlight, 0.5))];
        }),
      ];
      for (const background of [palette.background, palette.card, palette["paper-fill"]]) {
        const ratio = contrast(edge, background);
        assert.ok(ratio >= 3, `${name} ${mode} grabber border: ${ratio.toFixed(2)}:1`);
      }
      for (const background of gripBackgrounds) {
        const ratio = contrast(ink, background);
        assert.ok(ratio >= 3, `${name} ${mode} grabber grip: ${ratio.toFixed(2)}:1`);
      }
    }
  }
});

test("dark grabber reflections stay subdued beside the neutral border", () => {
  const palette = theme.dark;
  const fill = palette["button-paper-fill"];
  for (const weight of [palette["slider-sheen-weight"], palette["slider-sheen-hover-weight"]]) {
    const reflection = mixOklab(fill, "#ffffff", Number.parseFloat(weight) / 100);
    assert.ok(contrast(reflection, fill) <= 2.25, "dark reflection remains close to its fill");
    assert.ok(
      luminance(reflection) < luminance(palette["button-paper-edge"]),
      "dark reflection stays quieter than the border",
    );
  }
});
