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

test("local CSS and registry use the same complete light and dark tokens", () => {
  const registry = createRegistry(theme, manifest.dependencies, components);
  const item = registry.items.find(({ name }) => name === "theme");
  const css = renderThemeCss(theme);
  assert.deepEqual(item.cssVars, {
    theme: theme.theme,
    light: theme.light,
    dark: theme.dark,
  });
  for (const palette of [theme.light, theme.dark]) {
    for (const [name, value] of Object.entries(palette)) {
      assert.ok(css.includes(`--${name}: ${value};`), name);
    }
  }
  assert.deepEqual(
    Object.keys(theme.dark).sort(),
    Object.keys(theme.light)
      .filter((name) => name !== "radius")
      .sort(),
  );
  assert.notEqual(theme.light.background, theme.dark.background);
  assert.notEqual(theme.theme["font-sans"], "var(--font-sans)");
  assert.ok(css.includes("@apply border-border outline-ring/50;"));
});

test("the shared theme installs self-hosted rounded Google Sans Flex", () => {
  const registry = createRegistry(
    theme,
    manifest.dependencies,
    components,
    "https://ninaero.example/r",
  );
  const item = registry.items.find(({ name }) => name === "theme");
  const font = registry.items.find(({ name }) => name === "font-google-sans-flex");

  assert.deepEqual(item.registryDependencies, [
    "https://ninaero.example/r/font-google-sans-flex.json",
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
  assert.equal(font.files, undefined);
  assert.equal(theme.font.stylesheet, "@fontsource-variable/google-sans-flex/full.css");
  assert.equal(theme.theme["font-heading"], "var(--font-sans)");
  assert.equal(theme.theme["font-sans"], theme.font.family);
  assert.equal(theme.font.roundness, 100);
  assert.equal(theme.css["@layer base"].html["font-variation-settings"], '"ROND" 100');
  assert.equal(item.css["@layer base"].html["font-variation-settings"], '"ROND" 100');

  const fontImport = `@import "${theme.font.stylesheet}";`;
  const css = renderThemeCss(theme);
  assert.ok(css.includes(fontImport));
  assert.ok(css.indexOf(fontImport) < css.indexOf("@theme inline"));
  assert.ok(css.includes(`--font-sans: ${theme.font.family};`));
  assert.ok(css.includes('font-variation-settings: "ROND" 100;'));
});

test("font package assets retain roundness and variable weights", async () => {
  const metadata = JSON.parse(
    await readFile(
      new URL(
        "../../../node_modules/@fontsource-variable/google-sans-flex/metadata.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.equal(metadata.family, "Google Sans Flex");
  assert.ok(Number(metadata.variable.ROND.min) <= theme.font.roundness);
  assert.ok(Number(metadata.variable.ROND.max) >= theme.font.roundness);
  for (const weight of [400, 500, 600]) {
    assert.ok(Number(metadata.variable.wght.min) <= weight);
    assert.ok(Number(metadata.variable.wght.max) >= weight);
  }
  const fontCss = await readFile(
    new URL(
      "../../../node_modules/@fontsource-variable/google-sans-flex/full.css",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(fontCss, /font-family: 'Google Sans Flex Variable'/);
  assert.match(fontCss, /font-weight: 1 1000/);
  assert.match(fontCss, /google-sans-flex-latin-full-normal\.woff2/);
  assert.match(fontCss, /google-sans-flex-latin-ext-full-normal\.woff2/);
});

test("every bundled item and component dependency resolves within the registry", () => {
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
      );
    }
  }
  const preset = registry.items.find(({ name }) => name === "ninaero");
  assert.equal(preset.type, "registry:base");
  assert.equal(preset.registryDependencies.length, components.length + 1);
  const dialog = registry.items.find(({ name }) => name === "dialog");
  assert.ok(dialog.registryDependencies.includes("https://ninaero.example/r/button.json"));
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
