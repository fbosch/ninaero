export type AccentName =
  | "tidepool"
  | "aurora"
  | "lavender"
  | "slate"
  | "lagoon"
  | "sky"
  | "blossom"
  | "lime";
export type AccentPalette = Record<string, string>;
export const defaultAccent: AccentName;
export const accentStorageKey: string;
export const accentPresets: Record<
  AccentName,
  { label: string; light: AccentPalette; dark: AccentPalette }
>;
export const accentNames: AccentName[];
export function isAccent(value: unknown): value is AccentName;
export const accentSemanticTokens: Record<string, string>;
export const accentRules: Record<string, Record<string, string>>;
