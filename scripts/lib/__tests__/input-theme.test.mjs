import assert from "node:assert/strict";
import test from "node:test";

import { theme } from "../../../registry/ninaero/theme.mjs";

function luminance(hex) {
  const match = hex.match(/^#([\da-f]{2})\1\1$/i);
  assert.ok(match, `expected grayscale color, received ${hex}`);
  const channel = Number.parseInt(match[1], 16) / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

test("field edges retain 3:1 contrast on paper and content fills in both modes", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    const edge = luminance(palette["input-edge"]);
    const shared = luminance(palette["neutral-input"]);
    assert.ok(mode === "light" ? edge > shared : edge < shared);

    const card = palette.card.match(/^oklch\(([\d.]+) 0 0\)$/);
    assert.ok(card);
    for (const fill of [luminance(palette["paper-fill"]), Number(card[1]) ** 3]) {
      const ratio = (Math.max(edge, fill) + 0.05) / (Math.min(edge, fill) + 0.05);
      assert.ok(ratio >= 3, `${mode} field edge: ${ratio.toFixed(2)}:1`);
    }
  }
});

test("field text and placeholders retain 4.5:1 contrast across recessed tones", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    const lightness = (token) => {
      const alias = palette[token].match(/^var\(--([a-z-]+)\)$/);
      if (alias) return lightness(alias[1]);
      const match = palette[token].match(/^oklch\(([\d.]+) 0 0\)$/);
      assert.ok(match, token);
      return Number(match[1]);
    };
    const fill = lightness("card");
    const shade = fill * (1 - Number.parseFloat(palette["input-recess-shade-weight"]) / 100);
    const highlight =
      fill + ((1 - fill) * Number.parseFloat(palette["input-recess-highlight-weight"])) / 100;
    for (const token of ["card-foreground", "input-placeholder"]) {
      const ink = lightness(token) ** 3;
      for (const tone of [fill, shade, highlight]) {
        const background = tone ** 3;
        const ratio = (Math.max(ink, background) + 0.05) / (Math.min(ink, background) + 0.05);
        assert.ok(ratio >= 4.5, `${mode} ${token}: ${ratio.toFixed(2)}:1`);
      }
    }
  }
});
