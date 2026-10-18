import { createHighlighter } from "shiki";

import {
  syntaxThemeNames,
  syntaxThemeSelection,
  syntaxTokenStyles,
} from "../registry/ninaero/hooks/syntax-themes.mjs";

const languages = ["tsx", "typescript", "javascript", "json", "css", "bash"];
let highlighter;

/** @param {string} filename */
export function sourceLanguage(filename) {
  const extension = filename.split(".").at(-1);
  switch (extension) {
    case "tsx":
    case "jsx":
      return "tsx";
    case "ts":
      return "typescript";
    case "js":
    case "mjs":
    case "cjs":
      return "javascript";
    case "json":
      return "json";
    case "css":
      return "css";
    default:
      return "text";
  }
}

/**
 * @param {string} code
 * @param {string} language
 */
export async function highlightCode(code, language) {
  if (language !== "text" && !languages.includes(language)) {
    throw new Error(`Unsupported documentation code language: ${language}`);
  }
  highlighter ??= createHighlighter({
    themes: syntaxThemeNames,
    langs: languages,
  });
  const instance = await highlighter;
  const { tokens } = instance.codeToTokens(code.replace(/\r\n|\r/g, "\n"), {
    lang: language,
    themes: syntaxThemeSelection,
    defaultColor: false,
    cssVariablePrefix: "--n-",
  });
  const separators = code.match(/\r\n|\r|\n/g) ?? [];
  let offset = 0;
  const highlighted = tokens.flatMap((line, index) => [
    ...line.map((token) => ({
      content: token.content,
      style: syntaxTokenStyles(token.htmlStyle),
    })),
    ...(index < separators.length ? [{ content: separators[index], style: undefined }] : []),
  ]);
  return highlighted
    .filter((token) => token.content.length > 0)
    .map((token) => {
      const positioned = { ...token, offset };
      offset += token.content.length;
      return positioned;
    });
}
