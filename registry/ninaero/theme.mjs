import { accentPresets, accentRules, accentSemanticTokens, defaultAccent } from "./accents.mjs";

const buttonPressSelector =
  ".ninaero-button:active:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-haspopup]):not(.ninaero-button--link):not(.ninaero-button--ghost)";
const raisedButtonSelector =
  ":is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive)";
const raisedButtonGroupSelector = [
  ".ninaero-button-group",
  `:has(> ${raisedButtonSelector}:not(:disabled):not([data-disabled]):not([aria-disabled=true]))`,
  `:not(:has(> :not(${raisedButtonSelector}, [data-slot=button-group-separator])))`,
].join("");
const segmentedTabSelector =
  ".ninaero-tabs-list[data-variant=default] > .ninaero-tabs-trigger:where(:not(:disabled):not([data-disabled]):not([aria-disabled=true]))";

export const elevations = {
  // A transparent layer composes with inset bevels; none cannot appear in a shadow list.
  flat: "0 0 #0000",
  control: [
    "0 1px 1px hsl(var(--shadow-color) / 0.12)",
    "0 2px 3px hsl(var(--shadow-color) / 0.08)",
  ].join(", "),
  floating: [
    "0 1px 3px hsl(var(--shadow-color) / 0.08)",
    "0 4px 8px hsl(var(--shadow-color) / 0.06)",
    "0 8px 16px hsl(var(--shadow-color) / 0.03)",
  ].join(", "),
  dialog: [
    "0 2px 3px hsl(var(--shadow-color) / 0.12)",
    "0 8px 12px hsl(var(--shadow-color) / 0.08)",
    "0 16px 28px hsl(var(--shadow-color) / 0.04)",
  ].join(", "),
};
const elevationVariables = Object.fromEntries(
  Object.entries(elevations).map(([level, shadow]) => [`--shadow-${level}`, shadow]),
);
const controlCastShadow = "var(--button-cast-shadow, var(--shadow-control))";

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

const paperPalettes = {
  light: {
    "paper-fill": "#f9f9f9",
    "paper-rule": "#79797914",
    "paper-dot": "#79797929",
    "paper-rule-strong": "#79797940",
  },
  dark: {
    "paper-fill": "#232323",
    "paper-rule": "#cecece0f",
    "paper-dot": "#cecece24",
    "paper-rule-strong": "#cecece30",
  },
};

const notebookIntervals = 20;
const notebookStep = 6;

function notebookMask() {
  const size = notebookIntervals * notebookStep;
  const rules = Array.from(
    { length: notebookIntervals - 1 },
    (_, index) => `M0 ${(index + 1) * notebookStep}H${size}`,
  ).join(" ");
  const fixedStroke = 'vector-effect="non-scaling-stroke"';
  // Round caps on zero-length paths keep junctions the same size as the tile scales.
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">`,
    `<path d="${rules}" stroke="white" stroke-opacity="0.3125" stroke-width="1" ${fixedStroke}/>`,
    `<path d="M0 0H${size}V${size}H0Z" stroke="white" stroke-width="2" ${fixedStroke}/>`,
    `<path d="M0 0h0 M${size} 0h0 M0 ${size}h0 M${size} ${size}h0" stroke="white" stroke-width="6" stroke-linecap="round" ${fixedStroke}/>`,
    "</svg>",
  ].join("");
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function ditherMask() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none" shape-rendering="crispEdges">',
    '<path d="M0 0L8 8M8 0L0 8" stroke="white" stroke-width="1" vector-effect="non-scaling-stroke"/>',
    "</svg>",
  ].join("");
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function maskedPattern(mask, size) {
  return {
    position: "relative",
    isolation: "isolate",
    // Keep the decorative SVG behind content without masking the container or its fill.
    "&::before": {
      content: '""',
      position: "absolute",
      inset: "0",
      "z-index": "-1",
      "pointer-events": "none",
      "border-radius": "inherit",
      "corner-shape": "inherit",
      "background-color": "var(--ninaero-pattern-ink, var(--paper-rule-strong))",
      "mask-image": `var(--${mask})`,
      "mask-mode": "alpha",
      "mask-size": `${size} ${size}`,
      "mask-repeat": "repeat",
      "@media (forced-colors: active)": { display: "none" },
    },
  };
}

