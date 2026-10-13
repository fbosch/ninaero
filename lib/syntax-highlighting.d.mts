export type HighlightToken = {
  content: string;
  light: string | undefined;
  dark: string | undefined;
  offset: number;
};

export function sourceLanguage(filename: string): string;
export function highlightCode(code: string, language: string): Promise<HighlightToken[]>;
