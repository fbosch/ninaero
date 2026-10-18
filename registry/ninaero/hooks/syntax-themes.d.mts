export type SyntaxMode = "light" | "dark";
export type SyntaxThemeVariant = { accent: string; mode: SyntaxMode; name: string };

export const syntaxThemePairs: Record<string, Record<SyntaxMode, string>>;
export const syntaxThemeVariants: Record<string, SyntaxThemeVariant>;
export const syntaxThemeNames: string[];
export const syntaxThemeSelection: Record<string, string>;

export function syntaxColor(color: string, mode: SyntaxMode): string;
export function syntaxTokenStyles(
  style: Record<string, string> | undefined,
): Record<string, string>;