const paperPatterns = {
  ruled: {
    spacing: 24,
    styles: {
      "background-image":
        "repeating-linear-gradient(transparent 0 calc(var(--ninaero-paper-step) - 1px), var(--ninaero-pattern-ink, var(--paper-rule)) calc(var(--ninaero-paper-step) - 1px) var(--ninaero-paper-step))",
    },
  },
  dotted: {
    spacing: 16,
    styles: {
      "background-image":
        "radial-gradient(circle, var(--ninaero-pattern-ink, var(--paper-dot)) 1px, transparent 1px)",
      "background-size": "var(--ninaero-paper-step) var(--ninaero-paper-step)",
    },
  },
  grid: {
    spacing: 24,
    styles: {
      "background-image":
        "linear-gradient(var(--ninaero-pattern-ink, var(--paper-rule)) 1px, transparent 1px), linear-gradient(90deg, var(--ninaero-pattern-ink, var(--paper-rule)) 1px, transparent 1px)",
      "background-size": "var(--ninaero-paper-step) var(--ninaero-paper-step)",
    },
  },
  notebook: {
    spacing: notebookStep,
    styles: {
      "--ninaero-notebook-size": `calc(var(--ninaero-paper-step) * ${notebookIntervals})`,
      ...maskedPattern("paper-notebook-mask", "var(--ninaero-notebook-size)"),
    },
  },
};

const paperUtilities = Object.fromEntries(
  Object.entries(paperPatterns).flatMap(([name, { spacing, styles }]) => {
    const declarations = {
      "--shadow-color": "var(--shadow-color-paper)",
      "background-color": "var(--paper-fill)",
      ...styles,
      "@media (forced-colors: active)": {
        "background-image": "none",
        "background-color": "Canvas",
      },
    };
    return [
      [
        `@utility ninaero-paper-${name}`,
        { "--ninaero-paper-step": `${spacing}px`, ...declarations },
      ],
      [
        `@utility ninaero-paper-${name}-*`,
        {
          "--ninaero-paper-step": "max(1px, calc(--value(number, [number]) * 1px))",
          ...declarations,
        },
      ],
    ];
  }),
);
const ditherStyles = maskedPattern("dither-mask", "var(--ninaero-dither-step)");
const patternInkColor = '--value(--color-*, "transparent", [color])';

