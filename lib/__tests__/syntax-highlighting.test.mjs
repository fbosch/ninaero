import assert from "node:assert/strict";
import test from "node:test";

import { createHighlighter } from "shiki";

import { accentNames } from "../../registry/ninaero/accents.mjs";
import {
  syntaxColor,
  syntaxThemeNames,
  syntaxThemePairs,
} from "../../registry/ninaero/hooks/syntax-themes.mjs";
import { highlightCode, highlightCodeLines, sourceLanguage } from "../syntax-highlighting.mjs";

test("documentation code rows preserve blank lines without adding a trailing numbered row", async () => {
  for (const [code, expected] of [
    ["", [""]],
    ["\n", [""]],
    ["\n\n", ["", ""]],
    ['const label = "æ ø å";\n', ['const label = "æ ø å";']],
    ["  const value = 1;\r\n\r\n", ["  const value = 1;", ""]],
    ["const value = 1;\rconst next = 2;", ["const value = 1;", "const next = 2;"]],
    ["\tconst value = 1;  ", ["\tconst value = 1;  "]],
  ]) {
    const lines = await highlightCodeLines(code, "tsx");
    assert.deepEqual(
      lines.map((tokens) => tokens.map((token) => token.content).join("")),
      expected,
    );

    for (const token of lines.flat()) {
      assert.equal(code.slice(token.offset, token.offset + token.content.length), token.content);
    }
  }
});

test("multiline documentation code retains grammar context across rows", async () => {
  const code = "/* æ ø å\n * const count = 1;\n */\nconst count = 1;";
  const lines = await highlightCodeLines(code, "typescript");

  assert.deepEqual(
    lines.map((tokens) => tokens.map((token) => token.content).join("")),
    code.split("\n"),
  );
  assert.notDeepEqual(
    lines[1].find((token) => token.content.includes("const")).style,
    lines[3].find((token) => token.content === "const").style,
  );
});

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

test("all documentation grammars preserve source and vary token styles", async () => {
  for (const [language, code] of [
    ["tsx", "export const Example = () => <Button>Hello</Button>;"],
    ["typescript", "type Props = { disabled?: boolean };"],
    ["javascript", "export const count = 1;"],
    ["bash", "pnpm dlx shadcn@latest add 'http://localhost:3000/r/button.json'"],
    ["json", '{"primary": "#79cfe5"}'],
    ["css", ":root { --primary: cyan; }"],
  ]) {
    const tokens = await highlightCode(code, language);
    assert.equal(tokens.map((token) => token.content).join(""), code);
    assert.ok(
      new Set(
        tokens.filter((token) => token.content.trim()).map((token) => JSON.stringify(token.style)),
      ).size > 1,
      language,
    );
    assert.equal(new Set(tokens.map((token) => token.offset)).size, tokens.length);
  }
});

test("theme pairings cover every accent and preserve distinct grammar roles", async () => {
  assert.deepEqual(Object.keys(syntaxThemePairs), accentNames);
  assert.equal(new Set(syntaxThemeNames).size, accentNames.length * 2);

  const tokens = await highlightCode(
    '// Welcome the visitor\nexport function greet(name) { return "Hello, " + name; }',
    "typescript",
  );
  const roles = ["Welcome the visitor", "export", "greet", "Hello, "];
  const styles = roles.map(
    (content) => tokens.find((token) => token.content.includes(content))?.style,
  );
  assert.ok(styles.every(Boolean));
  assert.equal(new Set(styles.map((style) => JSON.stringify(style))).size, roles.length);
  for (const token of tokens) {
    assert.ok(Object.keys(token.style ?? {}).every((property) => !property.includes("font-style")));
  }
});

test("bundled theme token colors remain readable on neutral code surfaces", async () => {
  const luminance = (color) => {
    const channels = color
      .match(/[\da-f]{2}/gi)
      .map((channel) => Number.parseInt(channel, 16) / 255);
    const [red, green, blue] = channels.map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const contrast = (foreground, background) => {
    const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
  };
  const highlighter = await createHighlighter({
    themes: syntaxThemeNames,
    langs: ["tsx", "bash", "json", "css"],
  });
  const samples = [
    ["tsx", '// Note\nexport function greet(name) { return <Button>{"Hello"}</Button>; }'],
    ["bash", "pnpm dlx shadcn@latest add button"],
    ["json", '{"enabled": true, "name": "Ninaero"}'],
    ["css", ":root { --primary: cyan; }"],
  ];

  for (const [accent, pair] of Object.entries(syntaxThemePairs)) {
    for (const [mode, theme] of Object.entries(pair)) {
      const backgrounds =
        mode === "light" ? ["#ffffff", "#f0f0f0"] : ["#171717", "#2b2b2b", "#3c3c3c"];
      for (const [lang, code] of samples) {
        const tokens = highlighter.codeToTokens(code, { lang, theme }).tokens.flat();
        for (const token of tokens) {
          if (!token.color) continue;
          const color = syntaxColor(token.color, mode);
          for (const background of backgrounds) {
            assert.ok(
              contrast(color, background) >= 4.5,
              `${accent}/${mode} ${lang}: ${color} on ${background}`,
            );
          }
        }
      }
    }
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
});

test("unknown source extensions are plain text and invalid grammars fail loudly", async () => {
  const code = "<unknown>& text";
  const tokens = await highlightCode(code, "text");
  assert.equal(tokens.map((token) => token.content).join(""), code);
  await assert.rejects(highlightCode(code, "not-a-grammar"), /Unsupported/);
});
