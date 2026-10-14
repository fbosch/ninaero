import assert from "node:assert/strict";
import test from "node:test";

import { theme } from "../../../registry/ninaero/theme.mjs";

function channels(hex) {
  return hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16));
}

function composite(overlay, background) {
  const rgba = channels(overlay);
  const rgb = channels(background);
  const alpha = rgba[3] / 255;
  return `#${rgb
    .map((channel, index) =>
      Math.round(rgba[index] * alpha + channel * (1 - alpha))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function luminance(hex) {
  const rgb = channels(hex)
    .map((channel) => channel / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const [variant, material] of [
  ["secondary", "paper"],
  ["destructive", "destructive"],
]) {
  for (const mode of ["light", "dark"]) {
    test(`${variant} ${mode} labels meet 4.5:1 across highlights, shades, and pressed states`, () => {
      const palette = theme[mode];
      const ink = palette[`button-${material}-ink`];
      for (const state of ["fill", "hover", "pressed"]) {
        const fill = palette[`button-${material}-${state}`];
        const backgrounds =
          state === "pressed"
            ? [fill]
            : [
                fill,
                composite(palette[`button-${material}-highlight`], fill),
                composite(palette[`button-${material}-shade`], fill),
              ];
        for (const background of backgrounds) {
          const ratio = contrast(ink, background);
          assert.ok(ratio >= 4.5, `${state} ${background}: ${ratio.toFixed(2)}:1`);
        }
      }
    });
  }
}

test("destructive boundaries meet 3:1 against both mode surfaces", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    const background = mode === "light" ? "#ffffff" : "#232323";
    assert.ok(contrast(palette["button-destructive-edge"], background) >= 3);
  }
});
