import {
  accentPresets,
  accentRules,
  accentSemanticTokens,
  defaultAccent,
} from "./accents.mjs";

const buttonPressSelector =
  ".ninaero-button:active:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-haspopup]):not(.ninaero-button--link):not(.ninaero-button--ghost)";
export const elevations = {
  control: [
    "0 1px 1px hsl(var(--shadow-color) / 0.18)",
    "0 2px 3px hsl(var(--shadow-color) / 0.12)",
    "0 4px 6px hsl(var(--shadow-color) / 0.08)",
  ].join(", "),
  floating: [
    "0 2px 2px hsl(var(--shadow-color) / 0.14)",
    "0 4px 6px hsl(var(--shadow-color) / 0.10)",
    "0 8px 14px hsl(var(--shadow-color) / 0.06)",
  ].join(", "),
  dialog: [
    "0 2px 3px hsl(var(--shadow-color) / 0.12)",
    "0 8px 12px hsl(var(--shadow-color) / 0.08)",
    "0 16px 28px hsl(var(--shadow-color) / 0.05)",
  ].join(", "),
};
export const theme = {
  theme: {
    "shadow-sm": elevations.control,
    "shadow-md": elevations.floating,
    "shadow-lg": elevations.floating,
    "shadow-xl": elevations.dialog,
    "shadow-2xl": elevations.dialog,
    "font-heading": "var(--font-sans)",
    "font-sans": "ui-sans-serif, system-ui, sans-serif",
    "color-sidebar-ring": "var(--sidebar-ring)",
    "color-sidebar-border": "var(--sidebar-border)",
    "color-sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
    "color-sidebar-accent": "var(--sidebar-accent)",
    "color-sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
    "color-sidebar-primary": "var(--sidebar-primary)",
    "color-sidebar-foreground": "var(--sidebar-foreground)",
    "color-sidebar": "var(--sidebar)",
    "color-chart-5": "var(--chart-5)",
    "color-chart-4": "var(--chart-4)",
    "color-chart-3": "var(--chart-3)",
    "color-chart-2": "var(--chart-2)",
    "color-chart-1": "var(--chart-1)",
    "color-ring": "var(--ring)",
    "color-input": "var(--input)",
    "color-border": "var(--border)",
    "color-destructive": "var(--destructive)",
    "color-accent-foreground": "var(--accent-foreground)",
    "color-accent": "var(--accent)",
    "color-muted-foreground": "var(--muted-foreground)",
    "color-muted": "var(--muted)",
    "color-secondary-foreground": "var(--secondary-foreground)",
    "color-secondary": "var(--secondary)",
    "color-primary-foreground": "var(--primary-foreground)",
    "color-primary": "var(--primary)",
    "color-popover-foreground": "var(--popover-foreground)",
    "color-popover": "var(--popover)",
    "color-card-foreground": "var(--card-foreground)",
    "color-card": "var(--card)",
    "color-foreground": "var(--foreground)",
    "color-background": "var(--background)",
    "radius-sm": "calc(var(--radius) * 0.6)",
    "radius-md": "calc(var(--radius) * 0.8)",
    "radius-lg": "var(--radius)",
    "radius-xl": "calc(var(--radius) * 1.4)",
    "radius-2xl": "calc(var(--radius) * 1.8)",
    "radius-3xl": "calc(var(--radius) * 2.2)",
    "radius-4xl": "calc(var(--radius) * 2.6)",
  },
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
    secondary: "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    "chart-1": "oklch(0.87 0 0)",
    "chart-2": "oklch(0.556 0 0)",
    "chart-3": "oklch(0.439 0 0)",
    "chart-4": "oklch(0.371 0 0)",
    "chart-5": "oklch(0.269 0 0)",
    radius: "0.625rem",
    sidebar: "oklch(0.985 0 0)",
    "sidebar-foreground": "oklch(0.145 0 0)",
    ...accentPresets[defaultAccent].light,
    ...accentSemanticTokens,
    "button-paper-fill": "#f5f8fa",
    "button-paper-hover": "#e6f0f4",
    "button-paper-ink": "#253b46",
    "button-paper-pressed": "#d9e5eb",
    "button-paper-highlight": "#ffffffa6",
    "button-paper-shade": "#1737460d",
    "button-destructive-fill": "#f6d9dc",
    "button-destructive-hover": "#efc2c8",
    "button-destructive-pressed": "#e8aeb7",
    "button-destructive-ink": "#782934",
    "button-destructive-edge": "#a35864",
    "button-destructive-highlight": "#ffffff66",
    "button-destructive-shade": "#4a081c14",
    "button-highlight": "#ffffff80",
    "shadow-color": "215deg 10% 24%",
    "shadow-color-paper": "205deg 18% 28%",
  },
  dark: {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
    secondary: "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    "chart-1": "oklch(0.87 0 0)",
    "chart-2": "oklch(0.556 0 0)",
    "chart-3": "oklch(0.439 0 0)",
    "chart-4": "oklch(0.371 0 0)",
    "chart-5": "oklch(0.269 0 0)",
    sidebar: "oklch(0.205 0 0)",
    "sidebar-foreground": "oklch(0.985 0 0)",
    ...accentPresets[defaultAccent].dark,
    ...accentSemanticTokens,
    "button-paper-fill": "#263641",
    "button-paper-hover": "#314854",
    "button-paper-ink": "#e5f1f5",
    "button-paper-pressed": "#20303a",
    "button-paper-highlight": "#ffffff26",
    "button-paper-shade": "#00000040",
    "button-destructive-fill": "#603039",
    "button-destructive-hover": "#743945",
    "button-destructive-pressed": "#502630",
    "button-destructive-ink": "#ffe0e5",
    "button-destructive-edge": "#cf7b8c",
    "button-destructive-highlight": "#ffffff1a",
    "button-destructive-shade": "#00000040",
    "button-highlight": "#ffffff33",
    "shadow-color": "215deg 10% 3%",
    "shadow-color-paper": "205deg 18% 5%",
  },
  css: {
    ...accentRules,
    "@layer base": {
      "*": {
        "@apply border-border outline-ring/50": {},
      },
      body: {
        "@apply bg-background text-foreground": {},
      },
      html: {
        "@apply font-sans": {},
      },
    },
    "@layer components": {
      ".ninaero-surface-paper": {
        "--shadow-color": "var(--shadow-color-paper)",
      },
      ".ninaero-button": {
        "--button-corner": "1rem",
        "--button-press-shift": "1px",
        "border-radius": "var(--button-corner)",
        "corner-shape": "squircle",
        border: "1px solid transparent",
        outline: "2px solid transparent",
        "outline-offset": "3px",
        transition:
          "background-color 80ms ease-out, border-color 80ms ease-out, box-shadow 80ms ease-out, transform 80ms ease-out",
      },
      ".ninaero-button--primary": {
        color: "var(--button-primary-ink)",
        "background-color": "var(--button-primary-fill)",
        "background-image":
          "linear-gradient(180deg, var(--button-highlight), transparent 65%)",
        "border-color": "var(--button-primary-edge)",
        "box-shadow": `inset 0 1px 0 var(--button-highlight), ${elevations.control}`,
      },
      ".ninaero-button--secondary, .ninaero-button--outline": {
        color: "var(--button-paper-ink)",
        "border-color": "var(--button-paper-edge)",
      },
      ".ninaero-button--secondary": {
        "background-color": "var(--button-paper-fill)",
        "background-image":
          "linear-gradient(180deg, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
        "box-shadow": `inset 0 1px 0 var(--button-paper-highlight), inset 0 -1px 0 var(--button-paper-shade), ${elevations.control}`,
      },
      ".ninaero-button--destructive": {
        color: "var(--button-destructive-ink)",
        "background-color": "var(--button-destructive-fill)",
        "background-image":
          "linear-gradient(180deg, var(--button-destructive-highlight), transparent 55%, var(--button-destructive-shade))",
        "border-color": "var(--button-destructive-edge)",
        "box-shadow": `inset 0 1px 0 var(--button-destructive-highlight), inset 0 -1px 0 var(--button-destructive-shade), ${elevations.control}`,
      },
      ".ninaero-button--outline": {
        "background-color": "var(--background)",
      },
      ".ninaero-button--ghost": {
        color: "var(--button-paper-ink)",
      },
      ".ninaero-button--link": {
        color: "var(--button-link-ink)",
        "text-underline-offset": "4px",
      },
      ".ninaero-button--outline[aria-expanded=true], .ninaero-button--secondary[aria-expanded=true], .ninaero-button--ghost[aria-expanded=true]":
        {
          "background-color": "var(--button-paper-hover)",
        },
      ".ninaero-button:focus-visible": {
        "outline-color": "var(--button-focus)",
      },
      ".ninaero-button[aria-invalid=true]": {
        "border-color": "var(--destructive)",
        "outline-color": "var(--destructive)",
      },
      [buttonPressSelector]: {
        transform: "translateY(var(--button-press-shift))",
        "box-shadow": "inset 0 1px 2px hsl(var(--shadow-color) / 0.22)",
      },
      ".ninaero-button:disabled, .ninaero-button[data-disabled], .ninaero-button[aria-disabled=true]":
        {
          "box-shadow": "none",
          opacity: "0.5",
        },
      "@media (hover: hover)": {
        ".ninaero-button--primary:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
          {
            "background-color": "var(--button-primary-hover)",
          },
        ".ninaero-button--secondary:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]), .ninaero-button--outline:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]), .ninaero-button--ghost:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
          {
            "background-color": "var(--button-paper-hover)",
          },
        ".ninaero-button--destructive:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
          {
            "background-color": "var(--button-destructive-hover)",
          },
        ".ninaero-button--link:hover": {
          "text-decoration-line": "underline",
        },
      },
      ".ninaero-button--primary:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "var(--button-primary-pressed)",
          "background-image": "none",
        },
      ".ninaero-button--secondary:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "var(--button-paper-pressed)",
          "background-image": "none",
        },
      ".ninaero-button--destructive:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "var(--button-destructive-pressed)",
          "background-image": "none",
        },
      "@media (prefers-reduced-motion: reduce)": {
        ".ninaero-button": {
          transition: "none",
          "--button-press-shift": "0px",
        },
      },
      "@media (forced-colors: active)": {
        ".ninaero-button": {
          "background-image": "none",
          "border-color": "ButtonText",
          "box-shadow": "none",
        },
        [buttonPressSelector]: {
          "box-shadow": "none",
        },
        ".ninaero-button:focus-visible": {
          "outline-color": "Highlight",
        },
        ".ninaero-button:disabled, .ninaero-button[data-disabled], .ninaero-button[aria-disabled=true]":
          {
            "border-color": "GrayText",
          },
      },
    },
  },
};
