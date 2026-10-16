import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

import catalog from "../../registry/ninaero/catalog.json" with { type: "json" };
import { theme } from "../../registry/ninaero/theme.mjs";
import { readCatalogSources, resolveCatalog } from "../../scripts/lib/catalog.mjs";
import { createRegistry } from "../../scripts/lib/theme.mjs";

const root = new URL("../../", import.meta.url);
const source = await readFile(new URL("lib/icons.tsx", root), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const linked = compiled.replace(
  /from "([^"]+)"/g,
  (_, specifier) => `from "${import.meta.resolve(specifier)}"`,
);
const icons = await import(`data:text/javascript;base64,${Buffer.from(linked).toString("base64")}`);

test("shared icons render as decorative SVGs on the server without network requests", () => {
  const previousFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = () => {
    fetchCalls++;
    throw new Error("Icons must not fetch data");
  };
  try {
    for (const [name, Icon] of Object.entries(icons)) {
      const markup = renderToStaticMarkup(createElement(Icon));
      assert.match(markup, /^<svg\b/, name);
      assert.match(markup, /aria-hidden="true"/, name);
    }
  } finally {
    globalThis.fetch = previousFetch;
  }
  assert.equal(fetchCalls, 0);
});

test("labelled and explicitly exposed icons remain available to assistive technology", () => {
  for (const props of [
    { "aria-label": "Loading", role: "status" },
    { "aria-labelledby": "icon-description" },
    { "aria-hidden": false },
  ]) {
    const markup = renderToStaticMarkup(createElement(icons.Loader2Icon, props));
    assert.doesNotMatch(markup, /aria-hidden="true"/);
  }
  const hidden = renderToStaticMarkup(
    createElement(icons.CheckIcon, { "aria-label": "Decorative", "aria-hidden": true }),
  );
  assert.match(hidden, /aria-hidden="true"/);
});

test("icon props preserve caller sizing and data attributes in server output", () => {
  const markup = renderToStaticMarkup(
    createElement(icons.CheckIcon, {
      width: 18,
      height: 20,
      "data-icon": "inline-start",
      "data-slot": "spinner",
    }),
  );
  assert.match(markup, /width="18"/);
  assert.match(markup, /height="20"/);
  assert.match(markup, /data-icon="inline-start"/);
  assert.match(markup, /data-slot="spinner"/);
});

test("registry installation includes the shared icon item and its runtime packages", async () => {
  const sources = await readCatalogSources(catalog, root);
  const resolved = resolveCatalog(catalog, sources);
  const item = resolved.find(({ name }) => name === "icons");
  assert.equal(item.type, "registry:lib");
  assert.deepEqual(item.packages, ["@iconify-icons/solar", "@iconify/react"]);
  assert.equal(item.files[0].target, "@lib/icons.tsx");

  const manifest = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  const registry = createRegistry(theme, manifest.dependencies, resolved, "https://example.test/r");
  const installed = registry.items.find(({ name }) => name === "icons");
  assert.deepEqual(installed.dependencies, [
    `@iconify-icons/solar@${manifest.dependencies["@iconify-icons/solar"]}`,
    `@iconify/react@${manifest.dependencies["@iconify/react"]}`,
  ]);
  assert.ok(
    registry.items
      .find(({ name }) => name === "select")
      .registryDependencies.includes("https://example.test/r/icons.json"),
  );
});
