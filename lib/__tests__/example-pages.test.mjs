import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import ts from "typescript";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");
const helper = await read("lib/example-source.ts");
const compiled = ts.transpileModule(helper, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { settingsExampleSource } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("the copyable settings example compiles after inlining its local state", async () => {
  const [preview, state] = await Promise.all([
    read("components/examples/settings-preview.tsx"),
    read("components/examples/settings-state.ts"),
  ]);
  const source = settingsExampleSource(preview, state);
  const result = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
  });
  assert.deepEqual(result.diagnostics, []);
});
