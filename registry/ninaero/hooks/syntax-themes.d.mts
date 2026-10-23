import type { ThemeRegistration } from "shiki";

export type SyntaxMode = "light" | "dark";
export type SyntaxTheme = ThemeRegistration & { name: string };
export const syntaxThemeLoaders: Record<
  string,
  Record<SyntaxMode, () => Promise<{ default: SyntaxTheme }>>
>;
export const syntaxAccentNames: string[];
export function loadSyntaxThemePair(accent?: string): Promise<Record<SyntaxMode, SyntaxTheme>>;
export function syntaxColor(color: string, mode: SyntaxMode): string;
export function syntaxTokenStyles(
  style: Record<string, string> | undefined,
): Record<string, string>;
