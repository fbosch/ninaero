import { accentPresets, accentRules, accentSemanticTokens, defaultAccent } from "./accents.mjs";
import { createGlassGradientTokens, withGlassGradientVariables } from "./glass-materials.mjs";

export const glassMarkForcedColors = {
  ".ninaero-mark-face": { fill: "none", stroke: "CanvasText" },
  ".ninaero-mark-highlight": { stroke: "CanvasText" },
};

const enabledFocus =
  ":not(:disabled):not([data-disabled]:not([data-disabled=false])):not([aria-disabled=true])";
const focusable = `:focus-visible${enabledFocus}:not(:is(.ninaero-select-item, .ninaero-combobox-item)):not(.ninaero-calendar-day-button):not(.ninaero-dropdown-menu-item):not(.ninaero-dropdown-menu-content):not([data-slot=input-group-control]):not([data-slot=input-otp]):not([data-slot=slider-thumb] input):not([data-slot=combobox-chips] input):not([data-slot=questionnaire-choice] input)`;
const focusFrames = [
  ".ninaero-button",
  ".ninaero-toggle",
  ".ninaero-tabs-trigger",
  ".ninaero-select-trigger",
  "[data-slot=checkbox]",
  "[data-slot=radio-group-item]",
  "[data-slot=switch]",
  "[data-slot=accordion-trigger]",
  "[data-slot=navigation-menu-trigger]",
  "[data-slot=navigation-menu-link]",
  "[data-slot=menubar-trigger]",
  "[data-slot=menubar-sub-trigger]",
  "[data-slot=dropdown-menu-item]",
  "[data-slot=dropdown-menu-sub-trigger]",
  "[data-slot=dropdown-menu-checkbox-item]",
  "[data-slot=dropdown-menu-radio-item]",
  "[data-slot=context-menu-item]",
  "[data-slot=context-menu-sub-trigger]",
  "[data-slot=context-menu-checkbox-item]",
  "[data-slot=context-menu-radio-item]",
  "[data-slot=menubar-item]",
  "[data-slot=menubar-checkbox-item]",
  "[data-slot=menubar-radio-item]",
  "[data-slot=combobox-item]",
  "[data-slot=command-item]",
  "[data-slot=input-otp-slot]",
  "[data-slot=combobox-chips]",
  "[data-slot=questionnaire-choice]",
].join(", ");
const proxyFocus = [
  `.ninaero-input-group:has(> [data-slot=input-group-control]:focus-visible${enabledFocus})`,
  `[data-slot=combobox-chips]:has(input:focus-visible${enabledFocus})`,
  `[data-slot=questionnaire-choice]:has(input:focus-visible${enabledFocus})`,
  `.ninaero-slider-thumb:has(:focus-visible)${enabledFocus}`,
  "[data-slot=input-otp-slot][data-active=true]",
  // These primitives retain DOM focus on the input or list while moving the active option.
  "[data-slot=command]:focus-within [data-slot=command-item][data-selected=true]",
]
  .map((selector) => `${selector}${enabledFocus}`)
  .join(", ");
const focusTargets = `${focusable}, ${proxyFocus}`;
const focusGlowShadow = "0 0 12px 1px color-mix(in oklab, var(--ring) 16%, transparent)";
const focusShadow = `var(--ninaero-material-shadow, var(--tw-shadow, 0 0 #0000)), ${focusGlowShadow}`;

// Preserve each material and pressed-state shadow when adding the shared focus halo.
export function withMaterialShadows(rules) {
  return Object.fromEntries(
    Object.entries(rules).flatMap(([key, value]) => {
      if (key === "box-shadow") {
        return [
          [key, value],
          ["--ninaero-material-shadow", value === "none" ? "0 0 #0000" : value],
        ];
      }
      return [[key, value && typeof value === "object" ? withMaterialShadows(value) : value]];
    }),
  );
}

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
export const elevationVariables = Object.fromEntries(
  Object.entries({
    ...elevations,
    sm: elevations.control,
    md: elevations.floating,
    lg: elevations.floating,
    xl: elevations.dialog,
    "2xl": elevations.dialog,
  }).map(([level, shadow]) => [`--shadow-${level}`, shadow]),
);

export function shadowColorChannels(surface) {
  return `from color-mix(in oklab, ${surface} 40%, black) h s l`;
}

export function shadowSurface(surface) {
  return {
    "--shadow-surface": surface,
    "--shadow-color": shadowColorChannels("var(--shadow-surface)"),
    ...elevationVariables,
  };
}

