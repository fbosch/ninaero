import { shadowSurface, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
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
        "[data-slot=code-block-line-marker]": {
          display: "block",
        },
      },
    ".ninaero-code-block-content[data-numbered] > [data-slot=code-block-code]:has(> [data-variant=added], > [data-variant=removed])":
      {
        "grid-template-columns": "auto 1ch minmax(0, 1fr)",
      },
    "@media (forced-colors: none)": {
      ".ninaero-button--ghost[data-slot=code-block-copy-button]:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "--button-recess-fill": "var(--button-paper-pressed)",
        },
      ".ninaero-button--ghost[data-slot=code-block-copy-button]:not(:disabled):not([data-disabled]):not([aria-disabled=true]):active":
        {
          "background-color": "var(--button-recess-fill)",
        },
    },
    "@media (hover: hover) and (forced-colors: none)": {
      ".ninaero-button--ghost[data-slot=code-block-copy-button]:not(:disabled):not([data-disabled]):not([aria-disabled=true]):hover":
        {
          "box-shadow":
            "inset 0 1px 0 var(--button-paper-highlight), inset 0 -1px 0 var(--button-paper-shade), var(--button-cast-shadow, var(--shadow-control))",
          transform: "translateY(calc(-1 * var(--button-press-shift)))",
        },
    },
    "@media (forced-colors: active)": {
      ".ninaero-code-block": {
        "box-shadow": "none",
      },
      ".ninaero-code-block > [data-slot=code-block-header]": {
        "box-shadow": "none",
      },
      ".ninaero-code-block-content": {
        "--ninaero-code-rule": "transparent",
      },
      ".dark .ninaero-code-block-content": {
        "--ninaero-code-rule": "transparent",
      },
      ".ninaero-code-block-content [data-slot=code-block-line][data-variant=highlighted]::after": {
        "border-color": "Highlight",
      },
    },
  },
});
