import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import catalog from "../../../registry/ninaero/catalog.json" with { type: "json" };
import { readCatalogSources, resolveCatalog } from "../catalog.mjs";
import {
  releaseRegistryError,
  typescriptDiagnostics,
  validateCatalog,
  validateGeneratedRegistry,
} from "../shadcn-check.mjs";

const root = new URL("../../../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const buttonPath = "registry/ninaero/ui/button.tsx";
const validCatalog = {
  items: [
    {
      name: "button",
      type: "registry:ui",
      packages: [],
      items: [],
      files: [{ path: buttonPath, type: "registry:ui" }],
    },
  ],
};
const validSources = { [buttonPath]: "export function Button() {}" };
const outputOptions = {
  catalogItems: validCatalog.items,
  packageVersions: {},
  registryUrl: "https://registry.example/r",
};

test("resolved production catalog and generated dependencies satisfy registry policy", async () => {
  const sources = await readCatalogSources(catalog, root);
  const items = resolveCatalog(catalog, sources);
  assert.deepEqual(
    validateCatalog({
      catalog: { ...catalog, items },
      sources,
      dependencies: manifest.dependencies,
    }),
    [],
  );
  const { theme } = await import("../../../registry/ninaero/theme.mjs");
  const { createRegistry } = await import("../theme.mjs");
  assert.deepEqual(
    validateGeneratedRegistry(
      createRegistry(theme, manifest.dependencies, items, outputOptions.registryUrl),
      {
        catalogItems: items,
        packageVersions: manifest.dependencies,
        registryUrl: outputOptions.registryUrl,
      },
    ),
    [],
  );
});

test("preview imports cannot become installable dependencies", () => {
  const sources = { [buttonPath]: 'import { Card } from "@/components/examples/card";' };
  const errors = validateCatalog({ catalog: validCatalog, sources, dependencies: {} });
  assert.ok(errors.some((error) => error.includes("outside registered installable sources")));
});

test("registering a preview-only file does not bypass source boundaries", () => {
  const input = structuredClone(validCatalog);
  input.items[0].type = "registry:file";
  input.items[0].files = [
    {
      path: "components/home-background/bubbles.ts",
      type: "registry:file",
      target: "lib/bubbles.ts",
    },
  ];
  const errors = validateCatalog({
    catalog: input,
    sources: { "components/home-background/bubbles.ts": "" },
    dependencies: {},
  });
  assert.ok(errors.some((error) => error.includes("outside installable roots")));
});

test("catalog rejects missing package declarations and missing package versions", () => {
  const sources = { [buttonPath]: 'import "cn";' };
  const undeclared = validateCatalog({
    catalog: validCatalog,
    sources,
    dependencies: { cn: "^1.0.0" },
  });
  assert.ok(undeclared.some((error) => error.includes("missing package dependency cn")));
  const input = structuredClone(validCatalog);
  input.items[0].packages = ["cn"];
  const unversioned = validateCatalog({ catalog: input, sources, dependencies: {} });
  assert.ok(unversioned.some((error) => error.includes("has no version")));
});

test("relative re-exports and dynamic imports require registry dependencies", () => {
  const input = structuredClone(validCatalog);
  input.items.push({
    name: "dialog",
    type: "registry:ui",
    packages: [],
    items: [],
    files: [{ path: "registry/ninaero/ui/dialog.tsx", type: "registry:ui" }],
  });
  const sources = {
    ...validSources,
    "registry/ninaero/ui/dialog.tsx": 'export { Button } from "./button"; import("./button");',
  };
  const errors = validateCatalog({ catalog: input, sources, dependencies: {} });
  assert.ok(errors.some((error) => error.includes("missing registry dependency button")));
  input.items[1].items = ["button"];
  assert.deepEqual(validateCatalog({ catalog: input, sources, dependencies: {} }), []);
});

test("catalog rejects duplicate item names and file owners", () => {
  const input = structuredClone(validCatalog);
  input.items.push(structuredClone(input.items[0]));
  const errors = validateCatalog({ catalog: input, sources: validSources, dependencies: {} });
  assert.ok(errors.some((error) => error.includes("Duplicate catalog item")));
  assert.ok(errors.some((error) => error.includes("multiple registry owners")));
});

test("catalog rejects missing sources and unknown registry dependencies", () => {
  const input = structuredClone(validCatalog);
  input.items[0].items = ["missing"];
  const errors = validateCatalog({ catalog: input, sources: {}, dependencies: {} });
  assert.ok(errors.some((error) => error.includes("missing source")));
  input.items[0].files.push({ path: "registry/ninaero/ui/extra.tsx", type: "registry:ui" });
  const withSource = validateCatalog({ catalog: input, sources: validSources, dependencies: {} });
  assert.ok(withSource.some((error) => error.includes("unknown registry item dependency")));
});

test("file and page payloads require safe consumer targets", () => {
  for (const target of [
    undefined,
    "",
    "../../outside.ts",
    "/tmp/outside.ts",
    "https://host/file.ts",
    "C:\\outside.ts",
  ]) {
    const input = structuredClone(validCatalog);
    input.items[0].files[0] = { path: buttonPath, type: "registry:file", target };
    const errors = validateCatalog({ catalog: input, sources: validSources, dependencies: {} });
    assert.ok(
      errors.some((error) => error.includes("target")),
      String(target),
    );
  }
});

test("generated registry rejects bare, external, missing, and malformed dependency addresses", () => {
  for (const address of [
    "button",
    "https://other.example/r/button.json",
    "https://registry.example/r/missing.json",
    "https://registry.example/r/%ZZ.json",
    "https://user:pass@registry.example/r/button.json",
  ]) {
    const errors = validateGeneratedRegistry(
      { items: [{ name: "button", registryDependencies: [address] }] },
      outputOptions,
    );
    assert.ok(errors.length > 0, address);
  }
  assert.ok(
    validateGeneratedRegistry({ items: [] }, { ...outputOptions, registryUrl: "invalid" }).some(
      (error) => error.includes("Invalid registry URL"),
    ),
  );
});

test("generated items must carry their own dependencies even when another item supplies them", () => {
  const catalogItems = [{ ...validCatalog.items[0], packages: ["cn"], items: ["icons"] }];
  const output = { items: [{ name: "button" }, { name: "icons", dependencies: ["cn@^1.0.0"] }] };
  const options = { ...outputOptions, catalogItems, packageVersions: { cn: "^1.0.0" } };
  const errors = validateGeneratedRegistry(output, options);
  assert.ok(errors.some((error) => error.includes("missing package dependency cn@^1.0.0")));
  assert.ok(errors.some((error) => error.includes("missing registry dependency icons")));
  output.items[0].dependencies = ["cn@^1.0.0"];
  output.items[0].registryDependencies = ["https://registry.example/r/icons.json"];
  assert.deepEqual(validateGeneratedRegistry(output, options), []);
});

test("release checks require a public HTTPS registry directory", () => {
  for (const value of [
    undefined,
    "",
    "not a URL",
    "http://localhost:3000/r",
    "https://localhost./r",
    "https://registry.internal/r",
    "https://registry/r",
    "https://10.0.0.4/r",
    "https://127.0.0.1/r",
    "https://[::1]/r",
    "https://[fd00::1]/r",
    "https://registry.ninaero.com",
    "https://registry.ninaero.com/r?token=123",
    "https://user:pass@registry.ninaero.com/r",
  ]) {
    assert.equal(typeof releaseRegistryError(value), "string", String(value));
  }
  assert.equal(releaseRegistryError("https://registry.ninaero.com/r"), null);
  assert.equal(releaseRegistryError("https://registry.ninaero.com/prefix/r/"), null);
});

test("consumer compiler reports real type errors and malformed configuration", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ninaero-ts-check-"));
  try {
    const config = join(directory, "tsconfig.json");
    const source = join(directory, "consumer.ts");
    await writeFile(
      config,
      JSON.stringify({ compilerOptions: { strict: true, noEmit: true }, include: ["consumer.ts"] }),
    );
    await writeFile(source, "const count: number = 1;");
    assert.equal(typescriptDiagnostics(config).length, 0);
    await writeFile(source, 'const count: number = "wrong";');
    assert.ok(typescriptDiagnostics(config).some((diagnostic) => diagnostic.code === 2322));
    await writeFile(config, "{");
    assert.ok(typescriptDiagnostics(config).length > 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