export const menuItemCastShadow = [
  "0 1px 2px hsl(var(--shadow-color) / 0.06)",
  "0 2px 4px hsl(var(--shadow-color) / 0.03)",
].join(", ");

export function recessShadow(fill) {
  return [
    `inset 0 2px 6px color-mix(in oklab, ${fill}, black var(--recess-shade-weight))`,
    `inset 0 -1px 2px color-mix(in oklab, ${fill}, white var(--recess-highlight-weight))`,
  ].join(", ");
}

export const recessedTrackMaterial = {
  border: "1px solid var(--input-edge)",
  "background-color": "var(--input-fill)",
  "box-shadow": recessShadow("var(--input-fill)"),
};
export const selectedTrackMaterial = {
  "background-color": "var(--button-primary-fill)",
  "background-image":
    "linear-gradient(180deg in oklab, var(--glass-mark-face-0), var(--glass-mark-face-50) 48%, var(--glass-mark-face-100))",
  "box-shadow":
    "inset 0 1px 0 color-mix(in oklab, var(--glass-mark-face-0), white 25%), inset 0 -1px 0 color-mix(in oklab, var(--glass-mark-face-100), black 8%)",
};
// Invalid Switch and Slider rebind the selected glass to the semantic destructive material, so the
// on/selected parts turn red with the same shading. Off and empty states keep the red border alone.
export const invalidSelectedMaterial = {
  "--button-primary-fill": "var(--button-destructive-fill)",
  "--glass-mark-face-0": "var(--button-destructive-hover)",
  "--glass-mark-face-50":
    "color-mix(in oklab, var(--button-destructive-hover), var(--button-destructive-pressed))",
  "--glass-mark-face-100": "var(--button-destructive-pressed)",
};
export const paperThumbMaterial = {
  "border-color": "var(--button-paper-edge)",
  "background-color": "var(--button-paper-fill)",
  "background-image":
    "linear-gradient(180deg in oklab, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
  "box-shadow": "inset 0 -1px 0 var(--button-paper-shade), var(--shadow-control)",
};
export const pressedThumbMaterial = {
  "background-color": "var(--button-paper-pressed)",
  "background-image": "none",
  "box-shadow": recessShadow("var(--button-paper-pressed)"),
};
const sansFont = {
  family: "'Google Sans Flex Variable', ui-sans-serif, system-ui, sans-serif",
  dependency: "@fontsource-variable/google-sans-flex",
  // The full font keeps custom axes; the package default only keeps weight.
  stylesheet: "@fontsource-variable/google-sans-flex/full.css",
  roundness: 100,
};
const codeFont = {
  family:
    "'Google Sans Code Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  dependency: "@fontsource-variable/google-sans-code",
  stylesheet: "@fontsource-variable/google-sans-code/full.css",
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

function flipnoteMask() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="white" shape-rendering="crispEdges">',
    '<path d="M0 0h1v1H0z M4 1h1v1H4z M2 3h1v1H2z M6 3h1v1H6z M1 5h1v1H1z M5 5h1v1H5z M3 7h1v1H3z M7 7h1v1H7z"/>',
    "</svg>",
  ].join("");
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
const overlayDotRadius = 0.75;

function overlayDotsMask() {
  // Relative dimensions let mask-size set the viewport without scaling the dot.
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="white">',
    `<circle cx="50%" cy="50%" r="${overlayDotRadius}"/>`,
    "</svg>",
  ].join("");
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
const overlayChannels = {
  multiply: "clamp(0, 2 * r / max(0.000001, 1 - alpha + alpha * 2 * g), 1)",
  screen: "clamp(0, (2 * r - alpha * 2 * g) / max(0.000001, 1 - alpha * 2 * g), 1)",
  normal: "clamp(0, (2 * r - alpha * 2 * g) / max(0.000001, 1 - alpha), 1)",
};

