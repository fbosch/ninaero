import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  accentPresets,
  accentRules,
  accentSemanticTokens,
  defaultAccent,
} from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";
import { renderThemeCss } from "../theme.mjs";

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((c) => Number.parseInt(c, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("default accent comes from the preset source in both modes", () => {
  for (const mode of ["light", "dark"]) {
    for (const [key, value] of Object.entries(
      accentPresets[defaultAccent][mode],
    )) {
      assert.equal(theme[mode][key], value);
    }
    for (const [key, value] of Object.entries(accentSemanticTokens)) {
      assert.equal(theme[mode][key], value);
    }
  }
});

test("preset rules share the registry output and keep paper, ink, and destructive tokens unchanged", async () => {
  const css = renderThemeCss(theme);
  const forbidden = [
    "background",
    "foreground",
    "card",
    "destructive",
    "button-paper-fill",
    "button-paper-ink",
    "button-paper-edge",
    "button-outline-edge",
  ];
  const published = JSON.parse(
    await readFile(
      new URL("../../../public/r/theme.json", import.meta.url),
      "utf8",
    ),
  );
  assert.deepEqual(published.css, theme.css);
  for (const [selector, values] of Object.entries(accentRules)) {
    assert.deepEqual(theme.css[selector], values);
    assert.ok(css.includes(selector));
    for (const key of forbidden) assert.equal(values[`--${key}`], undefined);
    for (const [key, value] of Object.entries(values))
      assert.ok(css.includes(`${key}: ${value};`));
  }
});

test("only Cyan, Indigo, Lavender, and Slate are offered as accents", () => {
  assert.deepEqual(Object.keys(accentPresets), [
    "cyan",
    "indigo",
    "lavender",
    "slate",
  ]);
});

test("structural borders and control outlines follow each preset in both modes", () => {
  assert.equal(accentSemanticTokens.border, "var(--accent-border)");
  assert.equal(accentSemanticTokens.input, "var(--accent-outline)");
  assert.equal(accentSemanticTokens["sidebar-border"], "var(--accent-border)");
  assert.equal(accentSemanticTokens["button-paper-edge"], undefined);
  assert.equal(accentSemanticTokens["button-outline-edge"], undefined);
  for (const mode of ["light", "dark"]) {
    const borders = new Set();
    const outlines = new Set();
    for (const [name, preset] of Object.entries(accentPresets)) {
      const selector =
        mode === "light"
          ? `[data-accent="${name}"]`
          : `.dark[data-accent="${name}"], .dark [data-accent="${name}"]`;
      const rules = accentRules[selector];
      assert.equal(rules["--accent-border"], preset[mode]["accent-border"]);
      assert.equal(rules["--accent-outline"], preset[mode]["accent-outline"]);
      for (const key of ["border", "input", "sidebar-border"]) {
        assert.equal(rules[`--${key}`], accentSemanticTokens[key]);
      }
      borders.add(preset[mode]["accent-border"]);
      outlines.add(preset[mode]["accent-outline"]);
    }
    assert.equal(borders.size, 4);
    assert.equal(outlines.size, 4);
  }
});

test("invalid Button borders and forced-colors outlines retain semantic colors", () => {
  const components = theme.css["@layer components"];
  assert.equal(
    components[".ninaero-button[aria-invalid=true]"]["border-color"],
    "var(--button-destructive-edge)",
  );
  assert.equal(
    components["@media (forced-colors: active)"][".ninaero-button"][
      "border-color"
    ],
    "ButtonText",
  );
});
for (const [name, preset] of Object.entries(accentPresets)) {
  for (const mode of ["light", "dark"]) {
    const palette = preset[mode];
    test(`${name} ${mode}: primary text and selected text meet 4.5:1 in all states`, () => {
      for (const state of ["fill", "hover", "pressed"]) {
        const ratio = contrast(
          palette["button-primary-ink"],
          palette[`button-primary-${state}`],
        );
        assert.ok(ratio >= 4.5, `${state}: ${ratio.toFixed(2)}:1`);
      }
      const ratio = contrast(
        palette["button-link-ink"],
        palette["accent-soft"],
      );
      assert.ok(ratio >= 4.5, `selected text: ${ratio.toFixed(2)}:1`);
    });
    test(`${name} ${mode}: links, focus, and primary boundaries have sufficient contrast`, () => {
      const paper = theme[mode]["button-paper-fill"];
      const surface = mode === "light" ? "#ffffff" : "#232323";
      for (const background of [paper, surface]) {
        assert.ok(contrast(palette["button-link-ink"], background) >= 4.5);
        assert.ok(contrast(palette["button-focus"], background) >= 3);
        assert.ok(contrast(palette["button-primary-edge"], background) >= 3);
        assert.ok(contrast(palette["accent-outline"], background) >= 3);
      }
    });
    test(`${name} ${mode}: CSS scopes apply to both the root and comparison cards`, () => {
      const selector =
        mode === "light"
          ? `[data-accent="${name}"]`
          : `.dark[data-accent="${name}"], .dark [data-accent="${name}"]`;
      assert.equal(
        accentRules[selector]["--button-primary-fill"],
        palette["button-primary-fill"],
      );
    });
  }
}
