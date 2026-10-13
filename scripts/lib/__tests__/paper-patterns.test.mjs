import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import manifest from "../../../package.json" with { type: "json" };
import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";
import { createRegistry, renderThemeCss } from "../theme.mjs";

const components = theme.css["@layer components"];
const paperSelector = ".ninaero-paper-ruled, .ninaero-paper-dotted, .ninaero-paper-grid";
const read = (path) => readFile(new URL(`../../../${path}`, import.meta.url), "utf8");

test("paper fills and pattern ink adapt to color mode without following accent presets", () => {
  for (const token of ["paper-fill", "paper-rule", "paper-dot"]) {
    assert.ok(theme.light[token]);
    assert.ok(theme.dark[token]);
    assert.notEqual(theme.light[token], theme.dark[token]);
    assert.doesNotMatch(theme.light[token], /var\(--(?:primary|accent|ring)/);
    assert.doesNotMatch(theme.dark[token], /var\(--(?:primary|accent|ring)/);
    for (const preset of Object.values(accentPresets)) {
      assert.equal(preset.light[token], undefined);
      assert.equal(preset.dark[token], undefined);
    }
  }
  assert.match(theme.light["paper-fill"], /^#[\da-f]{6}$/i);
  assert.match(theme.dark["paper-fill"], /^#[\da-f]{6}$/i);
});

test("ruled, dotted, and grid backdrops are separate opt-in recipes with one opaque paper fill", () => {
  assert.deepEqual(components[paperSelector], {
    "--shadow-color": "var(--shadow-color-paper)",
    "background-color": "var(--paper-fill)",
  });
  assert.deepEqual(components[".ninaero-paper-ruled"], {
    "background-image":
      "repeating-linear-gradient(transparent 0 23px, var(--paper-rule) 23px 24px)",
  });
  assert.deepEqual(components[".ninaero-paper-dotted"], {
    "background-image": "radial-gradient(circle, var(--paper-dot) 1px, transparent 1px)",
    "background-size": "16px 16px",
  });
  assert.deepEqual(components[".ninaero-paper-grid"], {
    "background-image":
      "linear-gradient(var(--paper-rule) 1px, transparent 1px), linear-gradient(90deg, var(--paper-rule) 1px, transparent 1px)",
    "background-size": "24px 24px",
  });
  assert.equal(theme.css["@layer base"].body["background-image"], undefined);
});

test("forced colors removes every decorative paper pattern", () => {
  assert.deepEqual(components["@media (forced-colors: active)"][paperSelector], {
    "background-image": "none",
    "background-color": "Canvas",
  });
});

test("installed theme and generated site CSS include the same paper recipes", async () => {
  const registry = createRegistry(theme, manifest.dependencies, [], "https://ninaero.example/r");
  const installed = registry.items.find(({ name }) => name === "theme");
  for (const selector of [
    paperSelector,
    ".ninaero-paper-ruled",
    ".ninaero-paper-dotted",
    ".ninaero-paper-grid",
  ]) {
    assert.deepEqual(installed.css["@layer components"][selector], components[selector]);
  }
  assert.deepEqual(
    installed.css["@layer components"]["@media (forced-colors: active)"][paperSelector],
    components["@media (forced-colors: active)"][paperSelector],
  );
  assert.equal(await read("app/globals.css"), renderThemeCss(theme));
});

test("paper variants appear in distinct preview contexts while forms remain plain and opaque", async () => {
  const [home, example, catalogue, inputs, form, site] = await Promise.all([
    read("app/page.tsx"),
    read("app/examples/settings/page.tsx"),
    read("components/overview/component-overview.tsx"),
    read("app/workshop/inputs/page.tsx"),
    read("components/examples/settings-preview.tsx"),
    read("app/site.css"),
  ]);
  assert.match(home, /<main\b[^>]*className="[^"]*\bninaero-paper-ruled\b/);
  assert.match(example, /className="[^"]*\bninaero-paper-dotted\b/);
  assert.equal((catalogue.match(/overview-thumbnail ninaero-paper-grid/g) ?? []).length, 2);
  assert.match(inputs, /button-specimen ninaero-paper-ruled/);
  assert.match(form, /<form\b[^>]*className="[^"]*\bbg-card\b/);
  assert.doesNotMatch(form, /ninaero-paper-(?:ruled|dotted|grid)/);
  assert.doesNotMatch(site, /repeating-linear-gradient|radial-gradient/);
  assert.doesNotMatch(site, /\.overview-thumbnail\s*\{[^}]*background:/);
});
