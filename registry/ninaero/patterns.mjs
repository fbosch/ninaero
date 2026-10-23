import { shadowSurface } from "./theme.mjs";

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
export const overlayDotRadius = 0.75;

function overlayDotsMask() {
  // Relative dimensions let mask-size set the viewport without scaling the dot.
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="white">',
    `<circle cx="50%" cy="50%" r="${overlayDotRadius}"/>`,
    "</svg>",
  ].join("");
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const textureMasks = {
  "--overlay-flipnote-mask": flipnoteMask(),
  "--overlay-dots-mask": overlayDotsMask(),
  "--overlay-lines-mask":
    "linear-gradient(45deg, black 12.5%, transparent 0 50%, black 0 62.5%, transparent 0)",
};

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

export const styles = {
  ":root": {
    "--paper-notebook-mask": notebookMask(),
    "--dither-mask": ditherMask(),
    ...textureMasks,
  },
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
  "@layer components": {
    ".ninaero-surface-paper": shadowSurface("var(--paper-fill)"),
  },
};
