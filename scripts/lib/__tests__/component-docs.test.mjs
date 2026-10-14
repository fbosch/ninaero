import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

import ts from "typescript";

import catalog from "../../../registry/ninaero/catalog.json" with { type: "json" };
import { readCatalogSources, resolveCatalog } from "../catalog.mjs";
import { createComponentDocs, readPreviewSources } from "../component-docs.mjs";

const root = new URL("../../../", import.meta.url);
const catalogSources = await readCatalogSources(catalog, root);
const components = resolveCatalog(catalog, catalogSources);
const previewSources = await readPreviewSources(root);
const uiComponents = components.filter(({ type }) => type === "registry:ui");
const docs = createComponentDocs(
  components,
  catalogSources,
  previewSources,
  "https://example.test/registry/",
);
const docsByName = new Map(docs.items.map((item) => [item.name, item]));

function componentNamed(name) {
  const component = uiComponents.find((item) => item.name === name);
  assert.ok(component, `missing registry component ${name}`);
  return component;
}

test("generated docs cover every UI registry item", () => {
  assert.equal(docs.registryUrl, "https://example.test/registry");
  assert.deepEqual(
    docs.items.map(({ name }) => name).sort(),
    uiComponents.map(({ name }) => name).sort(),
  );
  for (const item of docs.items) {
    assert.ok(item.example.length > 0, item.name);
    assert.ok(item.installCommand.length > 0, item.name);
  }
});

test("missing component and preview sources fail loudly", () => {
  const button = componentNamed("button");
  const missingComponentSource = { ...catalogSources };
  delete missingComponentSource[button.files[0].path];
  assert.throws(
    () => createComponentDocs([button], missingComponentSource, previewSources),
    /Missing component source/,
  );

  const missingPreviewSource = { ...previewSources };
  delete missingPreviewSource["components/overview/calendar-preview.tsx"];
  assert.throws(
    () => createComponentDocs([componentNamed("calendar")], catalogSources, missingPreviewSource),
    /Missing preview source for calendar/,
  );
});

test("install commands shell-quote registry URLs including embedded apostrophes", () => {
  const item = createComponentDocs(
    [componentNamed("button")],
    catalogSources,
    previewSources,
    "https://example.test/registry/$(touch p)';echo x",
  ).items[0];
  assert.equal(
    item.installCommand,
    String.raw`pnpm dlx shadcn@latest add 'https://example.test/registry/$(touch%20p)'\'';echo%20x/button.json'`,
  );
});

test("invalid registry URLs are rejected", () => {
  assert.throws(
    () => createComponentDocs([], {}, previewSources, "javascript:alert(1)"),
    /HTTP\(S\) URL/,
  );
});

test("API extraction reports exported signatures, defaults, values, and re-exports", () => {
  const button = docsByName.get("button");
  const exportedButton = button.api.find(({ name }) => name === "Button");
  assert.equal(exportedButton.kind, "function");
  assert.match(exportedButton.props, /VariantProps/);
  assert.deepEqual(exportedButton.defaults, [
    { name: "variant", value: '"default"' },
    { name: "size", value: '"default"' },
  ]);
  assert.equal(button.api.find(({ name }) => name === "buttonVariants").kind, "value");
  assert.equal(docsByName.get("chart").api.find(({ name }) => name === "ChartConfig").kind, "type");

  const component = componentNamed("button");
  const sourcePath = component.files[0].path;
  const reExportSources = {
    ...catalogSources,
    [sourcePath]: 'export { ButtonPrimitive as Button } from "@base-ui/react/button";\n',
  };
  const reExportedButton = createComponentDocs([component], reExportSources, previewSources)
    .items[0].api[0];
  assert.deepEqual(reExportedButton, {
    name: "Button",
    kind: "re-export",
    props: "",
    defaults: [],
  });
});

test("all generated usage examples compile with consumer component and hook aliases", () => {
  const configPath = fileURLToPath(new URL("../../../tsconfig.json", import.meta.url));
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  assert.equal(configFile.error, undefined);
  const projectRoot = fileURLToPath(root);
  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    projectRoot,
    undefined,
    configPath,
  );
  const virtualFiles = new Map(
    docs.items.map((item) => [
      fileURLToPath(new URL(`.component-docs/${item.name}.tsx`, root)),
      item.example,
    ]),
  );
  const options = {
    ...parsed.options,
    baseUrl: projectRoot,
    noEmit: true,
    incremental: false,
    paths: {
      ...parsed.options.paths,
      "@/components/ui/*": ["registry/ninaero/ui/*"],
      "@/hooks/*": ["registry/ninaero/hooks/*"],
    },
  };
  const host = ts.createCompilerHost(options);
  const readFileOriginal = host.readFile.bind(host);
  const fileExistsOriginal = host.fileExists.bind(host);
  const getSourceFileOriginal = host.getSourceFile.bind(host);
  host.readFile = (fileName) => virtualFiles.get(fileName) ?? readFileOriginal(fileName);
  host.fileExists = (fileName) => virtualFiles.has(fileName) || fileExistsOriginal(fileName);
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const content = virtualFiles.get(fileName);
    if (content !== undefined) {
      return ts.createSourceFile(fileName, content, languageVersion, true, ts.ScriptKind.TSX);
    }
    return getSourceFileOriginal(fileName, languageVersion, onError, shouldCreateNewSourceFile);
  };
  const program = ts.createProgram({
    rootNames: [...virtualFiles.keys()],
    options,
    host,
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  const errors = diagnostics.filter(({ category }) => category === ts.DiagnosticCategory.Error);
  assert.equal(
    errors.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(errors, host, {
      getCurrentDirectory: () => projectRoot,
      getCanonicalFileName: (fileName) => fileName,
      getNewLine: () => "\n",
    }),
  );
});
