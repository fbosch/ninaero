import assert from "node:assert/strict";
import test from "node:test";

import { getSyntaxHighlighter, loadCodeHighlighter } from "../code-highlighter.mjs";

test("first use loads only the active accent pair and requested grammar", async () => {
  const instance = await getSyntaxHighlighter();
  assert.deepEqual(instance.getLoadedThemes(), []);
  const highlighter = await loadCodeHighlighter("tsx");
  assert.deepEqual(instance.getLoadedThemes().sort(), ["solarized-dark", "solarized-light"]);
  const code = 'export const label = "æ ø å";';
  const tokens = highlighter.highlight(code).lines.flat();
  assert.equal(tokens.map((token) => token.content).join(""), code);
  assert.ok(tokens.every((token) => Object.keys(token.style).length === 2));
  await loadCodeHighlighter("json");
  assert.deepEqual(instance.getLoadedThemes().sort(), ["solarized-dark", "solarized-light"]);
});

test("another accent loads its canonical pair and repeated requests reuse loaded themes", async () => {
  const instance = await getSyntaxHighlighter();
  const highlighter = await loadCodeHighlighter("typescript", "aurora");
  const expected = ["kanagawa-lotus", "kanagawa-wave", "solarized-dark", "solarized-light"];
  assert.deepEqual(instance.getLoadedThemes().sort(), expected);
  const source = 'const greeting = "Hello";';
  const first = highlighter.highlight(source).lines;
  const repeated = await loadCodeHighlighter("ts", "aurora");
  assert.deepEqual(repeated.highlight(source).lines, first);
  assert.deepEqual(instance.getLoadedThemes().sort(), expected);
});

test("unsupported grammars stay plain without loading another accent", async () => {
  const instance = await getSyntaxHighlighter();
  const before = [...instance.getLoadedThemes()];
  assert.equal(await loadCodeHighlighter("not-a-grammar", "sunflower"), null);
  assert.deepEqual(instance.getLoadedThemes(), before);
});

test("unknown accents fail loudly on every request", async () => {
  for (const accent of ["unknown", "__proto__", "unknown"]) {
    await assert.rejects(loadCodeHighlighter("tsx", accent), /Unknown syntax accent/);
  }
});

test("incremental highlighting preserves multiline grammar context", async () => {
  const highlighter = await loadCodeHighlighter("typescript");
  const prefix = highlighter.highlight("/* æ ø å");
  const continuation = highlighter.highlight("const count = 1; */", prefix.state);
  const complete = highlighter.highlight("/* æ ø å\nconst count = 1; */");
  assert.deepEqual(continuation.lines[0], complete.lines[1]);
});

test("ANSI highlighting preserves visible lines and uses only the active pair", async () => {
  const highlighter = await loadCodeHighlighter("ansi");
  const result = highlighter.highlight("\u001b[31merror\u001b[0m\nok");
  assert.deepEqual(
    result.lines.map((line) => line.map((token) => token.content).join("")),
    ["error", "ok"],
  );
  assert.ok(result.lines.flat().every((token) => Object.keys(token.style).length === 2));
});
