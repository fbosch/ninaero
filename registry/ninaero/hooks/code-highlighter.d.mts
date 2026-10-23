import type { GrammarState, HighlighterCore } from "shiki/core";

export type SyntaxToken = { content: string; style: Record<string, string> };
export type CodeHighlighter = {
  highlight(
    code: string,
    state?: GrammarState,
  ): {
    lines: SyntaxToken[][];
    state: GrammarState | undefined;
  };
};
export function getSyntaxHighlighter(): Promise<HighlighterCore>;
export function loadCodeHighlighter(
  language: string,
  accent?: string,
): Promise<CodeHighlighter | null>;
