"use client";

import * as React from "react";

import { defaultAccent } from "./accent-config.mjs";
import type { CodeHighlighter, SyntaxToken } from "./code-highlighter.mjs";

export type InitialHighlight = {
  value: string;
  language: string;
  accent: string;
  lines: React.ReactNode[];
};

function renderLines(lines: SyntaxToken[][]) {
  return lines.map((line) =>
    line.map((token, index) =>
      React.createElement(
        "span",
        {
          key: index,
          style: token.style as React.CSSProperties,
          className: "ninaero-syntax-token",
        },
        token.content,
      ),
    ),
  );
}

export function useHighlightedCode(value: string, language: string, initial?: InitialHighlight) {
  const code = value.replace(/\r\n|\r/g, "\n").replace(/\n$/, "");
  const [element, setElement] = React.useState<HTMLSpanElement | null>(null);
  const [accent, setAccent] = React.useState<string | null>(null);
  const initialLines =
    initial?.value === value && initial.language === language ? initial.lines : null;
  const showInitial = initialLines !== null && (accent === null || accent === initial?.accent);

  React.useEffect(() => {
    if (!element) return;
    function syncAccent() {
      setAccent(element?.closest("[data-accent]")?.getAttribute("data-accent") ?? defaultAccent);
    }
    syncAccent();
    const observer = new MutationObserver(syncAccent);
    for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, { attributes: true, attributeFilter: ["data-accent"] });
    }
    return () => observer.disconnect();
  }, [element]);

  const [loaded, setLoaded] = React.useState<{
    language: string;
    highlighter: CodeHighlighter | null;
  } | null>(null);
  const highlighter = !showInitial && loaded?.language === language ? loaded.highlighter : null;

  React.useEffect(() => {
    if (accent === null || showInitial) return;
    let cancelled = false;
    import("./code-highlighter.mjs")
      .then(({ loadCodeHighlighter }) => loadCodeHighlighter(language, accent))
      .then((next) => {
        if (!cancelled) setLoaded({ language, highlighter: next });
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error("Unable to load syntax highlighting.", error);
      });
    return () => {
      cancelled = true;
    };
  }, [language, accent, showInitial]);

  const [done, setDone] = React.useState<{
    highlighter: typeof highlighter;
    text: string;
    lines: React.ReactNode[];
    state?: Parameters<CodeHighlighter["highlight"]>[1];
  }>({ highlighter: null, text: "", lines: [] });
  let next = done;
  if (next.highlighter !== highlighter || !code.startsWith(next.text)) {
    next = { highlighter, text: "", lines: [] };
  }
  const end = code.lastIndexOf("\n") + 1;
  if (highlighter && end > next.text.length) {
    const result = highlighter.highlight(code.slice(next.text.length, end - 1), next.state);
    next = {
      highlighter,
      text: code.slice(0, end),
      lines: [...next.lines, ...renderLines(result.lines)],
      state: result.state,
    };
  }
  if (next !== done) setDone(next);

  const tail = code.slice(end);
  const lines = React.useMemo(() => {
    if (showInitial && initialLines) return initialLines;
    if (!highlighter) return initialLines ?? code.split("\n");
    return [...next.lines, renderLines(highlighter.highlight(tail, next.state).lines)[0]];
  }, [showInitial, initialLines, highlighter, code, next, tail]);

  // The rendered anchor observes inherited accents without a site-only provider.
  return React.useMemo(
    () => [
      React.createElement("span", { key: "scope", ref: setElement }, lines[0]),
      ...lines.slice(1),
    ],
    [lines, setElement],
  );
}
