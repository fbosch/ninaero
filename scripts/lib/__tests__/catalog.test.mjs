import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";

import catalog from "../../../registry/ninaero/catalog.json" with { type: "json" };
import { readCatalogSources, resolveCatalog } from "../catalog.mjs";

const root = new URL("../../../", import.meta.url);
const sources = await readCatalogSources(catalog, root);
const resolved = resolveCatalog(catalog, sources);

test("the catalog lists every installable UI component source and supporting hook", async () => {
  const files = (await readdir(new URL("registry/ninaero/ui/", root), { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  const declared = catalog.items
    .filter((item) => item.type === "registry:ui")
    .flatMap((item) => item.files.map((file) => file.path.split("/").at(-1)))
    .sort();
  assert.deepEqual(declared, files);
  assert.deepEqual(
    catalog.excluded.map(({ name }) => name),
    ["form"],
  );
  assert.ok(resolved.some((item) => item.name === "use-mobile"));
  assert.ok(resolved.some((item) => item.name === "utils"));
});

test("source imports supplement upstream package and registry dependencies", () => {
  const button = resolved.find(({ name }) => name === "button");
  assert.ok(button.packages.includes("class-variance-authority"));
  const sidebar = resolved.find(({ name }) => name === "sidebar");
  assert.ok(sidebar.items.includes("use-mobile"));
  assert.ok(sidebar.items.includes("tooltip"));
  const calendar = resolved.find(({ name }) => name === "calendar");
  assert.ok(calendar.items.includes("icons"));
  const sonner = resolved.find(({ name }) => name === "sonner");
  assert.ok(sonner.packages.includes("sonner"));
  assert.ok(sonner.packages.includes("next-themes"));
});

const fixture = {
  items: [
    {
      name: "button",
      packages: [],
      items: [],
      files: [{ path: "registry/ninaero/ui/button.tsx" }],
    },
    {
      name: "dialog",
      packages: [],
      items: [],
      files: [{ path: "registry/ninaero/ui/dialog.tsx" }],
    },
  ],
};

test("relative imports, re-exports, and scoped package subpaths resolve correctly", () => {
  const items = resolveCatalog(fixture, {
    "registry/ninaero/ui/button.tsx":
      'import type { ReactNode } from "react"; export { cva } from "class-variance-authority";',
    "registry/ninaero/ui/dialog.tsx":
      'import { Button } from "./button"; import { Dialog } from "@base-ui/react/dialog";',
  });
  assert.deepEqual(items[0].packages, ["class-variance-authority"]);
  assert.deepEqual(items[1].packages, ["@base-ui/react"]);
  assert.deepEqual(items[1].items, ["button"]);
});

test("unregistered source imports fail rather than publishing broken components", () => {
  assert.throws(
    () =>
      resolveCatalog(fixture, {
        "registry/ninaero/ui/button.tsx": "",
        "registry/ninaero/ui/dialog.tsx":
          'import { Missing } from "@/registry/ninaero/ui/missing";',
      }),
    /Unregistered import/,
  );
});

test("missing source files and registry dependencies fail loudly", () => {
  assert.throws(() => resolveCatalog(fixture, {}), /Missing catalogue source/);
  assert.throws(
    () =>
      resolveCatalog(
        { items: [{ ...fixture.items[0], items: ["missing"] }] },
        { "registry/ninaero/ui/button.tsx": "" },
      ),
    /Unknown registry dependency/,
  );
});
