export const syntaxThemePairs = {
  tidepool: { light: "material-theme-lighter", dark: "material-theme-ocean" },
  aurora: { light: "one-light", dark: "aurora-x" },
  lavender: { light: "catppuccin-latte", dark: "catppuccin-mocha" },
  slate: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
  lagoon: { light: "vitesse-light", dark: "vitesse-dark" },
  sky: { light: "night-owl-light", dark: "night-owl" },
  blossom: { light: "rose-pine-dawn", dark: "rose-pine-moon" },
  lime: { light: "everforest-light", dark: "everforest-dark" },
  anemone: { light: "ayu-light", dark: "ayu-mirage" },
  sunflower: { light: "gruvbox-light-medium", dark: "gruvbox-dark-medium" },
};

export const syntaxThemeVariants = Object.fromEntries(
  Object.entries(syntaxThemePairs).flatMap(([accent, pair], index) => [
    [`p${index * 2}`, { accent, mode: "light", name: pair.light }],
    [`p${index * 2 + 1}`, { accent, mode: "dark", name: pair.dark }],
  ]),
);

export const syntaxThemeNames = Object.values(syntaxThemeVariants).map(({ name }) => name);
export const syntaxThemeSelection = Object.fromEntries(
  Object.entries(syntaxThemeVariants).map(([alias, { name }]) => [alias, name]),
);

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
  return Object.fromEntries(
    Object.entries(style ?? {}).flatMap(([property, value]) => {
      const match = /^--n-(p\d+)$/.exec(property);
      if (!match) return [];
      const variant = syntaxThemeVariants[match[1]];
      if (!variant) throw new Error(`Unknown syntax theme variant: ${match[1]}`);
      return [[property, syntaxColor(value, variant.mode)]];
    }),
  );
}
