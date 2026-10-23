import { defaultAccent } from "../registry/ninaero/hooks/accent-config.mjs";
import { loadCodeHighlighter } from "../registry/ninaero/hooks/code-highlighter.mjs";

const languages = ["tsx", "typescript", "javascript", "json", "css", "bash"];

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
export async function highlightCode(code, language, accent = defaultAccent) {
  if (language !== "text" && !languages.includes(language)) {
    throw new Error(`Unsupported documentation code language: ${language}`);
  }
  const normalized = code.replace(/\r\n|\r/g, "\n");
  const highlighter = language === "text" ? null : await loadCodeHighlighter(language, accent);
  const tokens = highlighter
    ? highlighter.highlight(normalized).lines
    : normalized.split("\n").map((content) => [{ content, style: undefined }]);
  const separators = code.match(/\r\n|\r|\n/g) ?? [];
  let offset = 0;
  const highlighted = tokens.flatMap((line, index) => [
    ...line.map((token) => ({
      content: token.content,
      style: token.style,
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

/**
 * @param {string} code
 * @param {string} language
 */
export async function highlightCodeLines(code, language, accent = defaultAccent) {
  const lines = [[]];

  for (const token of await highlightCode(code, language, accent)) {
    if (/^(?:\r\n|\r|\n)$/.test(token.content)) {
      lines.push([]);
    } else {
      lines.at(-1).push(token);
    }
  }

  if (/[\r\n]$/.test(code)) lines.pop();

  return lines;
}
