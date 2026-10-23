import { recessShadow, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
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
      "border-color": "var(--button-paper-edge)",
      "background-color": "var(--button-paper-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
      "box-shadow": "inset 0 -1px 0 var(--button-paper-shade)",
      "text-shadow": "var(--control-label-text-shadow)",
    },
    ".ninaero-toggle[aria-pressed=true]": {
      "background-color": "var(--accent)",
      "background-image": "none",
      "box-shadow": recessShadow("var(--accent)"),
      "--button-recess-fill":
        "color-mix(in oklab, var(--accent), black var(--recess-shade-weight))",
      color: "color-mix(in oklab, var(--accent-foreground), var(--foreground) 20%)",
      "text-shadow": "none",
      "border-color": "var(--ring)",
    },
    ".ninaero-toggle[aria-invalid=true]": {
      "border-color": "var(--button-destructive-edge)",
    },
    ".ninaero-toggle:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])": {
      "background-color": "var(--button-recess-fill)",
      "background-image": "none",
      "box-shadow": recessShadow("var(--button-recess-fill)"),
      "text-shadow": "none",
    },
    ".ninaero-toggle:disabled": {
      "background-image": "none",
      "box-shadow": "none",
      "text-shadow": "none",
      opacity: "0.5",
    },
    ".ninaero-toggle[data-disabled]": {
      "background-image": "none",
      "box-shadow": "none",
      "text-shadow": "none",
      opacity: "0.5",
    },
    ".ninaero-toggle[aria-disabled=true]": {
      "background-image": "none",
      "box-shadow": "none",
      "text-shadow": "none",
      opacity: "0.5",
    },
    "@media (hover: hover)": {
      ".ninaero-toggle:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-pressed=true])":
        {
          "background-color": "var(--button-paper-hover)",
        },
      ".ninaero-toggle:where(:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-invalid=true]))[aria-pressed=true]":
        {
          "background-color": "color-mix(in oklab, var(--accent), var(--ring) 8%)",
        },
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-toggle": {
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-toggle": {
        "border-color": "ButtonText",
        "background-color": "ButtonFace",
        "background-image": "none",
        "text-shadow": "none",
        color: "ButtonText",
        "box-shadow": "none",
      },
      ".ninaero-toggle[aria-pressed=true]": {
        "border-color": "Highlight",
        "background-color": "Highlight",
        "background-image": "none",
        "text-shadow": "none",
        color: "HighlightText",
        "box-shadow": "none",
        "forced-color-adjust": "none",
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
      ".ninaero-toggle:disabled": {
        "forced-color-adjust": "auto",
        "border-color": "GrayText",
        color: "GrayText",
      },
      ".ninaero-toggle[data-disabled]": {
        "forced-color-adjust": "auto",
        "border-color": "GrayText",
        color: "GrayText",
      },
      ".ninaero-toggle[aria-disabled=true]": {
        "forced-color-adjust": "auto",
        "border-color": "GrayText",
        color: "GrayText",
      },
    },
  },
});
