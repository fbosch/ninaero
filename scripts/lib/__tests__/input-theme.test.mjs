import assert from "node:assert/strict";
import test from "node:test";

import { theme } from "../../../registry/ninaero/theme.mjs";

function lightness(palette, token) {
  const alias = palette[token].match(/^var\(--([a-z-]+)\)$/);
  if (alias) return lightness(palette, alias[1]);
  const match = palette[token].match(/^oklch\(([\d.]+) 0 0\)$/);
  assert.ok(match, token);
  return Number(match[1]);
}

function luminance(hex) {
  const match = hex.match(/^#([\da-f]{2})\1\1$/i);
  assert.ok(match, `expected grayscale color, received ${hex}`);
  const channel = Number.parseInt(match[1], 16) / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

test("field edges stay quieter than shared control borders in both modes", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    const edge = luminance(palette["input-edge"]);
    const shared = luminance(palette["neutral-input"]);
    assert.ok(mode === "light" ? edge > shared : edge < shared);
  }
});

test("field text and placeholders retain 4.5:1 contrast across recessed tones", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    const fill = lightness(palette, "input-fill");
    const shade = fill * (1 - Number.parseFloat(palette["recess-shade-weight"]) / 100);
    const highlight =
      fill + ((1 - fill) * Number.parseFloat(palette["recess-highlight-weight"])) / 100;
    for (const token of ["card-foreground", "input-placeholder"]) {
      const ink = lightness(palette, token) ** 3;
      for (const tone of [fill, shade, highlight]) {
        const background = tone ** 3;
        const ratio = (Math.max(ink, background) + 0.05) / (Math.min(ink, background) + 0.05);
        assert.ok(ratio >= 4.5, `${mode} ${token}: ${ratio.toFixed(2)}:1`);
      }
    }
  }
});

test("invalid field shades keep the recess lightness and retain 4.5:1 text contrast", () => {
  const oklchLuminance = (value) => {
    const match = value.match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/);
    assert.ok(match, value);
    const [lightness, chroma, hue] = match.slice(1).map(Number);
    const a = chroma * Math.cos((hue * Math.PI) / 180);
    const b = chroma * Math.sin((hue * Math.PI) / 180);
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const [red, green, blue] = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map((channel) => Math.min(1, Math.max(0, channel)));
    return { lightness, chroma, luminance: red * 0.2126 + green * 0.7152 + blue * 0.0722 };
  };
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    const shade = oklchLuminance(palette["input-invalid-shade"]);
    const fill = lightness(palette, "input-fill");
    const neutralShade = fill * (1 - Number.parseFloat(palette["recess-shade-weight"]) / 100);
    assert.ok(Math.abs(shade.lightness - neutralShade) < 0.001, `${mode} shade lightness`);
    assert.ok(shade.chroma > 0, `${mode} shade is tinted`);
    for (const token of ["card-foreground", "input-placeholder"]) {
      const ink = lightness(palette, token) ** 3;
      const ratio =
        (Math.max(ink, shade.luminance) + 0.05) / (Math.min(ink, shade.luminance) + 0.05);
      assert.ok(ratio >= 4.5, `${mode} ${token} on invalid shade: ${ratio.toFixed(2)}:1`);
    }
  }
});

test("dark disabled fields are no brighter than enabled fields", () => {
  assert.ok(lightness(theme.dark, "input-disabled-fill") <= lightness(theme.dark, "input-fill"));
});
