import { accentPresets, accentRules, accentSemanticTokens, defaultAccent } from "./accents.mjs";
import { createGlassGradientTokens, withGlassGradientVariables } from "./glass-materials.mjs";
import { syntaxThemeVariants } from "./hooks/syntax-themes.mjs";

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

export const glassMarkForcedColors = {
  ".ninaero-mark-face": { fill: "none", stroke: "CanvasText" },
  ".ninaero-mark-highlight": { stroke: "CanvasText" },
};

const buttonPressSelector =
  ".ninaero-button:active:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-haspopup]):not(.ninaero-button--link):not(.ninaero-button--ghost:not([data-slot=code-block-copy-button]))";
const codeCopyButtonSelector =
  ".ninaero-button--ghost[data-slot=code-block-copy-button]:not(:disabled):not([data-disabled]):not([aria-disabled=true])";
const raisedButtonSelector =
  ":is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive)";
const raisedButtonGroupSelector = [
  ".ninaero-button-group",
  `:has(> ${raisedButtonSelector}:not(:disabled):not([data-disabled]):not([aria-disabled=true]))`,
  `:not(:has(> :not(${raisedButtonSelector}, [data-slot=button-group-separator])))`,
].join("");
const segmentedTabSelector =
  ".ninaero-tabs-list[data-variant=default] > .ninaero-tabs-trigger:where(:not(:disabled):not([data-disabled]):not([aria-disabled=true]))";
// Select options keep focus inside their scroll-clipped list.
const selectItemFocus = ".ninaero-select-item:is(:focus-visible, [data-highlighted])";
const enabledFocus =
  ":not(:disabled):not([data-disabled]:not([data-disabled=false])):not([aria-disabled=true])";
const focusable = `:focus-visible${enabledFocus}:not(.ninaero-select-item):not(.ninaero-dropdown-menu-item):not(.ninaero-dropdown-menu-content):not([data-slot=input-group-control]):not([data-slot=input-otp]):not([data-slot=slider-thumb] input):not([data-slot=combobox-chips] input):not([data-slot=questionnaire-choice] input)`;
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
  "[data-slot=combobox-item][data-highlighted]",
  "[data-slot=command]:focus-within [data-slot=command-item][data-selected=true]",
]
  .map((selector) => `${selector}${enabledFocus}`)
  .join(", ");
const focusTargets = `${focusable}, ${proxyFocus}`;
const gradientFocus = `:is(${focusFrames}):is(${focusTargets}):not([aria-invalid=true]):not([data-invalid]):not(:has([aria-invalid=true]))`;
const fieldFocus = `:is(.ninaero-input, .ninaero-textarea):focus-visible${enabledFocus}:not([aria-invalid=true]), .ninaero-input-group:has(> [data-slot=input-group-control]:focus-visible${enabledFocus}):not([aria-invalid=true]):not(:has([aria-invalid=true]))`;
const focusGlowShadow =
  "0 0 0 4px color-mix(in oklab, var(--ring) 12%, transparent), 0 0 14px 2px color-mix(in oklab, var(--ring) 18%, transparent)";
const focusShadow = `var(--ninaero-material-shadow, var(--tw-shadow, 0 0 #0000)), ${focusGlowShadow}`;
const focusEdge = {
  content: '""',
  position: "absolute",
  inset: "-1px",
  "box-sizing": "border-box",
  "z-index": "1",
  "pointer-events": "none",
  "border-radius": "inherit",
  "corner-shape": "inherit",
  border: "1px solid transparent",
  background: "linear-gradient(180deg, var(--ninaero-focus-edge-top), var(--ring)) border-box",
  mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
  "mask-composite": "exclude",
};

