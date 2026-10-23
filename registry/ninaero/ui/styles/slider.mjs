import { elevationVariables, recessShadow, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-slider-thumb": {
      ...elevationVariables,
      "--slider-grip-ink": "color-mix(in oklab, var(--button-paper-fill), black 30%)",
      "--slider-grip-highlight": "color-mix(in oklab, var(--button-paper-fill), white 30%)",
      "corner-shape": "squircle",
      cursor: "grab",
      "border-color": "var(--button-paper-edge)",
      "background-color": "var(--button-paper-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
      "box-shadow": "inset 0 -1px 0 var(--button-paper-shade), var(--shadow-control)",
      outline: "none",
      transition:
        "border-color 80ms ease-out, background-color 80ms ease-out, box-shadow 80ms ease-out",
    },
    ".ninaero-slider-control": {
      "min-block-size": "2rem",
    },
    ".ninaero-slider-control[data-orientation=vertical]": {
      "min-inline-size": "2rem",
    },
    ".ninaero-slider-track": {
      border: "1px solid var(--input-edge)",
      "background-color": "var(--input-fill)",
      "box-shadow": recessShadow("var(--input-fill)"),
    },
    ".ninaero-slider-range": {
      "background-color": "var(--button-primary-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--glass-mark-face-0), var(--glass-mark-face-50) 48%, var(--glass-mark-face-100))",
      "box-shadow":
        "inset 0 1px 0 color-mix(in oklab, var(--glass-mark-face-0), white 25%), inset 0 -1px 0 color-mix(in oklab, var(--glass-mark-face-100), black 8%)",
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
      "background-color": "var(--button-paper-pressed)",
      "background-image": "none",
      "box-shadow": recessShadow("var(--button-paper-pressed)"),
    },
    ".ninaero-slider-thumb:where(:focus-visible, :has(:focus-visible))": {
      outline: "1px solid var(--ring)",
      "outline-offset": "2px",
    },
    ".ninaero-slider:where([data-variant=simple])": {
      "--slider-simple-ink": "var(--foreground)",
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
    ".ninaero-slider:where([data-invalid], [aria-invalid=true])": {
      "--button-primary-fill": "var(--button-destructive-fill)",
      "--glass-mark-face-0": "var(--button-destructive-hover)",
      "--glass-mark-face-50":
        "color-mix(in oklab, var(--button-destructive-hover), var(--button-destructive-pressed))",
      "--glass-mark-face-100": "var(--button-destructive-pressed)",
    },
    ".ninaero-slider:where([data-invalid], [aria-invalid=true]) .ninaero-slider-track": {
      "border-color": "var(--destructive)",
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
    ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-thumb::before": {
      display: "none",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-slider-thumb": {
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-slider": {
        "forced-color-adjust": "none",
      },
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
      ".ninaero-slider .ninaero-slider-thumb::before": {
        display: "none",
      },
      ".ninaero-slider .ninaero-slider-thumb:where(:focus-visible, :has(:focus-visible))": {
        "outline-color": "Highlight",
      },
      ".ninaero-slider:where([data-invalid], [aria-invalid=true]) :is(.ninaero-slider-track, .ninaero-slider-thumb)":
        {
          "border-style": "dashed",
        },
      ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-track": {
        "border-color": "GrayText",
      },
      ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-thumb": {
        "border-color": "GrayText",
      },
      ".ninaero-slider:where([data-disabled], [aria-disabled=true]) .ninaero-slider-range": {
        "background-color": "GrayText",
      },
    },
  },
});
