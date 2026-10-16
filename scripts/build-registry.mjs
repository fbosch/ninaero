import { mkdir, readFile, writeFile } from "node:fs/promises";

import catalog from "../registry/ninaero/catalog.json" with { type: "json" };
import { theme } from "../registry/ninaero/theme.mjs";
import { readCatalogSources, resolveCatalog } from "./lib/catalog.mjs";
import { createComponentDocs, readPreviewSources } from "./lib/component-docs.mjs";
import { componentGuides } from "./lib/component-guides.mjs";
import { createRegistry, defaultRegistryUrl, renderThemeCss } from "./lib/theme.mjs";

const root = new URL("../", import.meta.url);
let manifest;
try {
  manifest = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
} catch (cause) {
  throw new Error("Cannot read package.json for registry generation.", {
    cause,
  });
}
const sources = await readCatalogSources(catalog, root);
const components = resolveCatalog(catalog, sources);
const registry = createRegistry(
  theme,
  manifest.dependencies,
  components,
  process.env.REGISTRY_URL ?? defaultRegistryUrl,
);
const documentation = createComponentDocs(
  components,
  sources,
  await readPreviewSources(root),
  process.env.REGISTRY_URL ?? defaultRegistryUrl,
  componentGuides,
);
await mkdir(new URL("generated/", root), { recursive: true });
await Promise.all([
  writeFile(
    new URL("generated/component-docs.json", root),
    `${JSON.stringify(documentation, null, 2)}\n`,
  ),
  writeFile(new URL("app/globals.css", root), renderThemeCss(theme)),
  writeFile(new URL("registry.json", root), `${JSON.stringify(registry, null, 2)}\n`),
]);
console.log(`Generated theme CSS and registry for ${registry.homepage}.`);
