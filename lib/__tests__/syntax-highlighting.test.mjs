import assert from "node:assert/strict";
import test from "node:test";
import { highlightCode, sourceLanguage } from "../syntax-highlighting.mjs";

test("source filenames select the appropriate grammar", () => {
  for (const [filename, expected] of [
    ["button.tsx", "tsx"],
    ["example.jsx", "tsx"],
    ["use-mobile.ts", "typescript"],
    ["theme.mjs", "javascript"],
    ["utils.js", "javascript"],
    ["script.cjs", "javascript"],
    ["registry.json", "json"],
    ["globals.css", "css"],
    ["README.md", "text"],
  ]) {
    assert.equal(sourceLanguage(filename), expected);
  }
});

test("all documentation grammars produce dual-theme colored tokens", async () => {
  for (const [language, code] of [
    ["tsx", "export const Example = () => <Button>Hello</Button>;"],
    ["typescript", "type Props = { disabled?: boolean };"],
    ["javascript", "export const count = 1;"],
    [
      "bash",
      "pnpm dlx shadcn@latest add 'http://localhost:3000/r/button.json'",
    ],
    ["json", '{"primary": "#79cfe5"}'],
    ["css", ":root { --primary: cyan; }"],
  ]) {
    const tokens = await highlightCode(code, language);
    assert.equal(tokens.map((token) => token.content).join(""), code);
    assert.ok(new Set(tokens.map((token) => token.light)).size > 1, language);
    assert.ok(
      tokens.every((token) => token.light && token.dark),
      language,
    );
    assert.ok(
      tokens.some((token) => token.light !== token.dark),
      language,
    );
    assert.equal(
      new Set(tokens.map((token) => token.offset)).size,
      tokens.length,
    );
  }
});

test("tokens preserve whitespace, line endings, empty code, and Danish text", async () => {
  for (const code of [
    "",
    "\n",
    'const label = "æ ø å";\n',
    "  const value = 1;\r\n\r\n",
    "const value = 1;\rconst next = 2;",
    "\tconst value = 1;  ",
  ]) {
    const tokens = await highlightCode(code, "tsx");
    assert.equal(tokens.map((token) => token.content).join(""), code);
  }
});

test("HTML-like source remains inert text tokens, never generated markup", async () => {
  const code = '<script>alert("x")</script>\n<img src=x onerror=alert(1) />';
  const tokens = await highlightCode(code, "tsx");
  assert.equal(tokens.map((token) => token.content).join(""), code);
  for (const token of tokens) {
    assert.equal(typeof token.content, "string");
    for (const color of [token.light, token.dark]) {
      assert.ok(color === undefined || /^#[0-9a-f]{6,8}$/i.test(color), color);
    }
  }
});

test("unknown source extensions are plain text and invalid grammars fail loudly", async () => {
  const code = "<unknown>& text";
  const tokens = await highlightCode(code, "text");
  assert.equal(tokens.map((token) => token.content).join(""), code);
  await assert.rejects(highlightCode(code, "not-a-grammar"), /Unsupported/);
});
