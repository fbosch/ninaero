export type HighlightToken = {
  content: string;
  style: Record<string, string> | undefined;
  offset: number;
};

export function sourceLanguage(filename: string): string;
export function highlightCode(
  code: string,
  language: string,
  accent?: string,
): Promise<HighlightToken[]>;
export function highlightCodeLines(
  code: string,
  language: string,
  accent?: string,
): Promise<HighlightToken[][]>;
