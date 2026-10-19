import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import ts from "typescript";

async function importTypeScript(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
}

const { parseComponentProgress } = await importTypeScript("../component-progress.ts");
const { overviewItems } = await importTypeScript("../component-overview.ts");

test("progress counts only checked component entries", () => {
  const markdown = "# Components\n\n- [x] `button`\n- [ ] `input`\n- [X] `dialog`\n";
  assert.deepEqual(parseComponentProgress(markdown, ["button", "input", "dialog"]), {
    themed: 2,
    total: 3,
  });
});

test("progress supports no completed components and full completion", () => {
  assert.deepEqual(parseComponentProgress("- [ ] `button`", ["button"]), {
    themed: 0,
    total: 1,
  });
  assert.deepEqual(parseComponentProgress("- [x] `button`", ["button"]), {
    themed: 1,
    total: 1,
  });
});

test("headings, prose, blank lines, and CRLF do not affect progress", () => {
  const markdown = "# Components\r\n\r\nCheck each component.\r\n\r\n- [x] `button`\r\n";
  assert.deepEqual(parseComponentProgress(markdown, ["button"]), { themed: 1, total: 1 });
});

test("missing, unknown, and duplicate entries cannot skew the count", () => {
  assert.throws(
    () => parseComponentProgress("- [x] `button`", ["button", "input"]),
    /Missing components in COMPONENTS.md: input/,
  );
  assert.throws(
    () => parseComponentProgress("- [x] `unknown`", ["button"]),
    /Unknown component in COMPONENTS.md: unknown/,
  );
  assert.throws(
    () => parseComponentProgress("- [x] `button`\n- [ ] `button`", ["button"]),
    /Duplicate component in COMPONENTS.md: button/,
  );
});

test("malformed checklist entries fail instead of disappearing from progress", () => {
  for (const entry of ["- [y] `button`", "- [x] button", "- [ ] `button` extra"]) {
    assert.throws(() => parseComponentProgress(entry, ["button"]), /Malformed component checklist/);
  }
});

test("the local checklist covers the complete catalogue", async () => {
  const markdown = await readFile(new URL("../../COMPONENTS.md", import.meta.url), "utf8");
  const progress = parseComponentProgress(
    markdown,
    overviewItems.map(({ name }) => name),
  );
  assert.equal(progress.total, overviewItems.length);
  assert.ok(progress.themed >= 0 && progress.themed <= progress.total);
});
