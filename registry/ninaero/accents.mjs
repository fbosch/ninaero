export const defaultAccent = "cyan";
export const accentStorageKey = "ninaero-accent";

export const accentPresets = {
  cyan: {
    label: "Cyan",
    light: {
      "button-primary-fill": "#b9e9f5",
      "button-primary-hover": "#a2dfef",
      "button-primary-pressed": "#8dd4e6",
      "button-primary-ink": "#123846",
      "button-primary-edge": "#3a8197",
      "button-link-ink": "#17677d",
      "button-focus": "#006d89",
      "accent-soft": "#e6f4f8",
    },
    dark: {
      "button-primary-fill": "#79cfe5",
      "button-primary-hover": "#96def0",
      "button-primary-pressed": "#62b9d0",
      "button-primary-ink": "#102d3a",
      "button-primary-edge": "#a0e3f2",
      "button-link-ink": "#8adef2",
      "button-focus": "#7ce1f6",
      "accent-soft": "#203e48",
    },
  },
  indigo: {
    label: "Indigo",
    light: {
      "button-primary-fill": "#ccd5f5",
      "button-primary-hover": "#b7c5ef",
      "button-primary-pressed": "#a4b5e5",
      "button-primary-ink": "#26345b",
      "button-primary-edge": "#6575a6",
      "button-link-ink": "#40558b",
      "button-focus": "#4057a0",
      "accent-soft": "#edf0fc",
    },
    dark: {
      "button-primary-fill": "#a9baf0",
      "button-primary-hover": "#c0cdf8",
      "button-primary-pressed": "#92a6e3",
      "button-primary-ink": "#242f50",
      "button-primary-edge": "#c6d1f8",
      "button-link-ink": "#bdccfa",
      "button-focus": "#c1cfff",
      "accent-soft": "#2b3451",
    },
  },
  lavender: {
    label: "Lavender",
    light: {
      "button-primary-fill": "#e2d4ef",
      "button-primary-hover": "#d6c3e7",
      "button-primary-pressed": "#c8b2dc",
      "button-primary-ink": "#453052",
      "button-primary-edge": "#8b6a9e",
      "button-link-ink": "#715080",
      "button-focus": "#76518b",
      "accent-soft": "#f5effa",
    },
    dark: {
      "button-primary-fill": "#cbb1e1",
      "button-primary-hover": "#dcc6ed",
      "button-primary-pressed": "#b89bd2",
      "button-primary-ink": "#392846",
      "button-primary-edge": "#e3ccf5",
      "button-link-ink": "#dfc7ef",
      "button-focus": "#e4ccfa",
      "accent-soft": "#3d2f49",
    },
  },
  slate: {
    label: "Slate",
    light: {
      "button-primary-fill": "#d8e1e9",
      "button-primary-hover": "#c6d3de",
      "button-primary-pressed": "#b5c5d3",
      "button-primary-ink": "#2d3b49",
      "button-primary-edge": "#6b7d8c",
      "button-link-ink": "#4c6275",
      "button-focus": "#4c647a",
      "accent-soft": "#eef2f6",
    },
    dark: {
      "button-primary-fill": "#b3c6d7",
      "button-primary-hover": "#c9d8e5",
      "button-primary-pressed": "#9bb3c8",
      "button-primary-ink": "#263541",
      "button-primary-edge": "#d4e2ee",
      "button-link-ink": "#c9dbe9",
      "button-focus": "#d0e6f8",
      "accent-soft": "#303f4c",
    },
  },
};

export const accentNames = Object.keys(accentPresets);

export function isAccent(value) {
  return Object.hasOwn(accentPresets, value);
}

export const accentSemanticTokens = {
  primary: "var(--button-primary-fill)",
  "primary-foreground": "var(--button-primary-ink)",
  accent: "var(--accent-soft)",
  "accent-foreground": "var(--button-link-ink)",
  ring: "var(--button-focus)",
  border: "var(--neutral-border)",
  input: "var(--neutral-input)",
  "sidebar-border": "var(--neutral-border)",
  "sidebar-primary": "var(--button-primary-fill)",
  "sidebar-primary-foreground": "var(--button-primary-ink)",
  "sidebar-accent": "var(--accent-soft)",
  "sidebar-accent-foreground": "var(--button-link-ink)",
  "sidebar-ring": "var(--button-focus)",
};

function variables(palette) {
  return Object.fromEntries(
    Object.entries({ ...palette, ...accentSemanticTokens }).map(([key, value]) => [
      `--${key}`,
      value,
    ]),
  );
}

export const accentRules = Object.fromEntries(
  Object.entries(accentPresets).flatMap(([name, preset]) => [
    [`[data-accent="${name}"]`, variables(preset.light)],
    [`.dark[data-accent="${name}"], .dark [data-accent="${name}"]`, variables(preset.dark)],
  ]),
);
