export type NinaeroMarkElement = {
  tag: string;
  attributes: Readonly<Record<string, string | number>>;
  children?: readonly NinaeroMarkElement[];
};
export const ninaeroMarkViewBox: string;
export function ninaeroMarkElements(gradientId: string): readonly NinaeroMarkElement[];
export function renderNinaeroIconSvg(styles: string, size: number): string;
