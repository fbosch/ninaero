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

function composite(overlay, background, amount = 1) {
  const rgba = overlay
    .slice(1)
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16));
  const rgb = background
    .slice(1)
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16));
  const alpha = (rgba[3] / 255) * amount;
  return `#${rgb
    .map((channel, index) =>
      Math.round(rgba[index] * alpha + channel * (1 - alpha))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
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

test("neutral Button-derived grabbers retain contrast-safe borders across accents", () => {
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = { ...theme[mode], ...preset[mode] };
      const edge = palette["button-paper-edge"];
      const pressed = palette["button-paper-pressed"];
      const face = ["fill", "hover"].flatMap((state) => {
        const fill = palette[`button-paper-${state}`];
        return [
          fill,
          ...[0, 0.25, 0.5, 0.75, 1].flatMap((amount) => [
            composite(palette["button-paper-highlight"], fill, amount),
            composite(palette["button-paper-shade"], fill, amount),
          ]),
        ];
      });
      const grooveShadow = mixOklab(palette["button-paper-fill"], "#000000", 0.3);
      const grooveHighlight = mixOklab(palette["button-paper-fill"], "#ffffff", 0.3);
      const tones = [
        edge,
        ...face,
        pressed,
        grooveShadow,
        grooveHighlight,
        mixOklab(
          pressed,
          "#000000",
          Number.parseFloat(palette["button-recess-shade-weight"]) / 100,
        ),
        mixOklab(
          pressed,
          "#ffffff",
          Number.parseFloat(palette["button-recess-highlight-weight"]) / 100,
        ),
      ];
      for (const tone of tones) {
        const channels = tone.slice(1).match(/../g);
        assert.equal(channels[0], channels[1], `${name} ${mode} neutral grabber`);
        assert.equal(channels[1], channels[2], `${name} ${mode} neutral grabber`);
      }
      for (const background of [...face, pressed]) {
        const ratio = Math.max(
          contrast(grooveShadow, background),
          contrast(grooveHighlight, background),
        );
        assert.ok(ratio >= 1.75, `${name} ${mode} decorative groove bevel: ${ratio.toFixed(2)}:1`);
      }
      for (const background of [palette.background, palette.card, palette["paper-fill"]]) {
        const ratio = contrast(edge, background);
        assert.ok(ratio >= 3, `${name} ${mode} grabber border: ${ratio.toFixed(2)}:1`);
      }
    }
  }
});

test("dark grabber highlights stay subdued beside the neutral border", () => {
  const palette = theme.dark;
  for (const state of ["fill", "hover"]) {
    const fill = palette[`button-paper-${state}`];
    const highlight = composite(palette["button-paper-highlight"], fill);
    assert.ok(contrast(highlight, fill) <= 2.25, "dark highlight remains close to its fill");
    assert.ok(
      luminance(highlight) < luminance(palette["button-paper-edge"]),
      "dark highlight stays quieter than the border",
    );
  }
});
