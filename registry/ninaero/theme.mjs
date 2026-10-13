import { accentPresets, accentRules, accentSemanticTokens, defaultAccent } from "./accents.mjs";

const buttonPressSelector =
  ".ninaero-button:active:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-haspopup]):not(.ninaero-button--link):not(.ninaero-button--ghost)";
export const elevations = {
  control: [
    "0 1px 2px hsl(var(--shadow-color) / 0.18)",
    "0 2px 5px hsl(var(--shadow-color) / 0.11)",
    "0 4px 10px hsl(var(--shadow-color) / 0.07)",
  ].join(", "),
  floating: [
    "0 2px 2px hsl(var(--shadow-color) / 0.14)",
    "0 4px 6px hsl(var(--shadow-color) / 0.10)",
    "0 8px 14px hsl(var(--shadow-color) / 0.05)",
  ].join(", "),
  dialog: [
    "0 2px 3px hsl(var(--shadow-color) / 0.12)",
    "0 8px 12px hsl(var(--shadow-color) / 0.08)",
    "0 16px 28px hsl(var(--shadow-color) / 0.04)",
  ].join(", "),
};
export const buttonRecessShadow = [
  "inset 0 1px 2px var(--button-recess-shade)",
  "inset 0 -1px 0 var(--button-recess-highlight)",
].join(", ");
const sansFont = {
  family: "'Google Sans Flex Variable', ui-sans-serif, system-ui, sans-serif",
  dependency: "@fontsource-variable/google-sans-flex",
  // The full font keeps custom axes; the package default only keeps weight.
  stylesheet: "@fontsource-variable/google-sans-flex/full.css",
  roundness: 100,
};