export const theme = {
  font: sansFont,
  theme: {
    "shadow-flat": elevations.flat,
    "shadow-control": elevations.control,
    "shadow-floating": elevations.floating,
    "shadow-dialog": elevations.dialog,
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
    "input-edge": "#8b8b8b",
    "input-fill": "oklch(0.975 0 0)",
    "input-placeholder": "oklch(0.5 0 0)",
    "input-disabled-fill": "var(--muted)",
    "tabs-track-fill": "#ededed",
    "tabs-track-shade": "#0000000a",
    "tabs-active-fill": "#f6f6f6",
    "tabs-active-top": "#ffffff",
    "tabs-active-bottom": "#e1e1e1",
    "tabs-active-edge": "#7f7f7f",
    "tabs-active-highlight": "#ffffff80",
    "tabs-hover-fill": "#e3e3e3",
    "tabs-ink": "#616161",
    "input-recess-shade-weight": "6%",
    "input-recess-highlight-weight": "35%",
    foreground: "oklch(0.145 0 0)",
    "display-ink-top": "oklch(0.32 0 0)",
    "display-ink-bottom": "oklch(0.22 0 0)",
    "display-ink-shadow": "#00000014",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    popover: "var(--card)",
    "dialog-fill-shade": "color-mix(in oklab, var(--popover) 98%, black)",
    "dialog-highlight": "#ffffffb3",
    "dialog-shade": "#0000000d",
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
    "field-height": "2.25rem",
    "field-padding-inline": "1rem",
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
    ...paperPalettes.light,
    "paper-notebook-mask": notebookMask(),
    "dither-mask": ditherMask(),
  },
  dark: {
    background: "oklch(0.145 0 0)",
    "neutral-border": "#424242",
    "neutral-input": "#909090",
    "input-edge": "#6f6f6f",
    "input-fill": "oklch(0.18 0 0)",
    "input-placeholder": "var(--muted-foreground)",
    "input-disabled-fill": "var(--input-fill)",
    "tabs-track-fill": "#242424",
    "tabs-track-shade": "#00000040",
    "tabs-active-fill": "#3a3a3a",
    "tabs-active-top": "#454545",
    "tabs-active-bottom": "#2e2e2e",
    "tabs-active-edge": "#aaaaaa",
    "tabs-active-highlight": "#ffffff1a",
    "tabs-hover-fill": "#303030",
    "tabs-ink": "#b5b5b5",
    "input-recess-shade-weight": "12%",
    "input-recess-highlight-weight": "7%",
    foreground: "oklch(0.985 0 0)",
    "display-ink-top": "oklch(0.985 0 0)",
    "display-ink-bottom": "oklch(0.88 0 0)",
    "display-ink-shadow": "#00000040",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "var(--card)",
    "dialog-fill-shade": "color-mix(in oklab, var(--popover) 92%, black)",
    "dialog-highlight": "#ffffff24",
    "dialog-shade": "#00000040",
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
    ...paperPalettes.dark,
  },
  css: {
    ...accentRules,
    ...paperUtilities,
    "@utility ninaero-pattern-ink-*": {
      "--ninaero-pattern-ink": patternInkColor,
      // Tailwind omits each optional override when its modifier type does not match.
      "&": {
        "--ninaero-pattern-ink": `--alpha(${patternInkColor} / calc(--modifier(number) * 1%))`,
        "&": {
          "--ninaero-pattern-ink": `--alpha(${patternInkColor} / --modifier([number], [percentage]))`,
        },
      },
    },
    "@utility ninaero-dither": {
      "--ninaero-dither-step": "8px",
      ...ditherStyles,
    },
    "@utility ninaero-dither-*": {
      "--ninaero-dither-step": "max(1px, calc(--value(number, [number]) * 1px))",
      ...ditherStyles,
    },
    "@utility type-display": {
      "@apply font-[650] leading-[1.15] tracking-[-0.025em]": {},
    },
    "@utility ninaero-display-ink": {
      "background-image":
        "linear-gradient(to bottom in oklab, var(--display-ink-top), var(--display-ink-bottom))",
      "background-clip": "text",
      color: "transparent",
      // Shadow the clipped gradient glyphs without painting through their transparent text fill.
      filter: "drop-shadow(0 1px 1px var(--display-ink-shadow))",
      "&::selection": {
        "background-color": "var(--accent)",
        color: "var(--accent-foreground)",
      },
      "@media (forced-colors: active)": {
        "background-image": "none",
        color: "CanvasText",
        filter: "none",
        "&::selection": {
          "background-color": "Highlight",
          color: "HighlightText",
        },
      },
    },
    "@utility type-heading": {
      "@apply font-[650] leading-[1.25] tracking-[-0.015em]": {},
    },
    "@utility type-title": {
      "@apply font-[650] leading-[1.375] tracking-[-0.01em]": {},
    },
    "@utility type-body": {
      "@apply font-normal leading-normal tracking-normal": {},
    },
    "@utility type-prose": {
      "@apply font-normal leading-relaxed tracking-normal": {},
    },
    "@utility type-label": {
      "@apply font-[550] leading-5 tracking-normal": {},
    },
    "@utility type-caption": {
      "@apply font-normal leading-4 tracking-normal": {},
    },
    "@layer base": {
      "*": {
        "@apply border-border outline-ring/50": {},
      },
      "@media (forced-colors: none)": {
        "::selection": {
          "background-color": "var(--accent)",
          color: "var(--accent-foreground)",
        },
      },
      body: {
        "@apply bg-background text-foreground": {},
      },
      html: {
        "@apply font-sans type-body": {},
        "font-family": "var(--font-sans)",
        "font-variation-settings": `"ROND" ${sansFont.roundness}`,
      },
    },
    "@layer components": {
      // Resolve color-dependent tokens locally so receiving-material colors can inherit.
      ".ninaero-button, .ninaero-button-group, .ninaero-dialog, .ninaero-popover":
        elevationVariables,
      ".ninaero-surface-paper": {
        "--shadow-color": "var(--shadow-color-paper)",
      },
      ".ninaero-input, .ninaero-textarea, .ninaero-select-trigger, .ninaero-input-group": {
        "--input-corner": "0.75rem",
        "--input-recess-shade":
          "color-mix(in oklab, var(--input-fill), black var(--input-recess-shade-weight))",
        "--input-recess-highlight":
          "color-mix(in oklab, var(--input-fill), white var(--input-recess-highlight-weight))",
        "border-radius": "var(--input-corner)",
        "corner-shape": "round",
        border: "1px solid var(--input-edge)",
        color: "var(--card-foreground)",
        "background-color": "var(--input-fill)",
        "box-shadow":
          "inset 0 2px 6px var(--input-recess-shade), inset 0 -1px 2px var(--input-recess-highlight)",
        outline: "2px solid transparent",
        "outline-offset": "3px",
        transition: "background-color 80ms ease-out, border-color 80ms ease-out",
      },
      ".ninaero-input:where(:hover:not(:disabled)), .ninaero-textarea:where(:hover:not(:disabled)), .ninaero-select-trigger:where(:hover:not(:disabled):not([data-disabled])), .ninaero-input-group:where(:hover:not(:has(> [data-slot=input-group-control]:disabled)))":
        {
          "border-color": "var(--neutral-input)",
        },
      ".ninaero-input::placeholder, .ninaero-textarea::placeholder, .ninaero-select-trigger[data-placeholder], .ninaero-input-group > [data-slot=input-group-control]::placeholder":
        {
          color: "var(--input-placeholder)",
          opacity: "1",
        },
      ".ninaero-input:focus-visible, .ninaero-textarea:focus-visible, .ninaero-select-trigger:focus-visible, .ninaero-input-group:has(> [data-slot=input-group-control]:focus-visible)":
        {
          "outline-color": "var(--ring)",
        },
      ".ninaero-input[aria-invalid=true], .ninaero-textarea[aria-invalid=true], .ninaero-select-trigger[aria-invalid=true], .ninaero-select-trigger[data-invalid], .ninaero-input-group[aria-invalid=true], .ninaero-input-group:has(> [data-slot=input-group-control][aria-invalid=true])":
        {
          "border-color": "var(--destructive)",
        },
      ".ninaero-input:disabled, .ninaero-textarea:disabled, .ninaero-select-trigger:disabled, .ninaero-select-trigger[data-disabled], .ninaero-input-group:has(> [data-slot=input-group-control]:disabled)":
        {
          "border-color": "var(--border)",
          "background-color": "var(--input-disabled-fill)",
          color: "var(--muted-foreground)",
          "box-shadow": "none",
        },
      ".ninaero-input-group > [data-slot=input-group-control]": {
        "border-radius": "0",
        border: "0",
        color: "inherit",
        "background-color": "transparent",
        "box-shadow": "none",
        outline: "none",
      },
      ".ninaero-dialog": {
        "--dialog-corner": "3rem",
        "border-radius": "var(--dialog-corner)",
        "corner-shape": "squircle",
        border: "1px solid color-mix(in oklab, var(--foreground) 18%, var(--popover))",
        "background-color": "var(--popover)",
        "background-image":
          "linear-gradient(180deg in oklab, var(--popover), var(--dialog-fill-shade))",
        "box-shadow": `inset 0 1px 0 var(--dialog-highlight), inset 0 -1px 2px var(--dialog-shade), var(--shadow-dialog)`,
        opacity: "1",
        transform: "translateY(0) scale(1)",
        "transform-origin": "center",
        transition: "opacity 140ms ease-out, transform 260ms cubic-bezier(0.22, 2.2, 0.35, 1)",
      },
      ".ninaero-dialog[data-starting-style]": {
        opacity: "0",
        transform: "translateY(8px) scale(0.92)",
      },
      ".ninaero-dialog[data-ending-style]": {
        opacity: "0",
        transform: "translateY(4px) scale(0.96)",
        transition: "opacity 140ms ease-in, transform 140ms ease-in",
      },
      ".ninaero-dialog-overlay": {
        opacity: "1",
        transition: "opacity 160ms ease-out",
      },
      ".ninaero-dialog-overlay[data-starting-style]": {
        opacity: "0",
      },
      ".ninaero-dialog-overlay[data-ending-style]": {
        opacity: "0",
        "transition-duration": "140ms",
      },
      '.ninaero-dialog:has(> [data-slot="dialog-close"]) [data-slot="dialog-header"]': {
        "padding-inline-end": "2rem",
      },
      ".ninaero-popover": {
        "border-radius": "var(--radius-xl)",
        "corner-shape": "round",
        border: "1px solid var(--border)",
        color: "var(--popover-foreground)",
        "background-color": "var(--popover)",
        "box-shadow": `inset 0 1px 0 var(--button-highlight), var(--shadow-floating)`,
      },
      ".ninaero-select-content": {
        "transform-origin": "var(--transform-origin)",
        transition: "opacity 80ms ease-out, transform 80ms ease-out",
      },
      ".ninaero-select-content[data-starting-style], .ninaero-select-content[data-ending-style]": {
        opacity: "0",
        transform: "scale(0.98)",
      },
      ".ninaero-select-content[data-align-trigger=true]": {
        opacity: "1",
        transform: "none",
        transition: "none",
      },
      ".ninaero-select-icon": {
        color: "var(--input-placeholder)",
        transition: "transform 80ms ease-out",
      },
      ".ninaero-select-icon[data-popup-open]": {
        transform: "rotate(180deg)",
      },
      ".ninaero-select-item": {
        "border-radius": "var(--radius-md)",
        "corner-shape": "round",
        border: "1px solid transparent",
        outline: "2px solid transparent",
        "outline-offset": "-3px",
      },
      ".ninaero-select-item[data-selected]": {
        "border-color": "var(--ring)",
        "background-color": "var(--accent)",
        color: "var(--accent-foreground)",
      },
      ".ninaero-select-item[data-highlighted]": {
        "outline-color": "var(--ring)",
      },
      ".ninaero-select-item[data-highlighted]:not([data-selected]):not([data-disabled])": {
        "background-color": "var(--muted)",
      },
      ".ninaero-select-item[data-disabled]": {
        color: "var(--muted-foreground)",
      },
      ".ninaero-tabs-list": {
        "border-radius": "var(--radius-lg)",
        "corner-shape": "round",
        border: "1px solid var(--border)",
        "background-color": "var(--tabs-track-fill)",
        "box-shadow": "inset 0 1px 3px var(--tabs-track-shade)",
      },
      ".ninaero-tabs-trigger": {
        "border-radius": "var(--radius-md)",
        "corner-shape": "round",
        border: "1px solid transparent",
        color: "var(--tabs-ink)",
        "background-color": "transparent",
        outline: "2px solid transparent",
        "outline-offset": "2px",
        transition:
          "background-color 100ms ease-out, border-color 100ms ease-out, box-shadow 100ms ease-out, color 100ms ease-out",
      },
      ".ninaero-tabs-trigger[data-active]": {
        color: "var(--foreground)",
      },
      [`${segmentedTabSelector}[data-active]`]: {
        "border-color": "var(--tabs-active-edge)",
        "background-color": "var(--tabs-active-fill)",
        "background-image":
          "radial-gradient(ellipse at 50% -45% in oklab, var(--tabs-active-highlight), transparent 75%), linear-gradient(180deg in oklab, var(--tabs-active-top), var(--tabs-active-fill) 48%, var(--tabs-active-bottom))",
        "box-shadow":
          "inset 0 1px 0 var(--tabs-active-highlight), inset 0 -1px 0 var(--tabs-active-bottom), 0 1px 2px hsl(var(--shadow-color) / 0.2)",
      },
      [`${segmentedTabSelector}:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])`]:
        {
          "background-color": "var(--tabs-hover-fill)",
          "background-image": "none",
          "box-shadow": "inset 0 1px 2px var(--tabs-track-shade)",
        },
      ".ninaero-tabs-trigger:disabled, .ninaero-tabs-trigger[data-disabled], .ninaero-tabs-trigger[aria-disabled=true]":
        {
          color: "var(--muted-foreground)",
          "background-image": "none",
          "box-shadow": "none",
          cursor: "not-allowed",
        },
      ".ninaero-tabs-content": {
        outline: "2px solid transparent",
        "outline-offset": "3px",
      },
      ".ninaero-tabs-trigger:focus-visible, .ninaero-tabs-content:focus-visible": {
        "outline-color": "var(--ring)",
      },
      ".ninaero-tabs-list[data-variant=line]": {
        "border-radius": "0",
        border: "0",
        "background-color": "transparent",
        "box-shadow": "none",
      },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger": {
        "border-color": "transparent",
        "background-color": "transparent",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger::after": {
        "--tabs-marker-edge-shadow": "inset 0 -1px 0 var(--tabs-active-edge)",
        content: '""',
        position: "absolute",
        "inset-inline": "0.75rem",
        "inset-block-end": "0",
        height: "4px",
        "box-sizing": "border-box",
        "border-radius": "2px",
        border: "0",
        "background-color": "var(--tabs-active-fill)",
        "background-image":
          "radial-gradient(ellipse at 50% -45% in oklab, var(--tabs-active-highlight), transparent 75%), linear-gradient(180deg in oklab, var(--tabs-active-top), var(--tabs-active-fill) 48%, var(--tabs-active-bottom))",
        "box-shadow":
          "inset 0 1px 0 var(--tabs-active-highlight), var(--tabs-marker-edge-shadow), 0 1px 1px hsl(var(--shadow-color) / 0.1), 0 2px 3px hsl(var(--shadow-color) / 0.06)",
        "pointer-events": "none",
        opacity: "0",
      },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger[data-active]::after": {
        opacity: "1",
      },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger:where(:active:not(:disabled):not([data-disabled]):not([aria-disabled=true]))::after":
        {
          "background-color": "var(--tabs-active-edge)",
          "background-image": "none",
          "box-shadow": "none",
        },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger:where(:disabled, [data-disabled], [aria-disabled=true])::after":
        {
          "background-color": "var(--muted-foreground)",
          "background-image": "none",
          "box-shadow": "none",
        },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger[data-orientation=vertical]::after":
        {
          "--tabs-marker-edge-shadow": "inset -1px 0 0 var(--tabs-active-edge)",
          "inset-inline-start": "auto",
          "inset-inline-end": "0",
          "inset-block": "4px",
          width: "4px",
          height: "auto",
        },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger:where([data-orientation=vertical]):dir(rtl)::after":
        {
          "--tabs-marker-edge-shadow": "inset 1px 0 0 var(--tabs-active-edge)",
        },
      ".ninaero-toggle": {
        "--toggle-corner": "var(--radius-md)",
        "--button-recess-fill": "var(--button-paper-pressed)",
        "--button-recess-shade":
          "color-mix(in oklab, var(--button-recess-fill), black var(--button-recess-shade-weight))",
        "--button-recess-highlight":
          "color-mix(in oklab, var(--button-recess-fill), white var(--button-recess-highlight-weight))",
        "border-radius": "var(--toggle-corner)",
        "corner-shape": "round",
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
      ".ninaero-rounded-control, .ninaero-input-group .ninaero-button, .ninaero-button[data-day], .ninaero-button[data-slot=combobox-trigger], .ninaero-button[data-slot=combobox-chip-remove]":
        {
          "border-radius": "var(--radius-md)",
          "corner-shape": "round",
        },
      ".ninaero-button[data-day]": {
        "border-radius": "var(--cell-radius)",
      },
      ".ninaero-button--primary": {
        "--button-recess-fill": "var(--button-primary-pressed)",
        color: "var(--button-primary-ink)",
        "background-color": "var(--button-primary-fill)",
        "background-image":
          "linear-gradient(180deg in oklab, var(--button-highlight), transparent 65%)",
        "border-color": "var(--button-primary-edge)",
        "box-shadow": `inset 0 1px 0 var(--button-highlight), ${controlCastShadow}`,
      },
      ".ninaero-button--secondary, .ninaero-button--outline": {
        "--button-recess-fill": "var(--button-paper-pressed)",
        color: "var(--button-paper-ink)",
      },
      ".ninaero-button--secondary": {
        "border-color": "var(--button-paper-edge)",
        "background-color": "var(--button-paper-fill)",
        "background-image":
          "linear-gradient(180deg in oklab, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
        "box-shadow": `inset 0 1px 0 var(--button-paper-highlight), inset 0 -1px 0 var(--button-paper-shade), ${controlCastShadow}`,
      },
      ".ninaero-button--destructive": {
        "--button-recess-fill": "var(--button-destructive-pressed)",
        color: "var(--button-destructive-ink)",
        "background-color": "var(--button-destructive-fill)",
        "background-image":
          "linear-gradient(180deg in oklab, var(--button-destructive-highlight), transparent 55%, var(--button-destructive-shade))",
        "border-color": "var(--button-destructive-edge)",
        "box-shadow": `inset 0 1px 0 var(--button-destructive-highlight), inset 0 -1px 0 var(--button-destructive-shade), ${controlCastShadow}`,
      },
      ".ninaero-button--outline": {
        "border-color": "var(--button-outline-edge)",
        "background-color": "var(--background)",
        "box-shadow":
          "inset 0 1px 0 var(--button-paper-highlight), inset 0 -1px 0 var(--button-paper-shade), 0 1px 2px hsl(var(--shadow-color) / 0.08)",
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
      [raisedButtonGroupSelector]: {
        "border-radius": "var(--button-group-corner, 1rem)",
        "corner-shape": "squircle",
        "box-shadow": "var(--shadow-control)",
      },
      [`${raisedButtonGroupSelector} > .ninaero-button`]: {
        "--button-cast-shadow": "var(--shadow-flat)",
      },
      "@media (hover: hover)": {
        ".ninaero-tabs-trigger:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([data-active])":
          {
            color: "var(--foreground)",
          },
        [`${segmentedTabSelector}:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([data-active])`]:
          {
            "background-color": "var(--tabs-hover-fill)",
          },
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
        ".ninaero-tabs-trigger": {
          transition: "none",
        },
        ".ninaero-dialog, .ninaero-dialog[data-starting-style], .ninaero-dialog[data-ending-style], .ninaero-dialog-overlay, .ninaero-dialog-overlay[data-starting-style], .ninaero-dialog-overlay[data-ending-style]":
          {
            animation: "none",
            transition: "none",
            transform: "none",
            opacity: "1",
          },
        ".ninaero-input, .ninaero-textarea, .ninaero-select-trigger, .ninaero-input-group": {
          transition: "none",
        },
        ".ninaero-select-content, .ninaero-select-icon": {
          transition: "none",
        },
        ".ninaero-select-content[data-starting-style], .ninaero-select-content[data-ending-style]":
          {
            opacity: "1",
            transform: "none",
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
        ".ninaero-tabs-list": {
          "border-color": "CanvasText",
          "background-color": "Canvas",
          "box-shadow": "none",
        },
        ".ninaero-tabs-trigger": {
          color: "ButtonText",
          "background-color": "ButtonFace",
          "box-shadow": "none",
        },
        [`${segmentedTabSelector}[data-active]`]: {
          "border-color": "Highlight",
          "background-color": "Highlight",
          "background-image": "none",
          color: "HighlightText",
          "box-shadow": "none",
        },
        [`${segmentedTabSelector}:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([data-active]), ${segmentedTabSelector}:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])`]:
          {
            "background-color": "ButtonFace",
            color: "ButtonText",
            "box-shadow": "none",
          },
        [`${segmentedTabSelector}[data-active]:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])`]:
          {
            "background-color": "Highlight",
            color: "HighlightText",
          },
        ".ninaero-tabs-list[data-variant=line]": {
          "background-color": "Canvas",
          "box-shadow": "none",
        },
        ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger": {
          "border-color": "transparent",
          "background-color": "Canvas",
          "box-shadow": "none",
        },
        ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger::after": {
          "background-color": "Highlight",
          "background-image": "none",
          "box-shadow": "none",
        },
        ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger:where(:disabled, [data-disabled], [aria-disabled=true])::after":
          {
            "background-color": "GrayText",
          },
        ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger[data-active]": {
          color: "Highlight",
        },
        ".ninaero-tabs-trigger:disabled, .ninaero-tabs-trigger[data-disabled], .ninaero-tabs-trigger[aria-disabled=true]":
          {
            color: "GrayText",
            "box-shadow": "none",
          },
        ".ninaero-tabs-trigger:focus-visible, .ninaero-tabs-content:focus-visible": {
          "outline-color": "Highlight",
        },
        ".ninaero-dialog": {
          "border-color": "CanvasText",
          "background-color": "Canvas",
          "background-image": "none",
          color: "CanvasText",
          "box-shadow": "none",
        },
        ".ninaero-input, .ninaero-textarea, .ninaero-select-trigger, .ninaero-input-group": {
          "border-color": "CanvasText",
          "background-color": "Canvas",
          color: "CanvasText",
          "box-shadow": "none",
        },
        ".ninaero-input::placeholder, .ninaero-textarea::placeholder, .ninaero-select-trigger[data-placeholder], .ninaero-input-group > [data-slot=input-group-control]::placeholder":
          {
            color: "GrayText",
          },
        ".ninaero-input[aria-invalid=true], .ninaero-textarea[aria-invalid=true], .ninaero-select-trigger[aria-invalid=true], .ninaero-select-trigger[data-invalid], .ninaero-input-group[aria-invalid=true], .ninaero-input-group:has(> [data-slot=input-group-control][aria-invalid=true])":
          {
            "border-color": "CanvasText",
          },
        ".ninaero-input:focus-visible, .ninaero-textarea:focus-visible, .ninaero-select-trigger:focus-visible, .ninaero-input-group:has(> [data-slot=input-group-control]:focus-visible)":
          {
            "outline-color": "Highlight",
          },
        ".ninaero-input:disabled, .ninaero-textarea:disabled, .ninaero-select-trigger:disabled, .ninaero-select-trigger[data-disabled], .ninaero-input-group:has(> [data-slot=input-group-control]:disabled)":
          {
            "border-color": "GrayText",
            "background-color": "Canvas",
            color: "GrayText",
          },
        ".ninaero-input-group > [data-slot=input-group-control]": {
          "background-color": "transparent",
          color: "inherit",
        },
        ".ninaero-popover": {
          "border-color": "CanvasText",
          "background-color": "Canvas",
          color: "CanvasText",
          "box-shadow": "none",
        },
        ".ninaero-select-icon": {
          color: "ButtonText",
        },
        ".ninaero-select-trigger:disabled .ninaero-select-icon, .ninaero-select-trigger[data-disabled] .ninaero-select-icon":
          {
            color: "GrayText",
          },
        ".ninaero-select-item": {
          "border-color": "Canvas",
          "outline-color": "Canvas",
          "background-color": "Canvas",
          color: "CanvasText",
        },
        ".ninaero-select-item[data-selected]": {
          "border-color": "Highlight",
          "background-color": "Highlight",
          color: "HighlightText",
        },
        ".ninaero-select-item[data-highlighted]": {
          "outline-color": "Highlight",
        },
        ".ninaero-select-item[data-highlighted]:not([data-selected]):not([data-disabled])": {
          "background-color": "Canvas",
        },
        ".ninaero-select-item[data-disabled]": {
          "border-color": "Canvas",
          "background-color": "Canvas",
          color: "GrayText",
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
        [raisedButtonGroupSelector]: {
          "box-shadow": "none",
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
