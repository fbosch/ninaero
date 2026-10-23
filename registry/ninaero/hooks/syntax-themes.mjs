import { defaultAccent } from "./accent-config.mjs";

export const syntaxThemeLoaders = {
  tidepool: {
    light: () => import("shiki/themes/solarized-light.mjs"),
    dark: () => import("shiki/themes/solarized-dark.mjs"),
  },
  aurora: {
    light: () => import("shiki/themes/kanagawa-lotus.mjs"),
    dark: () => import("shiki/themes/kanagawa-wave.mjs"),
  },
  lavender: {
    light: () => import("shiki/themes/catppuccin-latte.mjs"),
    dark: () => import("shiki/themes/catppuccin-mocha.mjs"),
  },
  slate: {
    light: () => import("shiki/themes/github-light-high-contrast.mjs"),
    dark: () => import("shiki/themes/github-dark-high-contrast.mjs"),
  },
  lagoon: {
    light: () => import("shiki/themes/vitesse-light.mjs"),
    dark: () => import("shiki/themes/vitesse-dark.mjs"),
  },
  sky: {
    light: () => import("shiki/themes/night-owl-light.mjs"),
    dark: () => import("shiki/themes/night-owl.mjs"),
  },
  blossom: {
    light: () => import("shiki/themes/rose-pine-dawn.mjs"),
    dark: () => import("shiki/themes/rose-pine-moon.mjs"),
  },
  lime: {
    light: () => import("shiki/themes/everforest-light.mjs"),
    dark: () => import("shiki/themes/everforest-dark.mjs"),
  },
  anemone: {
    light: () => import("shiki/themes/ayu-light.mjs"),
    dark: () => import("shiki/themes/ayu-mirage.mjs"),
  },
  sunflower: {
    light: () => import("shiki/themes/gruvbox-light-medium.mjs"),
    dark: () => import("shiki/themes/gruvbox-dark-medium.mjs"),
  },
};
export const syntaxAccentNames = Object.keys(syntaxThemeLoaders);

export async function loadSyntaxThemePair(accent = defaultAccent) {
  if (!Object.hasOwn(syntaxThemeLoaders, accent))
    throw new Error(`Unknown syntax accent: ${accent}`);
  const loaders = syntaxThemeLoaders[accent];
  const [light, dark] = await Promise.all([loaders.light(), loaders.dark()]);
  const pair = { light: light.default, dark: dark.default };
  if (!pair.light.name || !pair.dark.name || pair.light.name === pair.dark.name) {
    throw new Error(`Invalid syntax theme pair: ${accent}`);
  }
  return pair;
}

// shortcut: fixed contrast bounds cover today's faint code-line fills; derive them from theme tokens if those fills change.
const surfaces = {
  light: { base: [255, 255, 255], contrast: [240, 240, 240] },
  dark: { base: [43, 43, 43], contrast: [60, 60, 60] },
};
const correctedColors = new Map();

function luminance(channels) {
  const [red, green, blue] = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function parseHex(color) {
  const match = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(color);
  if (!match) {
    throw new Error(`Unsupported syntax theme color: ${color}`);
  }
  const hex =
    match[1].length <= 4
      ? [...match[1]].map((character) => character + character).join("")
      : match[1];
  const channels = hex.match(/../g).map((channel) => Number.parseInt(channel, 16));
  return { channels: channels.slice(0, 3), alpha: (channels[3] ?? 255) / 255 };
}

function hexColor(channels) {
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

export function syntaxColor(color, mode) {
  const key = `${mode}:${color}`;
  const cached = correctedColors.get(key);
  if (cached) return cached;

  const surface = surfaces[mode];
  if (!surface) throw new Error(`Unsupported syntax color mode: ${mode}`);
  const { base: background, contrast: contrastSurface } = surface;

  const { channels, alpha } = parseHex(color);
  const original = channels.map((channel, index) =>
    Math.round(channel * alpha + background[index] * (1 - alpha)),
  );
  let adjusted = original;

  if (contrast(original, contrastSurface) < 4.5) {
    const target = mode === "light" ? 0 : 255;
    let lower = 0;
    let upper = 1;
    for (let index = 0; index < 18; index++) {
      const weight = (lower + upper) / 2;
      const candidate = original.map((channel) =>
        Math.round(channel + (target - channel) * weight),
      );
      if (contrast(candidate, contrastSurface) >= 4.5) {
        adjusted = candidate;
        upper = weight;
      } else {
        lower = weight;
      }
    }
  }

  const result = hexColor(adjusted);
  correctedColors.set(key, result);
  return result;
}

export function syntaxTokenStyles(style) {
  const result = {};
  for (const mode of ["light", "dark"]) {
    const property = `--n-${mode}`;
    const color = style?.[property];
    if (color) result[property] = syntaxColor(color, mode);
  }
  return result;
}
