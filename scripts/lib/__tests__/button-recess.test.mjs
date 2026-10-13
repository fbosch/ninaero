import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  accentPresets,
  accentRules,
} from "../../../registry/ninaero/accents.mjs";
import {
  buttonRecessShadow,
  elevations,
  theme,
} from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

const components = theme.css["@layer components"];
const button = components[".ninaero-button"];
const pressSelector = Object.keys(components).find((key) =>
  key.startsWith(".ninaero-button:active"),
);

function linearRgb(hex) {
  return hex
    .slice(1)
    .match(/.{2}/g)
    .map((value) => {
      const channel = Number.parseInt(value, 16) / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
}

function toOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
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

const luminance = ([r, g, b]) => r * 0.2126 + g * 0.7152 + b * 0.0722;
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

test("recessed lighting reverses the edges without adding a cast shadow", () => {
  assert.equal(components[pressSelector]["box-shadow"], buttonRecessShadow);
  assert.equal(
    buttonRecessShadow,
    "inset 0 1px 2px var(--button-recess-shade), inset 0 -1px 0 var(--button-recess-highlight)",
  );
  assert.ok(!buttonRecessShadow.includes("--shadow-color"));
  assert.ok(!elevations.control.includes("--button-recess"));
  assert.ok(pressSelector.includes(":not([aria-haspopup])"));
  assert.ok(pressSelector.includes(":not(.ninaero-button--ghost)"));
  assert.ok(pressSelector.includes(":not(.ninaero-button--link)"));
});

test("recess colors are derived on each Button from its own pressed material", () => {
  assert.equal(
    button["--button-recess-shade"],
    "color-mix(in oklab, var(--button-recess-fill), black var(--button-recess-shade-weight))",
  );
  assert.equal(
    button["--button-recess-highlight"],
    "color-mix(in oklab, var(--button-recess-fill), white var(--button-recess-highlight-weight))",
  );
  for (const [selector, material] of [
    [".ninaero-button--primary", "primary"],
    [".ninaero-button--secondary, .ninaero-button--outline", "paper"],
    [".ninaero-button--destructive", "destructive"],
  ]) {
    assert.equal(
      components[selector]["--button-recess-fill"],
      `var(--button-${material}-pressed)`,
    );
  }
  for (const rules of Object.values(accentRules)) {
    assert.equal(rules["--button-recess-shade"], undefined);
    assert.equal(rules["--button-recess-highlight"], undefined);
  }
});

test("Outline stays flat at rest and uses the paper pressed fill for its inset colors", () => {
  assert.equal(components[".ninaero-button--outline"]["box-shadow"], undefined);
  const outline = Object.entries(components).find(([key]) =>
    key.startsWith(".ninaero-button--outline:active"),
  )[1];
  assert.equal(outline["background-color"], "var(--button-paper-pressed)");
  assert.equal(outline["background-image"], "none");
});

test("Oklab contrast calculations round-trip material samples", () => {
  for (const hex of ["#000000", "#ffffff", "#8dd4e6", "#502630", "#20303a"]) {
    const rgb = linearRgb(hex);
    const reconstructed = fromOklab(toOklab(rgb));
    rgb.forEach((value, index) => {
      assert.ok(Math.abs(value - reconstructed[index]) < 0.000001);
    });
  }
});

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
  for (const [material, fill, ink] of materials) {
    test(`${material} ${mode}: inset tones keep material hue and 4.5:1 label contrast`, () => {
      const lab = toOklab(linearRgb(fill));
      const shadeWeight =
        Number.parseFloat(theme[mode]["button-recess-shade-weight"]) / 100;
      const highlightWeight =
        Number.parseFloat(theme[mode]["button-recess-highlight-weight"]) / 100;
      assert.ok(shadeWeight > 0 && shadeWeight < 0.1);
      assert.ok(highlightWeight > 0 && highlightWeight < 0.1);
      const shade = mixTone(lab, 0, shadeWeight);
      const highlight = mixTone(lab, 1, highlightWeight);
      assert.ok(shade[0] < lab[0]);
      assert.ok(highlight[0] > lab[0]);
      for (const [name, tone] of [
        ["shade", shade],
        ["highlight", highlight],
      ]) {
        assert.ok(Math.hypot(tone[1], tone[2]) < Math.hypot(lab[1], lab[2]));
        assert.ok(
          Math.abs(Math.atan2(tone[2], tone[1]) - Math.atan2(lab[2], lab[1])) <
            0.000001,
        );
        const ratio = contrast(linearRgb(ink), fromOklab(tone));
        assert.ok(ratio >= 4.5, `${name}: ${ratio.toFixed(2)}:1`);
      }
    });
  }
}

test("registry CSS publishes the material-derived inset recipe and theme weights", async () => {
  const published = JSON.parse(
    await readFile(
      new URL("../../../public/r/theme.json", import.meta.url),
      "utf8",
    ),
  );
  assert.deepEqual(published.css, theme.css);
  for (const mode of ["light", "dark"]) {
    for (const token of [
      "button-recess-shade-weight",
      "button-recess-highlight-weight",
    ]) {
      assert.equal(published.cssVars[mode][token], theme[mode][token]);
    }
  }
  assert.ok(
    renderThemeCss(theme).includes(`box-shadow: ${buttonRecessShadow};`),
  );
});