export const theme = {
  font: sansFont,
  theme: {
    "shadow-sm": elevations.control,
    "shadow-md": elevations.floating,
    "shadow-lg": elevations.floating,
    "shadow-xl": elevations.dialog,
    "shadow-2xl": elevations.dialog,
    "font-heading": "var(--font-sans)",
    "font-sans": sansFont.family,
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
    "neutral-border": "#dfdfdf",
    "neutral-input": "#838383",
    "input-edge": "#8f8f8f",
    "input-placeholder": "oklch(0.535 0 0)",
    "input-disabled-fill": "var(--muted)",
    "input-recess-shade-weight": "4%",
    "input-recess-highlight-weight": "6%",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    popover: "var(--card)",
    "popover-foreground": "var(--card-foreground)",
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
    "button-paper-fill": "#f8f8f8",
    "button-paper-edge": "#888888",
    "button-outline-edge": "#838383",
    "button-paper-hover": "#eeeeee",
    "button-paper-ink": "#383838",
    "button-paper-pressed": "#e3e3e3",
    "button-paper-highlight": "#ffffffa6",
    "button-paper-shade": "#3333330d",
    "button-recess-shade-weight": "4%",
    "button-recess-highlight-weight": "6%",
    "button-destructive-fill": "#f6d9dc",
    "button-destructive-hover": "#efc2c8",
    "button-destructive-pressed": "#e8aeb7",
    "button-destructive-ink": "#782934",
    "button-destructive-edge": "#a35864",
    "button-destructive-highlight": "#ffffff66",
    "button-destructive-shade": "#4a081c14",
    "button-highlight": "#ffffff80",
    "shadow-color": "0deg 0% 24%",
    "shadow-color-paper": "0deg 0% 28%",
    "paper-fill": "#f9f9f9",
    "paper-rule": "#79797914",
    "paper-dot": "#79797929",
  },
  dark: {
    background: "oklch(0.145 0 0)",
    "neutral-border": "#424242",
    "neutral-input": "#909090",
    "input-edge": "#6f6f6f",
    "input-placeholder": "var(--muted-foreground)",
    "input-disabled-fill": "var(--card)",
    "input-recess-shade-weight": "6%",
    "input-recess-highlight-weight": "8%",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "var(--card)",
    "popover-foreground": "var(--card-foreground)",
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
    "button-paper-fill": "#343434",
    "button-paper-edge": "#7f7f7f",
    "button-outline-edge": "#909090",
    "button-paper-hover": "#454545",
    "button-paper-ink": "#efefef",
    "button-paper-pressed": "#2e2e2e",
    "button-paper-highlight": "#ffffff26",
    "button-paper-shade": "#00000040",
    "button-recess-shade-weight": "6%",
    "button-recess-highlight-weight": "8%",
    "button-destructive-fill": "#603039",
    "button-destructive-hover": "#743945",
    "button-destructive-pressed": "#502630",
    "button-destructive-ink": "#ffe0e5",
    "button-destructive-edge": "#cf7b8c",
    "button-destructive-highlight": "#ffffff1a",
    "button-destructive-shade": "#00000040",
    "button-highlight": "#ffffff33",
    "shadow-color": "0deg 0% 3%",
    "shadow-color-paper": "0deg 0% 5%",
    "paper-fill": "#232323",
    "paper-rule": "#cecece0f",
    "paper-dot": "#cecece24",
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
        "font-family": "var(--font-sans)",
        "font-variation-settings": `"ROND" ${sansFont.roundness}`,
      },
    },
    "@layer components": {
      ".ninaero-surface-paper": {
        "--shadow-color": "var(--shadow-color-paper)",
      },
      ".ninaero-paper-ruled, .ninaero-paper-dotted, .ninaero-paper-grid": {
        "--shadow-color": "var(--shadow-color-paper)",
        "background-color": "var(--paper-fill)",
      },
      ".ninaero-paper-ruled": {
        "background-image":
          "repeating-linear-gradient(transparent 0 23px, var(--paper-rule) 23px 24px)",
      },
      ".ninaero-paper-dotted": {
        "background-image": "radial-gradient(circle, var(--paper-dot) 1px, transparent 1px)",
        "background-size": "16px 16px",
      },
      ".ninaero-paper-grid": {
        "background-image":
          "linear-gradient(var(--paper-rule) 1px, transparent 1px), linear-gradient(90deg, var(--paper-rule) 1px, transparent 1px)",
        "background-size": "24px 24px",
      },
      ".ninaero-input, .ninaero-textarea": {
        "--input-corner": "0.875rem",
        "--input-recess-shade":
          "color-mix(in oklab, var(--card), black var(--input-recess-shade-weight))",
        "--input-recess-highlight":
          "color-mix(in oklab, var(--card), white var(--input-recess-highlight-weight))",
        "border-radius": "var(--input-corner)",
        "corner-shape": "squircle",
        border: "1px solid var(--input-edge)",
        color: "var(--card-foreground)",
        "background-color": "var(--card)",
        "box-shadow":
          "inset 0 1px 2px var(--input-recess-shade), inset 0 -1px 0 var(--input-recess-highlight)",
        outline: "2px solid transparent",
        "outline-offset": "3px",
        transition: "background-color 80ms ease-out, border-color 80ms ease-out",
      },
      ".ninaero-input::placeholder, .ninaero-textarea::placeholder": {
        color: "var(--input-placeholder)",
        opacity: "1",
      },
      ".ninaero-input:focus-visible, .ninaero-textarea:focus-visible": {
        "outline-color": "var(--ring)",
      },
      ".ninaero-input[aria-invalid=true], .ninaero-textarea[aria-invalid=true]": {
        "border-color": "var(--destructive)",
      },
      ".ninaero-input:disabled, .ninaero-textarea:disabled": {
        "border-color": "var(--border)",
        "background-color": "var(--input-disabled-fill)",
        color: "var(--muted-foreground)",
        "box-shadow": "none",
      },
      ".ninaero-popover": {
        "border-radius": "1.25rem",
        "corner-shape": "squircle",
        border: "1px solid var(--border)",
        color: "var(--popover-foreground)",
        "background-color": "var(--popover)",
        "box-shadow": `inset 0 1px 0 var(--button-highlight), ${elevations.floating}`,
      },
      ".ninaero-toggle": {
        "--toggle-corner": "0.875rem",
        "--button-recess-fill": "var(--button-paper-pressed)",
        "--button-recess-shade":
          "color-mix(in oklab, var(--button-recess-fill), black var(--button-recess-shade-weight))",
        "--button-recess-highlight":
          "color-mix(in oklab, var(--button-recess-fill), white var(--button-recess-highlight-weight))",
        "border-radius": "var(--toggle-corner)",
        "corner-shape": "squircle",
        border: "1px solid transparent",
        color: "var(--button-paper-ink)",
        "background-color": "transparent",
        outline: "2px solid transparent",
        "outline-offset": "3px",
        transition:
          "background-color 80ms ease-out, border-color 80ms ease-out, box-shadow 80ms ease-out",
      },
      ".ninaero-toggle--outline": {
        "border-color": "var(--input)",
        "background-color": "var(--card)",
      },
      ".ninaero-toggle[aria-pressed=true]": {
        "--button-recess-fill": "var(--accent-soft)",
        color: "var(--accent-foreground)",
        "background-color": "var(--accent-soft)",
        "border-color": "var(--button-primary-edge)",
        "box-shadow": "inset 0 1px 0 var(--button-highlight)",
      },
      ".ninaero-toggle:focus-visible": {
        "outline-color": "var(--ring)",
      },
      ".ninaero-toggle[aria-invalid=true]": {
        "border-color": "var(--button-destructive-edge)",
      },
      ".ninaero-toggle:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])": {
        "background-color": "var(--button-recess-fill)",
        "box-shadow": buttonRecessShadow,
      },
      ".ninaero-toggle:disabled, .ninaero-toggle[data-disabled], .ninaero-toggle[aria-disabled=true]":
        {
          "box-shadow": "none",
          opacity: "0.5",
        },
      ".ninaero-button": {
        "--button-corner": "1rem",
        "--button-press-shift": "1px",
        "--button-recess-fill": "var(--background)",
        "--button-recess-shade":
          "color-mix(in oklab, var(--button-recess-fill), black var(--button-recess-shade-weight))",
        "--button-recess-highlight":
          "color-mix(in oklab, var(--button-recess-fill), white var(--button-recess-highlight-weight))",
        "border-radius": "var(--button-corner)",
        "corner-shape": "squircle",
        border: "1px solid transparent",
        outline: "2px solid transparent",
        "outline-offset": "3px",
        transition:
          "background-color 80ms ease-out, border-color 80ms ease-out, box-shadow 80ms ease-out, transform 80ms ease-out",
      },
      ".ninaero-button--primary": {
        "--button-recess-fill": "var(--button-primary-pressed)",
        color: "var(--button-primary-ink)",
        "background-color": "var(--button-primary-fill)",
        "background-image": "linear-gradient(180deg, var(--button-highlight), transparent 65%)",
        "border-color": "var(--button-primary-edge)",
        "box-shadow": `inset 0 1px 0 var(--button-highlight), ${elevations.control}`,
      },
      ".ninaero-button--secondary, .ninaero-button--outline": {
        "--button-recess-fill": "var(--button-paper-pressed)",
        color: "var(--button-paper-ink)",
      },
      ".ninaero-button--secondary": {
        "border-color": "var(--button-paper-edge)",
        "background-color": "var(--button-paper-fill)",
        "background-image":
          "linear-gradient(180deg, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
        "box-shadow": `inset 0 1px 0 var(--button-paper-highlight), inset 0 -1px 0 var(--button-paper-shade), ${elevations.control}`,
      },
      ".ninaero-button--destructive": {
        "--button-recess-fill": "var(--button-destructive-pressed)",
        color: "var(--button-destructive-ink)",
        "background-color": "var(--button-destructive-fill)",
        "background-image":
          "linear-gradient(180deg, var(--button-destructive-highlight), transparent 55%, var(--button-destructive-shade))",
        "border-color": "var(--button-destructive-edge)",
        "box-shadow": `inset 0 1px 0 var(--button-destructive-highlight), inset 0 -1px 0 var(--button-destructive-shade), ${elevations.control}`,
      },
      ".ninaero-button--outline": {
        "border-color": "var(--button-outline-edge)",
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
        "border-color": "var(--button-destructive-edge)",
      },
      [buttonPressSelector]: {
        transform: "translateY(var(--button-press-shift))",
        "box-shadow": buttonRecessShadow,
      },
      ".ninaero-button:disabled, .ninaero-button[data-disabled], .ninaero-button[aria-disabled=true]":
        {
          "box-shadow": "none",
          opacity: "0.5",
        },
      "@media (hover: hover)": {
        ".ninaero-toggle:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-pressed=true])":
          {
            "background-color": "var(--button-paper-hover)",
          },
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
      ".ninaero-button--outline:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
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
        ".ninaero-input, .ninaero-textarea": {
          transition: "none",
        },
        ".ninaero-toggle": {
          transition: "none",
        },
        ".ninaero-button": {
          transition: "none",
          "--button-press-shift": "0px",
        },
      },
      "@media (forced-colors: active)": {
        ".ninaero-paper-ruled, .ninaero-paper-dotted, .ninaero-paper-grid": {
          "background-image": "none",
          "background-color": "Canvas",
        },
        ".ninaero-input, .ninaero-textarea": {
          "border-color": "CanvasText",
          "background-color": "Canvas",
          color: "CanvasText",
          "box-shadow": "none",
        },
        ".ninaero-input::placeholder, .ninaero-textarea::placeholder": {
          color: "GrayText",
        },
        ".ninaero-input[aria-invalid=true], .ninaero-textarea[aria-invalid=true]": {
          "border-color": "CanvasText",
        },
        ".ninaero-input:focus-visible, .ninaero-textarea:focus-visible": {
          "outline-color": "Highlight",
        },
        ".ninaero-input:disabled, .ninaero-textarea:disabled": {
          "border-color": "GrayText",
          "background-color": "Canvas",
          color: "GrayText",
        },
        ".ninaero-popover": {
          "border-color": "CanvasText",
          "background-color": "Canvas",
          color: "CanvasText",
          "box-shadow": "none",
        },
        ".ninaero-toggle": {
          "border-color": "ButtonText",
          "background-color": "ButtonFace",
          color: "ButtonText",
          "box-shadow": "none",
        },
        ".ninaero-toggle[aria-pressed=true]": {
          "border-color": "Highlight",
          "background-color": "Highlight",
          color: "HighlightText",
        },
        ".ninaero-toggle:focus-visible": {
          "outline-color": "Highlight",
        },
        ".ninaero-toggle:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])": {
          "background-color": "ButtonFace",
          color: "ButtonText",
          "box-shadow": "none",
        },
        ".ninaero-toggle[aria-pressed=true]:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
          {
            "background-color": "Highlight",
            color: "HighlightText",
          },
        ".ninaero-toggle:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-pressed=true])":
          {
            "background-color": "ButtonFace",
          },
        ".ninaero-toggle[aria-invalid=true]": {
          "border-color": "ButtonText",
        },
        ".ninaero-toggle:disabled, .ninaero-toggle[data-disabled], .ninaero-toggle[aria-disabled=true]":
          {
            "border-color": "GrayText",
            color: "GrayText",
          },
        ".ninaero-button": {
          "background-image": "none",
          "border-color": "ButtonText",
          "box-shadow": "none",
        },
        [buttonPressSelector]: {
          "box-shadow": "none",
        },
        ".ninaero-button[aria-invalid=true]": {
          "border-color": "ButtonText",
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
