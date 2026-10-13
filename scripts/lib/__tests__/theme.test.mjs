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

test("the shared theme installs Nunito Sans for interface text and headings", () => {
  const registry = createRegistry(
    theme,
    manifest.dependencies,
    components,
    "https://ninaero.example/r",
  );
  const item = registry.items.find(({ name }) => name === "theme");
  const font = registry.items.find(({ name }) => name === "font-nunito-sans");

  assert.deepEqual(item.registryDependencies, ["https://ninaero.example/r/font-nunito-sans.json"]);
  assert.equal(font.type, "registry:font");
  assert.deepEqual(font.font, theme.font);
  assert.equal(font.font.import, "Nunito_Sans");
  assert.equal(font.font.provider, "google");
  assert.deepEqual(font.font.subsets, ["latin", "latin-ext"]);
  assert.equal(theme.theme["font-heading"], "var(--font-sans)");
  assert.equal(theme.theme["font-sans"], `var(${font.font.variable}, ${font.font.family})`);
  assert.ok(renderThemeCss(theme).includes(`--font-sans: ${theme.theme["font-sans"]};`));
});

test("the site loads the shared Nunito Sans variable with Next.js", async () => {
  const layout = await readFile(new URL("../../../app/layout.tsx", import.meta.url), "utf8");

  assert.match(layout, /import \{ Nunito_Sans \} from "next\/font\/google"/);
  assert.match(layout, /const nunitoSans = Nunito_Sans\(/);
  assert.ok(layout.includes(`variable: "${theme.font.variable}"`));
  assert.ok(
    layout.includes(`subsets: ${JSON.stringify(theme.font.subsets).replaceAll(",", ", ")}`),
  );
  assert.match(layout, /className=\{nunitoSans.variable\}/);
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
