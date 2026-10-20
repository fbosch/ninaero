import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../accents.mjs";
import { mixOklab } from "../glass-materials.mjs";
import { theme } from "../theme.mjs";

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((channel) => {
      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test("Calendar selection text and edges retain contrast across shaded faces, presets, and modes", () => {
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = preset[mode];
      const fill = palette["accent-soft"];
      const highlight = mixOklab(
        fill,
        "#ffffff",
        Number.parseFloat(theme[mode]["recess-highlight-weight"]) / 100,
      );
      const shade = mixOklab(
        fill,
        "#000000",
        Number.parseFloat(theme[mode]["recess-shade-weight"]) / 100,
      );
      const ink = luminance(palette["button-link-ink"]);
      const edge = luminance(palette["button-focus"]);

      for (const [start, end] of [
        [highlight, fill],
        [fill, shade],
      ]) {
        for (let sample = 0; sample <= 40; sample++) {
          const surface = mixOklab(start, end, sample / 40);
          const background = luminance(surface);
          assert.ok(
            contrast(ink, background) >= 4.5,
            `${name} ${mode} text on ${surface}: ${contrast(ink, background).toFixed(2)}:1`,
          );
          assert.ok(
            contrast(edge, background) >= 3,
            `${name} ${mode} selection edge on ${surface}: ${contrast(edge, background).toFixed(2)}:1`,
          );
        }
      }
    }
  }
});
