import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("the available accent presets remain an explicit consumer choice", () => {
  assert.deepEqual(Object.keys(accentPresets), [
    "tidepool",
    "aurora",
    "lavender",
    "slate",
    "lagoon",
    "sky",
    "blossom",
    "lime",
  ]);
});

for (const [name, preset] of Object.entries(accentPresets)) {
  for (const mode of ["light", "dark"]) {
    const palette = preset[mode];
    test(`${name} ${mode}: primary and selected text meet 4.5:1 in all states`, () => {
      for (const state of ["fill", "hover", "pressed"]) {
        const ratio = contrast(palette["button-primary-ink"], palette[`button-primary-${state}`]);
        assert.ok(ratio >= 4.5, `${state}: ${ratio.toFixed(2)}:1`);
      }
      const ratio = contrast(palette["button-link-ink"], palette["accent-soft"]);
      assert.ok(ratio >= 4.5, `selected text: ${ratio.toFixed(2)}:1`);
    });

    test(`${name} ${mode}: links, focus, and primary boundaries meet contrast targets`, () => {
      const paper = theme[mode]["button-paper-fill"];
      const surface = mode === "light" ? "#ffffff" : "#232323";
      for (const background of [paper, surface]) {
        assert.ok(contrast(palette["button-link-ink"], background) >= 4.5);
        assert.ok(contrast(palette["button-focus"], background) >= 3);
        assert.ok(contrast(palette["button-primary-edge"], background) >= 3);
      }
    });
  }
}
