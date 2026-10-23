import { accentPresets, accentSemanticTokens } from "./accents.mjs";
import { withGlassGradientVariables } from "./glass-materials.mjs";

function variables(palette) {
  return withGlassGradientVariables(
    Object.fromEntries(
      Object.entries({ ...palette, ...accentSemanticTokens }).map(([key, value]) => [
        `--${key}`,
        value,
      ]),
    ),
  );
}

export const accentStyles = Object.fromEntries(
  Object.entries(accentPresets).map(([name, preset]) => [
    name,
    {
      [`[data-accent="${name}"]`]: variables(preset.light),
      [`.dark[data-accent="${name}"], .dark [data-accent="${name}"]`]: variables(preset.dark),
    },
  ]),
);
