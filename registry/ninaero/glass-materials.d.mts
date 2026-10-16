export const glassGradientOffsets: readonly number[];
export function mixOklab(start: string, end: string, amount: number): string;
export function createGlassGradientTokens(
  palette: Readonly<Record<string, string>>,
): Record<string, string>;
export function withGlassGradientVariables(
  variables: Readonly<Record<string, string>>,
): Record<string, string>;
