import { defaultAccent } from "../../accents.mjs";
import { syntaxThemeVariants } from "../syntax-themes.mjs";

const syntaxStyle = (alias) => ({
  color: `var(--n-${alias})`,
});
const defaultSyntaxVariants = Object.fromEntries(
  Object.entries(syntaxThemeVariants)
    .filter(([, variant]) => variant.accent === defaultAccent)
    .map(([alias, variant]) => [variant.mode, alias]),
);
if (!defaultSyntaxVariants.light || !defaultSyntaxVariants.dark) {
  throw new Error(`Missing syntax themes for default accent: ${defaultAccent}`);
}

export const styles = {
  ".ninaero-syntax-token": {
    ...syntaxStyle(defaultSyntaxVariants.light),
    "font-style": "normal",
    "@media (forced-colors: active)": { color: "CanvasText !important" },
  },
  ".dark .ninaero-syntax-token": syntaxStyle(defaultSyntaxVariants.dark),
  ...Object.fromEntries(
    Object.entries(syntaxThemeVariants).map(([alias, { accent, mode }]) => [
      mode === "dark"
        ? `.dark[data-accent="${accent}"] .ninaero-syntax-token, .dark [data-accent="${accent}"] .ninaero-syntax-token`
        : `[data-accent="${accent}"] .ninaero-syntax-token`,
      syntaxStyle(alias),
    ]),
  ),
};
