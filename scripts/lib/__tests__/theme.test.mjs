import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import catalog from "../../../registry/ninaero/catalog.json" with { type: "json" };
import { theme } from "../../../registry/ninaero/theme.mjs";
import { readCatalogSources, resolveCatalog } from "../catalog.mjs";
import { createRegistry, normalizeRegistryUrl, renderThemeCss } from "../theme.mjs";

const manifest = JSON.parse(await readFile(new URL("../../../package.json", import.meta.url)));
const components = resolveCatalog(
  catalog,
  await readCatalogSources(catalog, new URL("../../../", import.meta.url)),
);

test("consumer registry installs both self-hosted font styles with their package dependencies", () => {
  const registry = createRegistry(
    theme,
    manifest.dependencies,
    components,
    "https://ninaero.example/r",
  );
  const themeItem = registry.items.find(({ name }) => name === "theme");
  const font = registry.items.find(({ name }) => name === "font-google-sans-flex");
  const codeFont = registry.items.find(({ name }) => name === "font-google-sans-code");

  assert.deepEqual(themeItem.registryDependencies, [
    "https://ninaero.example/r/font-google-sans-flex.json",
    "https://ninaero.example/r/font-google-sans-code.json",
  ]);
  assert.equal(font.type, "registry:style");
  assert.deepEqual(font.dependencies, [
    `${theme.font.dependency}@${manifest.dependencies[theme.font.dependency]}`,
  ]);
  assert.deepEqual(font.css, {
    [`@import "${theme.font.stylesheet}"`]: {},
    ":root": {
      "--font-sans": theme.theme["font-sans"],
      "--font-heading": theme.theme["font-heading"],
    },
  });

  assert.equal(codeFont.type, "registry:style");
  assert.deepEqual(codeFont.dependencies, [
    `${theme.codeFont.dependency}@${manifest.dependencies[theme.codeFont.dependency]}`,
  ]);
  assert.deepEqual(codeFont.css, {
    [`@import "${theme.codeFont.stylesheet}"`]: {},
    ":root": { "--font-mono": theme.theme["font-mono"] },
  });
});

test("rendered theme CSS imports both self-hosted fonts and maps the code family", () => {
  const css = renderThemeCss(theme);
  const tailwindImport = css.indexOf('@import "tailwindcss";');

  assert.ok(css.indexOf(`@import "${theme.font.stylesheet}";`) < tailwindImport);
  assert.ok(css.indexOf(`@import "${theme.codeFont.stylesheet}";`) < tailwindImport);
  assert.ok(css.includes(`--font-mono: ${theme.codeFont.family};`));
});

test("every registry dependency resolves to an item published by the registry", () => {
  const registry = createRegistry(
    theme,
    manifest.dependencies,
    components,
    "https://ninaero.example/r/",
  );
  const names = new Set(registry.items.map(({ name }) => name));
  for (const item of registry.items) {
    for (const dependency of item.registryDependencies ?? []) {
      const url = new URL(dependency);
      assert.equal(url.origin, "https://ninaero.example");
      assert.equal(url.pathname.slice(0, 3), "/r/");
      assert.ok(
        names.has(
          url.pathname
            .split("/")
            .at(-1)
            .replace(/\.json$/, ""),
        ),
        `${item.name} dependency ${dependency}`,
      );
    }
  }
  const preset = registry.items.find(({ name }) => name === "ninaero");
  assert.equal(preset.type, "registry:base");
  assert.equal(preset.registryDependencies.length, components.length + 1);
});

test("registry URLs fail loudly on unsupported or ambiguous values", () => {
  assert.equal(normalizeRegistryUrl("https://example.com/r/"), "https://example.com/r");
  for (const url of [
    "file:///tmp/r",
    "https://user:password@example.com/r",
    "https://example.com/r?q=1",
    "https://example.com/r#theme",
  ]) {
    assert.throws(() => normalizeRegistryUrl(url));
  }
});

test("missing component packages fail before publishing artifacts", () => {
  assert.throws(() => createRegistry(theme, {}, components), /Missing package dependency/);
});