// Preserve each material and pressed-state shadow when adding the shared focus halo.
function withMaterialShadows(rules) {
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
const elevationVariables = Object.fromEntries(
  Object.entries({
    ...elevations,
    sm: elevations.control,
    md: elevations.floating,
    lg: elevations.floating,
    xl: elevations.dialog,
    "2xl": elevations.dialog,
  }).map(([level, shadow]) => [`--shadow-${level}`, shadow]),
);

function shadowColorChannels(surface) {
  return `from color-mix(in oklab, ${surface} 40%, black) h s l`;
}

function shadowSurface(surface) {
  return {
    "--shadow-surface": surface,
    "--shadow-color": shadowColorChannels("var(--shadow-surface)"),
    ...elevationVariables,
  };
}

function compositedSurface(fill, opacity, underlay = "var(--shadow-surface)") {
  return `color-mix(in srgb, ${fill} ${opacity}%, ${underlay})`;
}

const bubbleSurfaceFills = {
  default: ["var(--primary)", compositedSurface("var(--primary)", 80)],
  secondary: ["var(--secondary)", "color-mix(in oklch, var(--secondary), var(--foreground) 5%)"],
  muted: ["var(--muted)", "color-mix(in oklch, var(--muted), var(--foreground) 5%)"],
  tinted: [
    "oklch(from var(--primary) 0.93 calc(c * 0.4) h)",
    "oklch(from var(--primary) 0.88 calc(c * 0.5) h)",
    "oklch(from var(--primary) 0.3 calc(c * 0.4) h)",
    "oklch(from var(--primary) 0.35 calc(c * 0.5) h)",
  ],
  outline: ["var(--background)", "var(--muted)", undefined, compositedSurface("var(--input)", 30)],
  ghost: [
    "var(--shadow-surface)",
    "var(--muted)",
    undefined,
    compositedSurface("var(--muted)", 50),
  ],
  destructive: [
    compositedSurface("var(--destructive)", 10),
    compositedSurface("var(--destructive)", 20),
    compositedSurface("var(--destructive)", 20),
    compositedSurface("var(--destructive)", 30),
  ],
};
const bubbleShadowContexts = Object.fromEntries(
  Object.entries(bubbleSurfaceFills).flatMap(([variant, [fill, hover, darkFill, darkHover]]) => {
    const content = `[data-slot=bubble][data-variant=${variant}] > [data-slot=bubble-content]`;
    const surface = (color) => ({ "--ninaero-bubble-shadow-surface": color });
    return [
      [content, surface(fill)],
      [`${content}:is(button,a):hover`, surface(hover)],
      ...(darkFill ? [[`.dark ${content}`, surface(darkFill)]] : []),
      ...(darkHover ? [[`.dark ${content}:is(button,a):hover`, surface(darkHover)]] : []),
    ];
  }),
);

const menuItemCastShadow = [
  "0 1px 2px hsl(var(--shadow-color) / 0.06)",
  "0 2px 4px hsl(var(--shadow-color) / 0.03)",
].join(", ");
const controlCastShadow = "var(--button-cast-shadow, var(--shadow-control))";

function recessShadow(fill) {
  return [
    `inset 0 2px 6px color-mix(in oklab, ${fill}, black var(--recess-shade-weight))`,
    `inset 0 -1px 2px color-mix(in oklab, ${fill}, white var(--recess-highlight-weight))`,
  ].join(", ");
}

const toggleSelectedFill =
  "color-mix(in oklab, var(--button-paper-pressed), var(--button-paper-fill) 50%)";

function toggleRecessShadow(fill) {
  return [
    `inset 0 1px 1px color-mix(in oklab, ${fill}, black calc(var(--recess-shade-weight) * 1.25))`,
    `inset 0 3px 4px color-mix(in oklab, ${fill}, black calc(var(--recess-shade-weight) * 0.75))`,
    `inset 0 -1px 0 color-mix(in oklab, ${fill}, white var(--recess-highlight-weight))`,
  ].join(", ");
}

const recessedTrackMaterial = {
  border: "1px solid var(--input-edge)",
  "background-color": "var(--input-fill)",
  "box-shadow": recessShadow("var(--input-fill)"),
};
const selectedTrackMaterial = {
  "background-color": "var(--button-primary-fill)",
  "background-image":
    "linear-gradient(180deg in oklab, var(--glass-mark-face-0), var(--glass-mark-face-50) 48%, var(--glass-mark-face-100))",
  "box-shadow":
    "inset 0 1px 0 color-mix(in oklab, var(--glass-mark-face-0), white 25%), inset 0 -1px 0 color-mix(in oklab, var(--glass-mark-face-100), black 8%)",
};
const paperThumbMaterial = {
  "border-color": "var(--button-paper-edge)",
  "background-color": "var(--button-paper-fill)",
  "background-image":
    "linear-gradient(180deg in oklab, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
  "box-shadow": "inset 0 -1px 0 var(--button-paper-shade), var(--shadow-control)",
};
const pressedThumbMaterial = {
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
    destructive: "#b02f1e",
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
    "button-destructive-fill": "#ffd9cd",
    "button-destructive-hover": "#ffcab9",
    "button-destructive-pressed": "#f5b3a0",
    "button-destructive-ink": "#7e291b",
    "button-destructive-edge": "#c25038",
    "button-destructive-highlight": "#ffffff66",
    "button-destructive-shade": "#5a1b0a14",
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
    destructive: "#ff9b83",
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
    "button-destructive-fill": "#ffa088",
    "button-destructive-hover": "#ffb39d",
    "button-destructive-pressed": "#ed8b73",
    "button-destructive-ink": "#35160f",
    "button-destructive-edge": "#ffc5b5",
    "button-destructive-highlight": "#ffffff1a",
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
      "--ninaero-overlay-pattern":
        "linear-gradient(45deg, black 12.5%, transparent 0 50%, black 0 62.5%, transparent 0)",
      "--ninaero-overlay-tile": "4px",
      "--ninaero-overlay-coverage": "0.25",
    },
    "@utility ninaero-overlay-flipnote": {
      "--ninaero-overlay-pattern": "var(--overlay-flipnote-mask)",
      "--ninaero-overlay-tile": "8px",
      "--ninaero-overlay-coverage": "0.125",
    },
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
        "--ninaero-focus-outline": "initial",
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
        "--ninaero-focus-edge-top": "color-mix(in oklab, var(--ring), white 15%)",
        outline: "1px solid var(--ninaero-focus-outline, var(--ring))",
        "outline-offset": "3px",
        "--tw-ring-shadow": "0 0 #0000",
        "--tw-ring-offset-shadow": "0 0 #0000",
        "box-shadow": focusShadow,
      },
      "@media (forced-colors: none)": {
        "@supports (mask-composite: exclude)": {
          [gradientFocus]: { "--ninaero-focus-outline": "transparent" },
          [`${gradientFocus}::before`]: focusEdge,
        },
        [fieldFocus]: {
          "border-color": "transparent",
          "--ninaero-focus-outline": "transparent",
          "background-image":
            "linear-gradient(var(--input-fill), var(--input-fill)), linear-gradient(180deg, var(--ninaero-focus-edge-top), var(--ring))",
          "background-origin": "border-box",
          "background-clip": "padding-box, border-box",
        },
      },
      "@media (forced-colors: active)": {
        ".ninaero-tooltip [data-slot=kbd]": {
          "background-color": "Canvas",
          color: "CanvasText",
          border: "1px solid CanvasText",
        },
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
      // Rebind recipes at each caster so inherited receiving-background colors stay effective.
      ".ninaero-button, .ninaero-button-group, .ninaero-dialog, .ninaero-popover, .ninaero-tooltip, .ninaero-slider-thumb, .ninaero-switch-thumb, .ninaero-dropdown-menu-item, .shadow-flat, .shadow-control, .shadow-floating, .shadow-dialog, .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl, .shadow-2xl":
        elevationVariables,
      // A panel casts onto its parent; only its children receive the panel's color context.
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
      ".bg-popover > *, .ninaero-popover > *, .ninaero-dialog > *": shadowSurface("var(--popover)"),
      ".ninaero-tooltip > *": shadowSurface("var(--foreground)"),
      "[data-slot=card-footer] > *": shadowSurface(
        "color-mix(in srgb, var(--muted) 50%, var(--card))",
      ),
      ...bubbleShadowContexts,
      "[data-slot=bubble] > [data-slot=bubble-content] > *": shadowSurface(
        "var(--ninaero-bubble-shadow-surface)",
      ),
      // Snapshot the underlay on the painter before rebinding its children to avoid self-reference cycles.
      "[data-slot=table-footer]": {
        "--ninaero-table-footer-shadow-surface": compositedSurface("var(--muted)", 50),
      },
      "[data-slot=table-footer] > *": shadowSurface("var(--ninaero-table-footer-shadow-surface)"),
      "[data-slot=table-row]": {
        "--ninaero-table-row-shadow-surface": "var(--shadow-surface)",
      },
      "[data-slot=table-row]:has([aria-expanded=true])": {
        "--ninaero-table-row-shadow-surface": compositedSurface("var(--muted)", 50),
      },
      "[data-slot=table-row][data-state=selected]": {
        "--ninaero-table-row-shadow-surface": "var(--muted)",
      },
      "[data-slot=table-row] > *": shadowSurface("var(--ninaero-table-row-shadow-surface)"),
      "[data-slot=calendar]": {
        "--ninaero-calendar-underlay": "var(--shadow-surface)",
      },
      ":is([data-slot=card-content], [data-slot=popover-content]) [data-slot=calendar] > *":
        shadowSurface("var(--ninaero-calendar-underlay)"),
      ".ninaero-switch > .ninaero-switch-thumb": shadowSurface("var(--input-fill)"),
      ".ninaero-switch[data-checked] > .ninaero-switch-thumb": shadowSurface(
        "var(--glass-mark-face-50)",
      ),
      ".ninaero-tabs-list[data-variant=default] > *": shadowSurface("var(--tabs-track-fill)"),
      ".ninaero-shadow-surface": {
        "--shadow-color": shadowColorChannels("var(--shadow-surface)"),
        ...elevationVariables,
      },
      ".ninaero-surface-paper": shadowSurface("var(--paper-fill)"),
      ".ninaero-code-block": {
        "--ninaero-code-header-surface": "color-mix(in oklab, var(--muted) 30%, var(--card))",
        "--ninaero-code-highlight": "color-mix(in oklab, var(--card), white 85%)",
        "--ninaero-code-shade": "color-mix(in oklab, var(--card), black 4%)",
        "box-shadow":
          "inset 0 1px 0 var(--ninaero-code-highlight), inset 0 -1px 0 var(--ninaero-code-shade)",
      },
      ".dark .ninaero-code-block": {
        "--ninaero-code-highlight": "color-mix(in oklab, var(--card), white 8%)",
        "--ninaero-code-shade": "color-mix(in oklab, var(--card), black 12%)",
      },
      ".ninaero-code-block > [data-slot=code-block-header]": {
        "background-color": "var(--ninaero-code-header-surface)",
        "box-shadow": "inset 0 1px 0 var(--ninaero-code-highlight)",
      },
      ".ninaero-code-block > [data-slot=code-block-header] > *": shadowSurface(
        "var(--ninaero-code-header-surface)",
      ),
      ".ninaero-code-block-content": {
        "--ninaero-code-rule": "color-mix(in oklab, var(--foreground) 6%, transparent)",
      },
      ".dark .ninaero-code-block-content": {
        "--ninaero-code-rule": "color-mix(in oklab, var(--foreground) 4%, transparent)",
      },
      ".ninaero-code-block-content > [data-slot=code-block-code]": {
        "grid-template-columns": "minmax(0, 1fr)",
      },
      ".ninaero-code-block-content[data-numbered] > [data-slot=code-block-code]": {
        "grid-template-columns": "auto minmax(0, 1fr)",
      },
      ".ninaero-code-block-content [data-slot=code-block-line-marker]": {
        display: "none",
      },
      ".ninaero-code-block-content > [data-slot=code-block-code]:has(> [data-variant=added], > [data-variant=removed])":
        {
          "grid-template-columns": "1ch minmax(0, 1fr)",
          "[data-slot=code-block-line-marker]": { display: "block" },
        },
      ".ninaero-code-block-content[data-numbered] > [data-slot=code-block-code]:has(> [data-variant=added], > [data-variant=removed])":
        {
          "grid-template-columns": "auto 1ch minmax(0, 1fr)",
        },
      ".ninaero-input, .ninaero-textarea, .ninaero-select-trigger, .ninaero-input-group": {
        "--input-corner": "0.75rem",
        "border-radius": "var(--input-corner)",
        "corner-shape": "round",
        border: "1px solid var(--input-edge)",
        color: "var(--card-foreground)",
        "background-color": "var(--input-fill)",
        "box-shadow": recessShadow("var(--input-fill)"),
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
          "outline-color": "transparent",
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
      ":is(.ninaero-checkbox, .ninaero-radio-group-item)": {
        ...recessedTrackMaterial,
        "--button-recess-fill":
          "color-mix(in oklab, var(--input-fill), black var(--recess-shade-weight))",
        "corner-shape": "round",
        padding: "0",
        color: "var(--card-foreground)",
        cursor: "pointer",
        outline: "none",
        transition:
          "background-color 80ms ease-out, border-color 80ms ease-out, box-shadow 80ms ease-out",
      },
      ":is(.ninaero-checkbox, .ninaero-radio-group-item):where([data-checked], [data-indeterminate])":
        {
          ...selectedTrackMaterial,
          "--button-recess-fill": "var(--button-primary-pressed)",
          "border-color": "var(--button-primary-edge)",
          color: "color-mix(in oklab, var(--primary-foreground), black 12%)",
        },
      "@media (forced-colors: none)": {
        [codeCopyButtonSelector]: {
          "--button-recess-fill": "var(--button-paper-pressed)",
        },
        [`${codeCopyButtonSelector}:active`]: {
          "background-color": "var(--button-recess-fill)",
        },
        ".ninaero-checkbox:where(:not([data-disabled])) [data-slot=checkbox-indicator] > svg": {
          filter: "drop-shadow(0 -0.5px 0 #ffffff66) drop-shadow(0 0.5px 0.25px #00000033)",
        },
      },
      ":is(.ninaero-checkbox, .ninaero-radio-group-item):where(:hover:not([data-disabled]):not([data-readonly])[data-unchecked]:not([data-indeterminate]))":
        {
          "border-color": "var(--neutral-input)",
        },
      ":is(.ninaero-checkbox, .ninaero-radio-group-item):where(:hover:not([data-disabled]):not([data-readonly])):where([data-checked], [data-indeterminate])":
        {
          "border-color": "var(--ring)",
        },
      ":is(.ninaero-checkbox, .ninaero-radio-group-item):where(:active:not([data-disabled]):not([data-readonly]))":
        {
          "background-image": "none",
          "background-color": "var(--button-recess-fill)",
          "box-shadow": recessShadow("var(--button-recess-fill)"),
        },
      ":is(.ninaero-checkbox, .ninaero-radio-group-item):where([aria-invalid=true], [data-invalid])":
        {
          "border-color": "var(--destructive)",
        },
      ":is(.ninaero-checkbox, .ninaero-radio-group-item):where([data-readonly])": {
        cursor: "default",
      },
      ":is(.ninaero-checkbox, .ninaero-radio-group-item):where([data-disabled])": {
        "background-color": "var(--input-disabled-fill)",
        "border-color": "var(--border)",
        color: "var(--muted-foreground)",
        "background-image": "none",
        "box-shadow": "none",
        cursor: "not-allowed",
      },
      ".ninaero-radio-group-dot": {
        ...shadowSurface("var(--glass-mark-face-50)"),
        "background-color": "currentColor",
      },
      ".ninaero-radio-group-item:where(:active:not([data-disabled]):not([data-readonly])) .ninaero-radio-group-dot":
        {
          "--shadow-surface": "var(--button-recess-fill)",
        },
      ":where(:root:not(.dark)) .ninaero-radio-group-dot": {
        border: "1px solid var(--button-paper-edge)",
        "background-color": "white",
        "background-image": "linear-gradient(180deg in oklab, white, #e6e6e6)",
        "box-shadow": "inset 0 1px 0 white, inset 0 -1px 0 #00000014, var(--shadow-control)",
      },
      ".ninaero-radio-group-item:where([data-disabled]) .ninaero-radio-group-dot": {
        "background-color": "currentColor",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-switch": {
        ...recessedTrackMaterial,
        "--switch-width": "2.25rem",
        "--switch-thumb-size": "1rem",
        "--switch-direction": "1",
        "inline-size": "var(--switch-width)",
        "block-size": "calc(var(--switch-thumb-size) + 4px)",
        padding: "1px",
        cursor: "pointer",
        outline: "none",
        transition: "background-color 80ms ease-out, border-color 80ms ease-out",
      },
      ".ninaero-switch[data-size=sm]": {
        "--switch-width": "1.75rem",
        "--switch-thumb-size": "0.75rem",
      },
      ".ninaero-switch[data-direction=rtl]": { "--switch-direction": "-1" },
      ".ninaero-switch:where([data-checked])": {
        ...selectedTrackMaterial,
        "border-color": "var(--button-primary-edge)",
      },
      ".ninaero-switch-thumb": {
        border: "1px solid",
        ...paperThumbMaterial,
        "inline-size": "var(--switch-thumb-size)",
        "block-size": "var(--switch-thumb-size)",
        "border-radius": "50%",
        transform: "translateX(0)",
        transition:
          "transform 140ms ease-out, background-color 80ms ease-out, box-shadow 80ms ease-out",
      },
      ".ninaero-switch-thumb:where([data-checked])": {
        transform:
          "translateX(calc((var(--switch-width) - var(--switch-thumb-size) - 4px) * var(--switch-direction)))",
      },
      ".ninaero-switch:where(:hover:not([data-disabled]):not([data-readonly])[data-unchecked])": {
        "border-color": "var(--neutral-input)",
      },
      ".ninaero-switch:where(:hover:not([data-disabled]):not([data-readonly])) .ninaero-switch-thumb":
        { "background-color": "var(--button-paper-hover)" },
      ".ninaero-switch:where(:active:not([data-disabled]):not([data-readonly])) .ninaero-switch-thumb":
        pressedThumbMaterial,
      ".ninaero-switch:where([aria-invalid=true], [data-invalid])": {
        "border-color": "var(--destructive)",
      },
      ".ninaero-switch:where([data-readonly])": { cursor: "default" },
      ".ninaero-switch:where([data-disabled])": {
        "border-color": "var(--border)",
        "background-color": "var(--input-disabled-fill)",
        "background-image": "none",
        "box-shadow": "none",
        cursor: "not-allowed",
      },
      ".ninaero-switch:where([data-disabled][data-checked])": {
        "background-color": "var(--muted-foreground)",
      },
      ".ninaero-switch:where([data-disabled]) .ninaero-switch-thumb": {
        "border-color": "var(--border)",
        "background-color": "var(--muted)",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-progress-circular-edge": {
        stroke: "var(--input-edge)",
      },
      ".ninaero-progress-circular-track": {
        stroke: "var(--input-fill)",
      },
      ".ninaero-progress-track-shade": {
        "flood-color": "color-mix(in oklab, var(--input-fill), black var(--recess-shade-weight))",
      },
      ".ninaero-progress-track-highlight": {
        "flood-color":
          "color-mix(in oklab, var(--input-fill), white var(--recess-highlight-weight))",
      },
      ".ninaero-progress-circular-rim": {
        stroke: "color-mix(in oklab, var(--button-primary-edge) 55%, var(--glass-mark-face-50))",
      },
      ".ninaero-progress-indicator-highlight": {
        "stop-color": "var(--glass-mark-face-0)",
      },
      ".ninaero-progress-indicator-middle": {
        "stop-color": "var(--glass-mark-face-50)",
      },
      ".ninaero-progress-indicator-fill": {
        "stop-color": "var(--glass-mark-face-100)",
      },
      "@keyframes ninaero-progress-circular": {
        from: { "stroke-dashoffset": "100" },
        to: { "stroke-dashoffset": "0" },
      },
      ".ninaero-progress-circular-indicator[data-indeterminate]": {
        animation: "ninaero-progress-circular 1s linear infinite",
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      },
      ".ninaero-slider-control": {
        "min-block-size": "2rem",
      },
      ".ninaero-slider-control[data-orientation=vertical]": {
        "min-inline-size": "2rem",
      },
      ".ninaero-slider-track": recessedTrackMaterial,
      ".ninaero-slider-range": selectedTrackMaterial,
      ".ninaero-slider-thumb": {
        "--slider-grip-ink": "color-mix(in oklab, var(--button-paper-fill), black 30%)",
        "--slider-grip-highlight": "color-mix(in oklab, var(--button-paper-fill), white 30%)",
        "corner-shape": "squircle",
        cursor: "grab",
        ...paperThumbMaterial,
        outline: "none",
        transition:
          "border-color 80ms ease-out, background-color 80ms ease-out, box-shadow 80ms ease-out",
      },
      ".dark .ninaero-slider-thumb": {
        "--slider-grip-ink": "var(--button-paper-edge)",
      },
      ".ninaero-slider-thumb::before": {
        content: '""',
        "background-image":
          "repeating-linear-gradient(90deg, var(--slider-grip-ink) 0 1px, var(--slider-grip-highlight) 1px 2px, transparent 2px 4px)",
        "mask-image":
          "linear-gradient(180deg, transparent, black 0.5px, black calc(100% - 0.5px), transparent)",
        opacity: "1",
        "pointer-events": "none",
      },
      ".dark .ninaero-slider-thumb::before": {
        "background-color": "var(--slider-grip-ink)",
        "background-image": "none",
        "mask-image":
          "repeating-linear-gradient(90deg, black 0 1px, transparent 1px 4px), linear-gradient(180deg, transparent, black 0.5px, black calc(100% - 0.5px), transparent)",
        "mask-composite": "intersect",
      },
      ".ninaero-slider:where(:not([data-disabled]):not([aria-disabled=true]):not([data-invalid]):not([aria-invalid=true])) .ninaero-slider-thumb:where(:hover:not(:active):not([data-dragging]))":
        {
          "background-color": "var(--button-paper-hover)",
        },
      ".ninaero-slider-thumb:where(:active, [data-dragging]):where(:focus-within)": {
        cursor: "grabbing",
        ...pressedThumbMaterial,
      },
      ".ninaero-slider-thumb:where(:focus-visible, :has(:focus-visible))": {
        outline: "1px solid var(--ring)",
        "outline-offset": "3px",
      },
      ".ninaero-slider:where([data-variant=simple])": {
        "--slider-simple-ink": "var(--foreground)",
        "--ring": "var(--foreground)",
      },
      ".ninaero-slider:where([data-variant=simple]) .ninaero-slider-track": {
        border: "none",
        "background-color": "color-mix(in oklab, var(--foreground) 20%, var(--background))",
        "box-shadow": "none",
      },
      ".ninaero-slider:where([data-variant=simple]) .ninaero-slider-range": {
        "background-color": "var(--slider-simple-ink)",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-slider:where([data-variant=simple]) .ninaero-slider-thumb": {
        "corner-shape": "round",
        "border-color": "var(--slider-simple-ink)",
        "background-color": "var(--slider-simple-ink)",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-slider:where([data-variant=simple]) .ninaero-slider-thumb::before": {
        display: "none",
      },
      ".ninaero-slider:where([data-variant=simple]):where(:not([data-disabled]):not([aria-disabled=true])) .ninaero-slider-thumb:where(:hover, :active, [data-dragging])":
        {
          opacity: "0.75",
        },
      ".ninaero-slider:where([data-variant=simple]):where([data-invalid], [aria-invalid=true])": {
        "--slider-simple-ink": "var(--destructive)",
      },
      ".ninaero-slider:where([data-invalid], [aria-invalid=true]) .ninaero-slider-thumb": {
        "--slider-grip-ink": "var(--destructive)",
      },
      ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-track": {
        "border-color": "var(--border)",
        "box-shadow": "none",
      },
      ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-range": {
        "background-color": "var(--muted-foreground)",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-thumb": {
        cursor: "not-allowed",
        "border-color": "var(--border)",
        "background-color": "var(--muted)",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-thumb::before":
        {
          display: "none",
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
      ".ninaero-popover-content, .ninaero-dropdown-menu-content": {
        "border-color": "color-mix(in oklab, var(--foreground) 18%, var(--popover))",
        "background-image":
          "linear-gradient(180deg in oklab, var(--popover), color-mix(in oklab, var(--popover), var(--dialog-fill-shade) 50%))",
        "box-shadow": `inset 0 1px 0 var(--dialog-highlight), inset 0 -1px 2px var(--dialog-shade), var(--shadow-floating)`,
        "overflow-wrap": "anywhere",
        "transform-origin": "var(--transform-origin)",
        opacity: "1",
        transform: "scale(1)",
        transition: "opacity 120ms ease-out, transform 220ms cubic-bezier(0.22, 1.4, 0.35, 1)",
      },
      ".ninaero-popover-content[data-starting-style], .ninaero-dropdown-menu-content[data-starting-style]":
        {
          opacity: "0",
          transform: "scale(0.94)",
        },
      ".ninaero-popover-content[data-ending-style], .ninaero-dropdown-menu-content[data-ending-style]":
        {
          opacity: "0",
          transform: "scale(0.98)",
          transition: "opacity 120ms ease-in, transform 120ms ease-in",
        },
      ".ninaero-popover-content[data-instant], .ninaero-dropdown-menu-content[data-instant]": {
        transition: "none",
      },
      ".ninaero-dropdown-menu-content": {
        // Keep keyboard-scrolled highlights and their cast shadows clear of the clipping edge.
        "scroll-padding-block": "0.5rem",
        transition: "opacity 100ms ease-out, transform 180ms cubic-bezier(0.22, 1.2, 0.35, 1)",
      },
      ".ninaero-dropdown-menu-content[data-starting-style]": {
        transform: "scale(0.96)",
      },
      ".ninaero-dropdown-menu-item": {
        "corner-shape": "round",
        outline: "2px solid transparent",
        "outline-offset": "-3px",
        transition: "background-color 80ms ease-out",
        "--ninaero-menu-item-fill": "var(--accent)",
      },
      ".ninaero-dropdown-menu-item:where([data-highlighted], [data-popup-open]):not([data-disabled])":
        {
          "background-color": "var(--ninaero-menu-item-fill)",
          "box-shadow": `inset 0 1px 0 color-mix(in oklab, var(--ninaero-menu-item-fill), white var(--recess-highlight-weight)), ${menuItemCastShadow}`,
          "z-index": "1",
          color: "var(--accent-foreground)",
        },
      ".ninaero-dropdown-menu-item[data-variant=destructive]": {
        color: "var(--destructive)",
        "--ninaero-menu-item-fill": "color-mix(in oklab, var(--destructive) 10%, var(--popover))",
      },
      ".ninaero-dropdown-menu-item[data-variant=destructive]:where([data-highlighted], :active):not([data-disabled])":
        {
          "background-color": "var(--ninaero-menu-item-fill)",
          color: "var(--destructive)",
        },
      ".ninaero-dropdown-menu-item:focus-visible": {
        "outline-color": "var(--ring)",
      },
      ".ninaero-dropdown-menu-item[data-disabled]": {
        color: "var(--muted-foreground)",
      },
      ".ninaero-dropdown-menu-shortcut": {
        color: "var(--muted-foreground)",
      },
      ".ninaero-dropdown-menu-item:is([data-highlighted], [data-popup-open], [data-disabled]) .ninaero-dropdown-menu-shortcut":
        {
          color: "inherit",
        },
      ".ninaero-tooltip": {
        position: "relative",
        isolation: "isolate",
        "max-width": "min(20rem, var(--available-width))",
        "border-radius": "1rem",
        "corner-shape": "round",
        border: "1px solid color-mix(in oklab, var(--foreground), var(--background) 22%)",
        "background-color": "var(--foreground)",
        "background-image":
          "linear-gradient(180deg in oklab, color-mix(in oklab, var(--foreground), white 12%), color-mix(in oklab, var(--foreground), black 12%))",
        color: "var(--background)",
        "box-shadow":
          "inset 0 1px 0 color-mix(in oklab, var(--foreground), white 18%), inset 0 -1px 2px color-mix(in oklab, var(--foreground), black 20%), var(--shadow-floating)",
        "overflow-wrap": "anywhere",
        "transform-origin": "var(--transform-origin)",
        opacity: "1",
        transform: "scale(1)",
        transition: "opacity 120ms ease-out, transform 180ms cubic-bezier(0.22, 1.4, 0.35, 1)",
      },
      ".ninaero-tooltip::before": {
        content: '""',
        position: "absolute",
        inset: "0",
        "z-index": "-1",
        "pointer-events": "none",
        "border-radius": "inherit",
        "corner-shape": "inherit",
        "--paper-fill": "transparent",
        "--ninaero-pattern-ink": "var(--tooltip-scanline-ink)",
      },
      ".ninaero-tooltip[data-starting-style]": {
        opacity: "0",
        transform: "scale(0.96)",
      },
      ".ninaero-tooltip[data-ending-style]": {
        opacity: "0",
        transform: "scale(0.98)",
        transition: "opacity 120ms ease-in, transform 120ms ease-in",
      },
      ".ninaero-tooltip[data-instant]": {
        transition: "none",
      },
      ".ninaero-tooltip[data-instant][data-starting-style]": {
        opacity: "1",
        transform: "none",
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
        transition:
          "background-color 80ms ease-out, border-color 80ms ease-out, outline-color 80ms ease-out, color 80ms ease-out",
      },
      ".ninaero-select-item[data-selected]": {
        "border-color": "var(--ring)",
        "background-color": "var(--accent)",
        color: "var(--accent-foreground)",
      },
      [selectItemFocus]: {
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
        "box-shadow": recessShadow("var(--tabs-track-fill)"),
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
        "text-shadow": "var(--control-label-text-shadow)",
        "background-image":
          "radial-gradient(ellipse at 50% -45% in oklab, var(--tabs-active-highlight), transparent 75%), linear-gradient(180deg in oklab, var(--tabs-active-top), var(--tabs-active-fill) 48%, var(--tabs-active-bottom))",
        "box-shadow":
          "inset 0 1px 0 var(--tabs-active-highlight), inset 0 -1px 0 var(--tabs-active-bottom), 0 1px 2px hsl(var(--shadow-color) / 0.2)",
      },
      [`${segmentedTabSelector}:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])`]:
        {
          "background-color": "var(--tabs-hover-fill)",
          "background-image": "none",
          "box-shadow": recessShadow("var(--tabs-hover-fill)"),
          "text-shadow": "none",
        },
      ".ninaero-tabs-trigger:disabled, .ninaero-tabs-trigger[data-disabled], .ninaero-tabs-trigger[aria-disabled=true]":
        {
          color: "var(--muted-foreground)",
          "background-image": "none",
          "box-shadow": "none",
          "text-shadow": "none",
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
        "--tabs-marker-fill": "var(--button-primary-edge)",
        content: '""',
        position: "absolute",
        "inset-inline": "0.75rem",
        "inset-block-end": "0",
        height: "4px",
        "box-sizing": "border-box",
        "border-radius": "2px",
        border: "0",
        "background-color": "var(--tabs-marker-fill)",
        "background-image":
          "linear-gradient(180deg in oklab, color-mix(in oklab, var(--tabs-marker-fill), white 10%), var(--tabs-marker-fill))",
        "box-shadow": "0 1px 2px hsl(var(--shadow-color) / 0.16)",
        "pointer-events": "none",
        opacity: "0",
      },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger[data-active]::after": {
        opacity: "1",
      },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger:where(:active:not(:disabled):not([data-disabled]):not([aria-disabled=true]))::after":
        {
          "background-color": "var(--button-primary-edge)",
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
          "inset-inline-start": "auto",
          "inset-inline-end": "0",
          "inset-block": "4px",
          width: "4px",
          height: "auto",
        },
      ".ninaero-toggle": {
        "--toggle-corner": "var(--radius-md)",
        "--button-recess-fill": "var(--button-paper-pressed)",
        "border-radius": "var(--toggle-corner)",
        "corner-shape": "round",
        border: "1px solid transparent",
        color: "var(--button-paper-ink)",
        "background-color": "transparent",
        "background-image": "none",
        outline: "2px solid transparent",
        "outline-offset": "3px",
        transition:
          "background-color 80ms ease-out, border-color 80ms ease-out, box-shadow 80ms ease-out",
      },
      ".ninaero-toggle--outline": {
        ...paperThumbMaterial,
        "box-shadow": "inset 0 -1px 0 var(--button-paper-shade)",
        "text-shadow": "var(--control-label-text-shadow)",
      },
      ".ninaero-toggle[aria-pressed=true]": {
        ...pressedThumbMaterial,
        "background-color": toggleSelectedFill,
        "box-shadow": toggleRecessShadow(toggleSelectedFill),
        "--button-recess-fill": `color-mix(in oklab, ${toggleSelectedFill}, black var(--recess-shade-weight))`,
        color: "var(--button-paper-ink)",
        "text-shadow": "none",
        "border-color": "var(--input-edge)",
      },
      ".ninaero-toggle:focus-visible": {
        "outline-color": "transparent",
      },
      ".ninaero-toggle[aria-invalid=true]": {
        "border-color": "var(--button-destructive-edge)",
      },
      ".ninaero-toggle:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])": {
        "background-color": "var(--button-recess-fill)",
        "background-image": "none",
        "box-shadow": toggleRecessShadow("var(--button-recess-fill)"),
        "text-shadow": "none",
      },
      ".ninaero-toggle:disabled, .ninaero-toggle[data-disabled], .ninaero-toggle[aria-disabled=true]":
        {
          "background-image": "none",
          "box-shadow": "none",
          "text-shadow": "none",
          opacity: "0.5",
        },
      ".ninaero-button": {
        "--button-corner": "1rem",
        "--button-press-shift": "1px",
        "--button-recess-fill": "var(--background)",
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
        "text-shadow": "0 0.5px 0 color-mix(in oklab, var(--button-primary-fill), white 60%)",
        "background-color": "var(--button-primary-fill)",
        "background-image":
          "linear-gradient(180deg in oklab, var(--button-highlight), transparent 65%)",
        "border-color": "var(--button-primary-edge)",
        "box-shadow": `inset 0 1px 0 var(--button-highlight), ${controlCastShadow}`,
      },
      ".ninaero-button--secondary, .ninaero-button--outline": {
        "--button-recess-fill": "var(--button-paper-pressed)",
        color: "var(--button-paper-ink)",
        "text-shadow": "var(--button-paper-text-shadow)",
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
        "text-shadow": "0 0.5px 0 color-mix(in oklab, var(--button-destructive-fill), white 60%)",
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
        "outline-color": "transparent",
      },
      ".ninaero-button[aria-invalid=true]": {
        "border-color": "var(--button-destructive-edge)",
      },
      [buttonPressSelector]: {
        transform: "translateY(var(--button-press-shift))",
        "text-shadow": "none",
        "box-shadow": recessShadow("var(--button-recess-fill)"),
      },
      ".ninaero-button:disabled, .ninaero-button[data-disabled], .ninaero-button[aria-disabled=true]":
        {
          "box-shadow": "none",
          "text-shadow": "none",
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
        "[data-slot=table-row]:hover:not([data-state=selected])": {
          "--ninaero-table-row-shadow-surface": compositedSurface("var(--muted)", 50),
        },
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
        ".ninaero-toggle:where(:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-invalid=true]))[aria-pressed=true]":
          {
            "border-color": "var(--neutral-input)",
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
      "@media (hover: hover) and (forced-colors: none)": {
        [`${codeCopyButtonSelector}:hover`]: {
          "box-shadow": `inset 0 1px 0 var(--button-paper-highlight), inset 0 -1px 0 var(--button-paper-shade), ${controlCastShadow}`,
          transform: "translateY(calc(-1 * var(--button-press-shift)))",
        },
      },
      "@media (prefers-reduced-motion: reduce)": {
        ".ninaero-dropdown-menu-item": { transition: "none" },
        ".ninaero-select-item": { transition: "none" },
        ":is(.ninaero-checkbox, .ninaero-radio-group-item)": { transition: "none" },
        ".ninaero-switch, .ninaero-switch-thumb": { transition: "none" },
        ".ninaero-slider-thumb": { transition: "none" },
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
        ".ninaero-tooltip, .ninaero-tooltip[data-starting-style], .ninaero-tooltip[data-ending-style]":
          {
            transition: "none",
            transform: "none",
            opacity: "1",
          },
        ".ninaero-popover-content, .ninaero-popover-content[data-starting-style], .ninaero-popover-content[data-ending-style], .ninaero-dropdown-menu-content, .ninaero-dropdown-menu-content[data-starting-style], .ninaero-dropdown-menu-content[data-ending-style]":
          {
            transition: "none",
            transform: "none",
            opacity: "1",
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
        ...glassMarkForcedColors,
        ".ninaero-progress-circular-edge": { display: "none" },
        ".ninaero-progress-circular-track": { stroke: "GrayText", filter: "none" },
        ".ninaero-progress-circular-indicator > path": { stroke: "Highlight" },
        ".ninaero-code-block, .ninaero-code-block > [data-slot=code-block-header]": {
          "box-shadow": "none",
        },
        ".ninaero-code-block-content, .dark .ninaero-code-block-content": {
          "--ninaero-code-rule": "transparent",
        },
        ".ninaero-code-block-content [data-slot=code-block-line][data-variant=highlighted]::after":
          {
            "border-color": "Highlight",
          },
        ".ninaero-tooltip": {
          "forced-color-adjust": "none",
          "background-color": "Canvas",
          "background-image": "none",
          "border-color": "CanvasText",
          color: "CanvasText",
          "box-shadow": "none",
        },
        ".ninaero-tooltip::before": { display: "none" },
        ":is(.ninaero-checkbox, .ninaero-radio-group-item)": {
          "forced-color-adjust": "none",
          "border-color": "CanvasText",
          "background-color": "Canvas",
          color: "CanvasText",
          "background-image": "none",
          "box-shadow": "none",
        },
        ":is(.ninaero-checkbox, .ninaero-radio-group-item):where([data-checked], [data-indeterminate])":
          {
            "border-color": "Highlight",
            "background-color": "Highlight",
            color: "HighlightText",
          },
        ":is(.ninaero-checkbox, .ninaero-radio-group-item):where([aria-invalid=true], [data-invalid])":
          {
            "border-style": "dashed",
          },
        ":is(.ninaero-checkbox, .ninaero-radio-group-item):where([data-disabled])": {
          "border-color": "GrayText",
          "background-color": "Canvas",
          color: "GrayText",
        },
        ".ninaero-radio-group-dot": {
          "border-color": "currentColor",
          "background-color": "currentColor",
          "background-image": "none",
          "box-shadow": "none",
        },
        ".ninaero-switch": {
          "forced-color-adjust": "none",
          "border-color": "CanvasText",
          "background-color": "Canvas",
          "background-image": "none",
          "box-shadow": "none",
        },
        ".ninaero-switch:where([data-checked])": {
          "background-color": "Highlight",
        },
        ".ninaero-switch .ninaero-switch-thumb": {
          "border-color": "ButtonText",
          "background-color": "ButtonFace",
          "background-image": "none",
          "box-shadow": "none",
        },
        ".ninaero-switch:where([data-checked]) .ninaero-switch-thumb": {
          "border-color": "HighlightText",
          "background-color": "HighlightText",
        },
        ".ninaero-switch:where([data-disabled])": {
          "border-color": "GrayText",
        },
        ".ninaero-switch:where([data-disabled][data-checked])": {
          "background-color": "GrayText",
        },
        ".ninaero-switch:where([data-disabled]) .ninaero-switch-thumb": {
          "border-color": "GrayText",
          "background-color": "Canvas",
        },
        ".ninaero-slider": { "forced-color-adjust": "none" },
        ".ninaero-slider .ninaero-slider-track": {
          border: "1px solid CanvasText",
          "background-color": "Canvas",
          "box-shadow": "none",
        },
        ".ninaero-slider .ninaero-slider-range": {
          "background-color": "Highlight",
          "background-image": "none",
          "box-shadow": "none",
        },
        ".ninaero-slider .ninaero-slider-thumb": {
          border: "1px solid ButtonText",
          "background-color": "ButtonFace",
          "background-image": "none",
          "box-shadow": "none",
        },
        ".ninaero-slider .ninaero-slider-thumb::before": { display: "none" },
        ".ninaero-slider .ninaero-slider-thumb:where(:focus-visible, :has(:focus-visible))": {
          "outline-color": "Highlight",
        },
        ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-track, .ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-thumb":
          {
            "border-color": "GrayText",
          },
        ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-range": {
          "background-color": "GrayText",
        },
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
          "text-shadow": "none",
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
          "background-image": "none",
          color: "CanvasText",
          "box-shadow": "none",
        },
        ".ninaero-dropdown-menu-item, .ninaero-dropdown-menu-item[data-variant=destructive]": {
          "forced-color-adjust": "none",
          transition: "none",
          "background-color": "Canvas",
          color: "CanvasText",
        },
        ".ninaero-dropdown-menu-item:is([data-highlighted], [data-popup-open]):not([data-disabled])":
          {
            "background-color": "Highlight",
            color: "HighlightText",
            "box-shadow": "none",
          },
        ".ninaero-dropdown-menu-item:focus-visible": {
          "outline-color": "Highlight",
        },
        ".ninaero-dropdown-menu-item[data-highlighted]:focus-visible:not([data-disabled])": {
          "outline-color": "HighlightText",
        },
        ".ninaero-dropdown-menu-item[data-disabled]": {
          color: "GrayText",
        },
        ".ninaero-dropdown-menu-shortcut": {
          color: "inherit",
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
        [selectItemFocus]: {
          "outline-color": "Highlight",
        },
        [`${selectItemFocus}[data-selected]`]: {
          "outline-color": "HighlightText",
        },
        ".ninaero-select-item[data-highlighted]:not([data-selected]):not([data-disabled])": {
          "background-color": "Canvas",
        },
        ".ninaero-select-item[data-disabled]": {
          "border-color": "Canvas",
          "background-color": "Canvas",
          color: "GrayText",
        },
        ".ninaero-toggle, .ninaero-toggle[aria-pressed=true]": {
          "border-color": "ButtonText",
          "background-color": "ButtonFace",
          "background-image": "none",
          "text-shadow": "none",
          color: "ButtonText",
          "box-shadow": "none",
        },
        ".ninaero-toggle[aria-pressed=true]": {
          // Keep automatic text backplates from hiding HighlightText on selected controls.
          "forced-color-adjust": "none",
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
            "forced-color-adjust": "auto",
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
          "text-shadow": "none",
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
    }),
  },
};
