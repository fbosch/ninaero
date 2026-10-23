import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import { defaultAccent } from "./accent-config.mjs";
import { loadSyntaxThemePair, syntaxTokenStyles } from "./syntax-themes.mjs";

const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
};
const aliases = {
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
};

let highlighterPromise;
const themePromises = new Map();
const languagePromises = new Map();

export function getSyntaxHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    themes: [],
    langs: [],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  }).catch((error) => {
    highlighterPromise = undefined;
    throw error;
  });
  return highlighterPromise;
}

function loadThemes(accent) {
  if (!themePromises.has(accent)) {
    const pending = Promise.all([getSyntaxHighlighter(), loadSyntaxThemePair(accent)])
      .then(async ([instance, pair]) => {
        await instance.loadTheme(pair.light, pair.dark);
        return { light: pair.light.name, dark: pair.dark.name };
      })
      .catch((error) => {
        themePromises.delete(accent);
        throw error;
      });
    themePromises.set(accent, pending);
  }
  return themePromises.get(accent);
}

function loadLanguage(language) {
  if (!languagePromises.has(language)) {
    const pending = getSyntaxHighlighter()
      .then((instance) => instance.loadLanguage(languages[language]))
      .catch((error) => {
        languagePromises.delete(language);
        throw error;
      });
    languagePromises.set(language, pending);
  }
  return languagePromises.get(language);
}

export async function loadCodeHighlighter(language, accent = defaultAccent) {
  const normalized = language.toLowerCase();
  const lang = aliases[normalized] ?? normalized;
  if (lang !== "ansi" && !Object.hasOwn(languages, lang)) return null;

  const [instance, themes] = await Promise.all([
    getSyntaxHighlighter(),
    loadThemes(accent),
    lang === "ansi" ? undefined : loadLanguage(lang),
  ]);
  return {
    highlight(code, state) {
      const tokenize = (text) =>
        instance.codeToTokens(text, {
          lang,
          themes,
          defaultColor: false,
          cssVariablePrefix: "--n-",
          grammarState: state,
        }).tokens;
      const tokens =
        lang === "ansi" ? code.split("\n").flatMap((line) => tokenize(line)) : tokenize(code);
      return {
        lines: tokens.map((line) =>
          line.map((token) => ({
            content: token.content,
            style: syntaxTokenStyles(token.htmlStyle),
          })),
        ),
        state: instance.getLastGrammarState(tokens),
      };
    },
  };
}