function overlaySurface(surface) {
  // Neutral surfaces and ink have equal RGB channels. Pack surface/ink into R/G
  // and effective opacity into alpha so relative CSS colors can invert the blend.
  const pair = `color-mix(in srgb, color(from ${surface} srgb r 0 0) 50%, color(from var(--foreground) srgb 0 g 0))`;
  const origin = `color(from ${pair} srgb r g b / var(--ninaero-overlay-effective-opacity))`;
  const channel = "var(--ninaero-overlay-compensated-channel)";
  return `color(from ${origin} srgb ${channel} ${channel} ${channel} / 1)`;
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
    spacing: "1.5rem",
    styles: {
      "background-image":
        "repeating-linear-gradient(transparent 0 calc(var(--ninaero-paper-step) - 1px), var(--ninaero-pattern-ink, var(--paper-rule)) calc(var(--ninaero-paper-step) - 1px) var(--ninaero-paper-step))",
    },
  },
  dotted: {
    spacing: "16px",
    styles: {
      "background-image":
        "radial-gradient(circle, var(--ninaero-pattern-ink, var(--paper-dot)) 1px, transparent 1px)",
      "background-size": "var(--ninaero-paper-step) var(--ninaero-paper-step)",
    },
  },
  grid: {
    spacing: "24px",
    styles: {
      "background-image":
        "linear-gradient(var(--ninaero-pattern-ink, var(--paper-rule)) 1px, transparent 1px), linear-gradient(90deg, var(--ninaero-pattern-ink, var(--paper-rule)) 1px, transparent 1px)",
      "background-size": "var(--ninaero-paper-step) var(--ninaero-paper-step)",
    },
  },
  notebook: {
    spacing: `${notebookStep}px`,
    styles: {
      "--ninaero-notebook-size": `calc(var(--ninaero-paper-step) * ${notebookIntervals})`,
      ...maskedPattern("paper-notebook-mask", "var(--ninaero-notebook-size)"),
    },
  },
};

