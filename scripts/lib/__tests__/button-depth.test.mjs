import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { accentRules } from "../../../registry/ninaero/accents.mjs";
import { elevations, theme } from "../../../registry/ninaero/theme.mjs";

const components = theme.css["@layer components"];
function channels(hex) {
  return hex
    .slice(1)
    .match(/.{2}/g)
    .map((c) => Number.parseInt(c, 16));
}
function composite(overlay, background) {
  const rgba = channels(overlay);
  const rgb = channels(background);
  const alpha = rgba[3] / 255;
  return `#${rgb
    .map((c, i) =>
      Math.round(rgba[i] * alpha + c * (1 - alpha))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
function luminance(hex) {
  const rgb = channels(hex)
    .map((c) => c / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const [variant, material] of [
  ["secondary", "paper"],
  ["destructive", "destructive"],
]) {
  test(`${variant} has a top highlight, lower bevel, and shallow cast shadow`, () => {
    const rules = components[`.ninaero-button--${variant}`];
    assert.equal(rules["background-color"], `var(--button-${material}-fill)`);
    assert.ok(rules["background-image"].includes(`var(--button-${material}-highlight)`));
    assert.ok(rules["background-image"].includes(`var(--button-${material}-shade)`));
    assert.ok(rules["box-shadow"].includes("inset 0 1px 0"));
    assert.ok(rules["box-shadow"].includes("inset 0 -1px 0"));
    assert.ok(rules["box-shadow"].endsWith(elevations.control));
  });

  test(`${variant} has guarded hover and pressed feedback without a held highlight`, () => {
    const hover = components["@media (hover: hover)"];
    const hoverSelector = Object.keys(hover).find((key) =>
      key.startsWith(`.ninaero-button--${variant}:hover`),
    );
    const pressedSelector = Object.keys(components).find((key) =>
      key.startsWith(`.ninaero-button--${variant}:active`),
    );
    for (const selector of [hoverSelector, pressedSelector]) {
      assert.ok(selector.includes(":not(:disabled)"));
      assert.ok(selector.includes(":not([data-disabled])"));
      assert.ok(selector.includes(":not([aria-disabled=true])"));
    }
    assert.equal(hover[hoverSelector]["background-color"], `var(--button-${material}-hover)`);
    assert.equal(
      components[pressedSelector]["background-color"],
      `var(--button-${material}-pressed)`,
    );
    assert.equal(components[pressedSelector]["background-image"], "none");
    assert.ok(
      Object.keys(components).indexOf(pressedSelector) >
        Object.keys(components).indexOf("@media (hover: hover)"),
    );
  });

  for (const mode of ["light", "dark"]) {
    test(`${variant} ${mode} labels meet 4.5:1 across fill, highlight, shade, and pressed states`, () => {
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

test("destructive is a semantic red material, independent of accent presets", async () => {
  const destructive = components[".ninaero-button--destructive"];
  assert.equal(destructive.color, "var(--button-destructive-ink)");
  assert.equal(destructive["border-color"], "var(--button-destructive-edge)");
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    const background = mode === "light" ? "#ffffff" : "#232323";
    assert.ok(contrast(palette["button-destructive-edge"], background) >= 3);
  }
  for (const rules of Object.values(accentRules)) {
    assert.ok(Object.keys(rules).every((key) => !key.startsWith("--button-destructive-")));
  }
  const source = await readFile(
    new URL("../../../registry/ninaero/ui/button.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(source.includes('destructive: "ninaero-button--destructive"'));
  assert.ok(!source.includes("bg-destructive/10"));
});

test("new depth rules are published alongside the original Button primitive", async () => {
  const publishedTheme = JSON.parse(
    await readFile(new URL("../../../public/r/theme.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(publishedTheme.css, theme.css);
  const publishedButton = JSON.parse(
    await readFile(new URL("../../../public/r/button.json", import.meta.url), "utf8"),
  );
  const source = publishedButton.files.find((file) => file.path.endsWith("button.tsx")).content;
  assert.ok(source.includes('destructive: "ninaero-button--destructive"'));
});
