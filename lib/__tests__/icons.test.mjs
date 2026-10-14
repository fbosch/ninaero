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
const glyphs = {
  ArrowDownIcon: "arrow-down",
  ArrowRightIcon: "arrow-right",
  ArrowUpRightIcon: "arrow-up-right",
  CheckIcon: "check",
  ChevronDownIcon: "chevron-down",
  ChevronLeftIcon: "chevron-left",
  ChevronRightIcon: "chevron-right",
  ChevronUpIcon: "chevron-up",
  CircleCheckIcon: "check-circle",
  CopyIcon: "copy",
  FileTextIcon: "file-records",
  FolderIcon: "folder",
  HomeIcon: "home",
  InboxIcon: "inbox",
  InfoIcon: "information-circle",
  Loader2Icon: "reload",
  MessageCircleIcon: "message-round",
  MinusIcon: "minus",
  MonitorIcon: "laptop",
  MoonIcon: "moon",
  MoreHorizontalIcon: "dots-horizontal",
  OctagonXIcon: "multiply-circle",
  PanelLeftIcon: "layout-left",
  PlusIcon: "plus",
  SearchIcon: "search",
  SlidersHorizontalIcon: "filter",
  SunIcon: "sun",
  TriangleAlertIcon: "exclamation-triangle",
  XIcon: "multiply",
  FilePlus2Icon: "file-plus",
};

test("every shared icon renders its bundled Mage glyph on the server", async () => {
  assert.deepEqual(Object.keys(icons).sort(), Object.keys(glyphs).sort());
  for (const [name, glyph] of Object.entries(glyphs)) {
    const { default: data } = await import(`@iconify-icons/mage/${glyph}`);
    const markup = renderToStaticMarkup(createElement(icons[name]));
    assert.match(markup, /^<svg\b/, name);
    assert.match(markup, /viewBox="0 0 24 24"/, name);
    assert.match(markup, /width="24"/, name);
    assert.match(markup, /height="24"/, name);
    const sourceIds = [...data.body.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const renderedIds = [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    let expectedBody = data.body.replace(/\sstroke-width="[^"]*"/g, "");
    assert.equal(renderedIds.length, sourceIds.length, name);
    for (const [index, id] of sourceIds.entries()) {
      expectedBody = expectedBody.replaceAll(id, renderedIds[index]);
    }
    assert.ok(markup.includes(expectedBody), name);
    assert.match(markup, /stroke-width="2"/, name);
    assert.match(markup, /aria-hidden="true"/, name);
  }
});

test("outline weight can be adjusted without child-node stroke overrides", () => {
  const markup = renderToStaticMarkup(createElement(icons.CheckIcon, { strokeWidth: 3 }));
  assert.match(markup, /stroke-width="3"/);
  assert.equal((markup.match(/stroke-width=/g) ?? []).length, 1);
  assert.doesNotMatch(markup, /stroke-width="1.5"/);
});

test("icons forward SVG sizing, classes, data attributes, and refs", () => {
  const ref = { current: null };
  const props = {
    className: "size-4",
    width: 18,
    height: 20,
    "data-icon": "inline-start",
    "data-slot": "spinner",
    ref,
  };
  const element = icons.CheckIcon(props);
  assert.equal(element.props.ref, ref);
  const markup = renderToStaticMarkup(createElement(icons.CheckIcon, props));
  assert.match(markup, /width="18"/);
  assert.match(markup, /height="20"/);
  assert.match(markup, /class="[^"]*size-4/);
  assert.match(markup, /data-icon="inline-start"/);
  assert.match(markup, /data-slot="spinner"/);
});

test("labelled and explicitly exposed icons are not hidden from assistive technology", () => {
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

test("icon rendering is offline and never calls a network loader", () => {
  assert.match(source, /from "@iconify\/react\/offline"/);
  assert.doesNotMatch(source, /addCollection|loadIcon|loadIcons|fetch\(/);
  assert.doesNotMatch(source, /from "@iconify-icons\/mage"/);
  const previousFetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("Icons must not fetch data");
  };
  try {
    for (const Icon of Object.values(icons)) {
      assert.match(renderToStaticMarkup(createElement(Icon)), /^<svg\b/);
    }
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("icon-bearing registry components install the shared icon item and its packages", async () => {
  const sources = await readCatalogSources(catalog, root);
  const resolved = resolveCatalog(catalog, sources);
  const item = resolved.find(({ name }) => name === "icons");
  assert.equal(item.type, "registry:lib");
  assert.deepEqual(item.packages, ["@iconify-icons/mage", "@iconify/react"]);
  assert.equal(item.files[0].target, "@lib/icons.tsx");
  for (const component of resolved.filter(({ type }) => type === "registry:ui")) {
    const usesIcons = component.files.some(({ path }) => sources[path].includes("@/lib/icons"));
    if (usesIcons) assert.ok(component.items.includes("icons"), component.name);
    assert.ok(!component.packages.includes("lucide-react"), component.name);
  }
  const manifest = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.equal(manifest.dependencies["lucide-react"], undefined);
  const registry = createRegistry(theme, manifest.dependencies, resolved, "https://example.test/r");
  const installed = registry.items.find(({ name }) => name === "icons");
  assert.deepEqual(installed.dependencies, [
    `@iconify-icons/mage@${manifest.dependencies["@iconify-icons/mage"]}`,
    `@iconify/react@${manifest.dependencies["@iconify/react"]}`,
  ]);
  assert.ok(
    registry.items
      .find(({ name }) => name === "select")
      .registryDependencies.includes("https://example.test/r/icons.json"),
  );
});