const paperUtilities = Object.fromEntries(
  Object.entries(paperPatterns).flatMap(([name, { spacing, styles }]) => {
    const declarations = {
      ...shadowSurface("var(--paper-fill)"),
      "background-color": "var(--paper-fill)",
      ...styles,
      "@media (forced-colors: active)": {
        "background-image": "none",
        "background-color": "Canvas",
      },
    };
    return [
      [`@utility ninaero-paper-${name}`, { "--ninaero-paper-step": spacing, ...declarations }],
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
// The header overlay textures as ordinary element patterns, sharing the overlay's mask tokens.
const orderedDotsStyles = maskedPattern("overlay-dots-mask", "var(--ninaero-ordered-dots-step)");
const diagonalLinesStyles = maskedPattern(
  "overlay-lines-mask",
  "var(--ninaero-diagonal-lines-step)",
);
const flipnoteStyles = maskedPattern("overlay-flipnote-mask", "var(--ninaero-flipnote-step)");
const checkerStyles = {
  "background-image":
    "conic-gradient(var(--ninaero-pattern-ink, var(--paper-rule)) 25%, transparent 0 50%, var(--ninaero-pattern-ink, var(--paper-rule)) 0 75%, transparent 0)",
  "background-size": "calc(var(--ninaero-checker-step) * 2) calc(var(--ninaero-checker-step) * 2)",
  "@media (forced-colors: active)": { "background-image": "none" },
};
const wideCheckerStyles = {
  ...checkerStyles,
  "background-size": "calc(var(--ninaero-checker-step) * 4) calc(var(--ninaero-checker-step) * 2)",
};
const patternInkColor = '--value(--color-*, "transparent", [color])';

export const theme = {
  font: sansFont,
  codeFont,
  theme: {
    ...Object.fromEntries(
      Object.entries(elevationVariables).map(([name, value]) => [name.slice(2), value]),
    ),
    "font-heading": "var(--font-sans)",
    "font-sans": sansFont.family,
    "font-mono": codeFont.family,
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
    "neutral-border": "#e8e8e8",
    "neutral-input": "#b8b8b8",
    "input-edge": "#c8c8c8",
    "input-fill": "oklch(0.975 0 0)",
    // The neutral recess shade's lightness (input-fill less 6%), tinted toward the destructive hue.
    "input-invalid-shade": "oklch(0.9165 0.04 25)",
    "input-placeholder": "oklch(0.5 0 0)",
    "input-disabled-fill": "var(--muted)",
    "tabs-track-fill": "#ededed",
    "tabs-active-fill": "#f6f6f6",
    "tabs-active-top": "#ffffff",
    "tabs-active-bottom": "#e1e1e1",
    "tabs-active-edge": "#777777",
    "tabs-active-highlight": "#ffffff80",
    "tabs-hover-fill": "#e3e3e3",
    "tabs-ink": "#575757",
    "recess-shade-weight": "6%",
    "recess-highlight-weight": "35%",
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
    "tooltip-scanline-ink": "color-mix(in oklab, var(--background) 7%, transparent)",
    "popover-foreground": "var(--card-foreground)",
    secondary: "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    destructive: "#b21823",
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
    ...createGlassGradientTokens(accentPresets[defaultAccent].light),
    ...accentSemanticTokens,
    "button-paper-fill": "#f8f8f8",
    "button-paper-edge": "#c5c5c5",
    "button-outline-edge": "#c8c8c8",
    "button-paper-hover": "#eeeeee",
    "button-paper-ink": "#383838",
    "button-paper-text-shadow": "0 1px 0 #ffffffb3",
    "control-label-text-shadow": "0 0.5px 0 #ffffff80",
    "button-paper-pressed": "#e3e3e3",
    "button-paper-highlight": "#ffffffa6",
    "button-paper-shade": "#3333330d",
    "button-destructive-fill": "#ffd0d1",
    "button-destructive-hover": "#ffc3c3",
    "button-destructive-pressed": "#ffafae",
    "button-destructive-ink": "#79191b",
    "button-destructive-edge": "#c43f40",
    "button-destructive-highlight": "#ffffff80",
    "button-destructive-shade": "#5a0a1014",
    "button-highlight": "#ffffff80",
    "shadow-surface": "var(--background)",
    "shadow-color": shadowColorChannels("var(--shadow-surface)"),
    ...paperPalettes.light,
    "paper-notebook-mask": notebookMask(),
    "dither-mask": ditherMask(),
    "overlay-flipnote-mask": flipnoteMask(),
    "overlay-dots-mask": overlayDotsMask(),
    "overlay-checker-mask":
      "conic-gradient(black 25%, transparent 0 50%, black 0 75%, transparent 0)",
    "overlay-lines-mask":
      "linear-gradient(45deg, black 12.5%, transparent 0 50%, black 0 62.5%, transparent 0)",
    "ninaero-overlay-blend-mode": "multiply",
    "ninaero-overlay-opacity": "0.06",
    "ninaero-overlay-coverage": "0.5",
    "ninaero-overlay-compensation": "1",
  },
  dark: {
    background: "oklch(0.145 0 0)",
    "neutral-border": "#303030",
    "neutral-input": "#555555",
    "input-edge": "#454545",
    "input-fill": "oklch(0.18 0 0)",
    // The neutral recess shade's lightness (input-fill less 12%), tinted toward the destructive hue.
    "input-invalid-shade": "oklch(0.1584 0.07 22)",
    "input-placeholder": "var(--muted-foreground)",
    "input-disabled-fill": "var(--input-fill)",
    "tabs-track-fill": "#242424",
    "tabs-active-fill": "#3a3a3a",
    "tabs-active-top": "#454545",
    "tabs-active-bottom": "#2e2e2e",
    "tabs-active-edge": "#aaaaaa",
    "tabs-active-highlight": "#ffffff1a",
    "tabs-hover-fill": "#303030",
    "tabs-ink": "#b5b5b5",
    "recess-shade-weight": "12%",
    "recess-highlight-weight": "7%",
    foreground: "oklch(0.985 0 0)",
    "display-ink-top": "oklch(0.985 0 0)",
    "display-ink-bottom": "oklch(0.88 0 0)",
    "display-ink-shadow": "#00000040",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "var(--card)",
    "dialog-fill-shade": "color-mix(in oklab, var(--popover) 92%, black)",
    "dialog-highlight": "#ffffff0d",
    "dialog-shade": "#00000040",
    "tooltip-scanline-ink": "color-mix(in oklab, var(--background) 3%, transparent)",
    "popover-foreground": "var(--card-foreground)",
    secondary: "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    destructive: "#ff9996",
    "chart-1": "oklch(0.87 0 0)",
    "chart-2": "oklch(0.556 0 0)",
    "chart-3": "oklch(0.439 0 0)",
    "chart-4": "oklch(0.371 0 0)",
    "chart-5": "oklch(0.269 0 0)",
    sidebar: "oklch(0.205 0 0)",
    "sidebar-foreground": "oklch(0.985 0 0)",
    ...accentPresets[defaultAccent].dark,
    ...createGlassGradientTokens(accentPresets[defaultAccent].dark),
    ...accentSemanticTokens,
    "button-paper-fill": "#343434",
    "button-paper-edge": "#555555",
    "button-outline-edge": "#454545",
    "button-paper-hover": "#454545",
    "button-paper-ink": "#efefef",
    "button-paper-text-shadow": "0 1px 1px #00000066",
    "control-label-text-shadow": "0 0.5px 0.5px #00000059",
    "button-paper-pressed": "#2e2e2e",
    "button-paper-highlight": "#ffffff0d",
    "button-paper-shade": "#00000040",
    "button-destructive-fill": "#fb9494",
    "button-destructive-hover": "#ffa4a3",
    "button-destructive-pressed": "#f18381",
    "button-destructive-ink": "#330b0a",
    "button-destructive-edge": "#feb9b8",
    "button-destructive-highlight": "#ffffff26",
    "button-destructive-shade": "#00000040",
    "button-highlight": "#ffffff33",
    "shadow-surface": "var(--background)",
    "shadow-color": shadowColorChannels("var(--shadow-surface)"),
    ...paperPalettes.dark,
    "ninaero-overlay-blend-mode": "screen",
  },
  css: {
    ...Object.fromEntries(
      Object.entries(accentRules).map(([selector, variables]) => [
        selector,
        withGlassGradientVariables(variables),
      ]),
    ),
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
    "@utility ninaero-checker": {
      "--ninaero-checker-step": "12px",
      ...checkerStyles,
    },
    "@utility ninaero-checker-*": {
      "--ninaero-checker-step": "max(1px, calc(--value(number, [number]) * 1px))",
      ...checkerStyles,
    },
    "@utility ninaero-checker-wide": {
      "--ninaero-checker-step": "12px",
      ...wideCheckerStyles,
    },
    "@utility ninaero-checker-wide-*": {
      "--ninaero-checker-step": "max(1px, calc(--value(number, [number]) * 1px))",
      ...wideCheckerStyles,
    },
    "@utility ninaero-dither": {
      "--ninaero-dither-step": "8px",
      ...ditherStyles,
    },
    "@utility ninaero-dither-*": {
      "--ninaero-dither-step": "max(1px, calc(--value(number, [number]) * 1px))",
      ...ditherStyles,
    },
    "@utility ninaero-overlay-dither": {
      isolation: "isolate",
      "@supports (color: color(from red srgb r g b)) and (opacity: calc(1px / 1px)) and (color: if(style(--ninaero-overlay-blend-mode: multiply): red))":
        {
          "--ninaero-overlay-compensated-channel": `if(${Object.entries(overlayChannels)
            .map(([mode, channel]) => `style(--ninaero-overlay-blend-mode: ${mode}): ${channel}`)
            .join("; ")}; else: calc(2 * r))`,
          "--ninaero-overlay-effective-opacity":
            "calc(clamp(0, var(--ninaero-overlay-opacity), 1) * clamp(0, var(--ninaero-overlay-coverage), 1) * clamp(0, var(--ninaero-overlay-compensation), 1))",
          "--ninaero-overlay-background": overlaySurface("var(--background)"),
          "--ninaero-overlay-card": overlaySurface("var(--card)"),
          "--ninaero-overlay-muted": overlaySurface("var(--muted)"),
          "&:where(body)": { "background-color": "var(--ninaero-overlay-background)" },
        },
      "@media (forced-colors: active), print": {
        "--ninaero-overlay-compensation": "0",
      },
      "&::after": {
        content: '""',
        position: "fixed",
        inset: "0",
        // Keep the texture below page content and portaled UI.
        "z-index": "0",
        "pointer-events": "none",
        "user-select": "none",
        "background-color": "var(--foreground)",
        "mix-blend-mode": "var(--ninaero-overlay-blend-mode)",
        "mask-image": "var(--ninaero-overlay-pattern, var(--overlay-checker-mask))",
        "mask-mode": "alpha",
        "mask-size":
          "var(--ninaero-overlay-size, var(--ninaero-overlay-tile, 2px)) var(--ninaero-overlay-size, var(--ninaero-overlay-tile, 2px))",
        "mask-repeat": "repeat",
        opacity: "var(--ninaero-overlay-opacity)",
        "@media (forced-colors: active)": { display: "none" },
        "@media print": { display: "none" },
      },
    },
    // A blended texture escapes backdrop-filter sampling; use normal blending while modals blur it.
    "body.ninaero-overlay-dither:has(.ninaero-dialog-overlay)": {
      "--ninaero-overlay-blend-mode": "normal",
    },
    "@utility ninaero-overlay-dots": {
      "--ninaero-overlay-pattern": "var(--overlay-dots-mask)",
      "--ninaero-overlay-tile": "4px",
      "--ninaero-overlay-coverage": `clamp(0, calc(pi * pow(${overlayDotRadius}px / var(--ninaero-overlay-size, var(--ninaero-overlay-tile)), 2)), 1)`,
    },
    "@utility ninaero-overlay-lines": {
      "--ninaero-overlay-pattern": "var(--overlay-lines-mask)",
      "--ninaero-overlay-tile": "4px",
      "--ninaero-overlay-coverage": "0.25",
    },
    "@utility ninaero-overlay-flipnote": {
      "--ninaero-overlay-pattern": "var(--overlay-flipnote-mask)",
      "--ninaero-overlay-tile": "8px",
      "--ninaero-overlay-coverage": "0.125",
    },
    "@utility ninaero-ordered-dots": {
      "--ninaero-ordered-dots-step": "4px",
      ...orderedDotsStyles,
    },
    "@utility ninaero-ordered-dots-*": {
      "--ninaero-ordered-dots-step": "max(1px, calc(--value(number, [number]) * 1px))",
      ...orderedDotsStyles,
    },
    "@utility ninaero-diagonal-lines": {
      "--ninaero-diagonal-lines-step": "4px",
      ...diagonalLinesStyles,
    },
    "@utility ninaero-diagonal-lines-*": {
      "--ninaero-diagonal-lines-step": "max(1px, calc(--value(number, [number]) * 1px))",
      ...diagonalLinesStyles,
    },
    "@utility ninaero-flipnote": {
      "--ninaero-flipnote-step": "8px",
      ...flipnoteStyles,
    },
    "@utility ninaero-flipnote-*": {
      "--ninaero-flipnote-step": "max(1px, calc(--value(number, [number]) * 1px))",
      ...flipnoteStyles,
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
        "--ninaero-material-shadow": "initial",
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
        "@apply font-sans type-body antialiased": {},
        "font-family": "var(--font-sans)",
        "font-variation-settings": `"ROND" ${sansFont.roundness}`,
      },
    },
    "@layer utilities": {
      [focusTargets]: {
        outline: "1px solid var(--ring)",
        "outline-offset": "2px",
        "--tw-ring-shadow": "0 0 #0000",
        "--tw-ring-offset-shadow": "0 0 #0000",
        "box-shadow": focusShadow,
      },
      "@media (forced-colors: active)": {
        [focusTargets]: {
          outline: "2px solid Highlight",
          "outline-offset": "3px",
          "box-shadow": "none",
          filter: "none",
        },
      },
      "@media (prefers-reduced-motion: reduce)": {
        [focusTargets]: { transition: "none" },
      },
    },
    "@layer components": withMaterialShadows({
      [focusFrames]: { position: "relative" },
      ".shadow-flat, .shadow-control, .shadow-floating, .shadow-dialog, .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl, .shadow-2xl":
        elevationVariables,
      ".bg-background > *": shadowSurface("var(--background)"),
      ".bg-card > *, [data-slot=card] > *": shadowSurface("var(--card)"),
      ".bg-muted > *": shadowSurface("var(--muted)"),
      ".bg-primary > *": shadowSurface("var(--primary)"),
      ".bg-secondary > *": shadowSurface("var(--secondary)"),
      ".bg-accent > *": shadowSurface("var(--accent)"),
      ".bg-destructive > *": shadowSurface("var(--destructive)"),
      ".bg-foreground > *": shadowSurface("var(--foreground)"),
      ".bg-sidebar > *, [data-slot=sidebar-inner] > *, [data-slot=sidebar-wrapper]:has([data-variant=inset]) > *":
        shadowSurface("var(--sidebar)"),
      ".bg-popover > *": shadowSurface("var(--popover)"),
      ".ninaero-shadow-surface": {
        "--shadow-color": shadowColorChannels("var(--shadow-surface)"),
        ...elevationVariables,
      },
      ".ninaero-surface-paper": shadowSurface("var(--paper-fill)"),
      // Popover, Select, Combobox, and DropdownMenu share this receiving surface.
      ".ninaero-popover": {
        ...elevationVariables,
        "border-radius": "var(--radius-xl)",
        "corner-shape": "round",
        border: "1px solid var(--border)",
        color: "var(--popover-foreground)",
        "background-color": "var(--popover)",
        "box-shadow": "inset 0 1px 0 var(--button-highlight), var(--shadow-floating)",
      },
      ".ninaero-popover > *": shadowSurface("var(--popover)"),
      "@media (forced-colors: active)": {
        ...glassMarkForcedColors,
        ".ninaero-popover": {
          "border-color": "CanvasText",
          "background-color": "Canvas",
          "background-image": "none",
          color: "CanvasText",
          "box-shadow": "none",
        },
      },
    }),
  },
};
