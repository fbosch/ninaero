import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";

test("selected Select text and its boundary meet contrast targets across presets and modes", () => {
  const luminance = (hex) => {
    const rgb = hex
      .slice(1)
      .match(/../g)
      .map((channel) => {
        const value = Number.parseInt(channel, 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const contrast = (first, second) =>
    (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);

  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = preset[mode];
      const fill = luminance(palette["accent-soft"]);
      assert.ok(
        contrast(fill, luminance(palette["button-link-ink"])) >= 4.5,
        `${name} ${mode} text`,
      );
      assert.ok(
        contrast(fill, luminance(palette["button-focus"])) >= 3,
        `${name} ${mode} selection edge`,
      );
    }
  }
});
