import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";

function linearRgb(hex) {
  return hex
    .slice(1)
    .match(/.{2}/g)
    .map((value) => {
      const channel = Number.parseInt(value, 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
}

function toOklab([red, green, blue]) {
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1075071999 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([lightness, a, b]) {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const luminance = ([red, green, blue]) => red * 0.2126 + green * 0.7152 + blue * 0.0722;
function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function mixTone(lab, targetLightness, weight) {
  return [
    lab[0] * (1 - weight) + targetLightness * weight,
    lab[1] * (1 - weight),
    lab[2] * (1 - weight),
  ];
}

for (const mode of ["light", "dark"]) {
  const materials = Object.entries(accentPresets).map(([name, preset]) => [
    name,
    preset[mode]["button-primary-pressed"],
    preset[mode]["button-primary-ink"],
  ]);
  for (const material of ["paper", "destructive"]) {
    materials.push([
      material,
      theme[mode][`button-${material}-pressed`],
      theme[mode][`button-${material}-ink`],
    ]);
  }

  for (const [name, fill, ink] of materials) {
    test(`${name} ${mode}: inset tones preserve material hue and 4.5:1 label contrast`, () => {
      const lab = toOklab(linearRgb(fill));
      const shadeWeight = Number.parseFloat(theme[mode]["recess-shade-weight"]) / 100;
      const highlightWeight = Number.parseFloat(theme[mode]["recess-highlight-weight"]) / 100;
      assert.ok(shadeWeight > 0 && shadeWeight < 1);
      assert.ok(highlightWeight > 0 && highlightWeight < 1);

      const shade = mixTone(lab, 0, shadeWeight);
      const highlight = mixTone(lab, 1, highlightWeight);
      assert.ok(shade[0] < lab[0]);
      assert.ok(highlight[0] > lab[0]);

      for (const [toneName, tone] of [
        ["shade", shade],
        ["highlight", highlight],
      ]) {
        assert.ok(Math.hypot(tone[1], tone[2]) < Math.hypot(lab[1], lab[2]));
        assert.ok(Math.abs(Math.atan2(tone[2], tone[1]) - Math.atan2(lab[2], lab[1])) < 0.000001);
        const ratio = contrast(linearRgb(ink), fromOklab(tone));
        assert.ok(ratio >= 4.5, `${toneName}: ${ratio.toFixed(2)}:1`);
      }
    });
  }
}
