import { accentStyles } from "./accent-styles.mjs";
import { accentPresets, defaultAccent } from "./accents.mjs";
import { styles as overlays } from "./overlays.mjs";
import { styles as patterns } from "./patterns.mjs";

export const optionalStyles = [
  {
    name: "patterns",
    title: "Ninaero patterns",
    description: "Paper backgrounds and element textures.",
    css: patterns,
  },
  {
    name: "overlays",
    title: "Ninaero overlays",
    description: "Page-wide textures with background compensation.",
    css: overlays,
  },
  ...Object.entries(accentPresets)
    .filter(([name]) => name !== defaultAccent)
    .map(([name, { label }]) => ({
      name: `accent-${name}`,
      title: `Ninaero ${label} accent`,
      description: `${label} light and dark accent preset, selected with data-accent="${name}".`,
      css: accentStyles[name],
    })),
];
