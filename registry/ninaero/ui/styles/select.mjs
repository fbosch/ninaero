import { recessShadow, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-select-trigger": {
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
    ".ninaero-select-trigger:where(:hover:not(:disabled):not([data-disabled]))": {
      "border-color": "var(--neutral-input)",
    },
    ".ninaero-select-trigger[data-placeholder]": {
      color: "var(--input-placeholder)",
      opacity: "1",
    },
    ".ninaero-select-trigger[aria-invalid=true]": {
      "border-color": "var(--destructive)",
      "box-shadow":
        "inset 0 2px 6px var(--input-invalid-shade), inset 0 -1px 2px color-mix(in oklab, var(--input-fill), white var(--recess-highlight-weight))",
    },
    ".ninaero-select-trigger[data-invalid]": {
      "border-color": "var(--destructive)",
      "box-shadow":
        "inset 0 2px 6px var(--input-invalid-shade), inset 0 -1px 2px color-mix(in oklab, var(--input-fill), white var(--recess-highlight-weight))",
    },
    ".ninaero-select-trigger:disabled": {
      "border-color": "var(--border)",
      "background-color": "var(--input-disabled-fill)",
      color: "var(--muted-foreground)",
      "box-shadow": "none",
    },
    ".ninaero-select-trigger[data-disabled]": {
      "border-color": "var(--border)",
      "background-color": "var(--input-disabled-fill)",
      color: "var(--muted-foreground)",
      "box-shadow": "none",
    },
    ".ninaero-select-content": {
      "transform-origin": "var(--transform-origin)",
      transition: "opacity 100ms ease-out, transform 180ms cubic-bezier(0.22, 1.2, 0.35, 1)",
    },
    ".ninaero-select-content[data-starting-style]": {
      opacity: "0",
      transform: "scale(0.96)",
    },
    ".ninaero-select-content[data-ending-style]": {
      opacity: "0",
      transform: "scale(0.98)",
      transition: "opacity 120ms ease-in, transform 120ms ease-in",
    },
    ".ninaero-select-content[data-align-trigger=true]": {
      "--select-align-offset": "calc(0.5rem + 0.75rem + 1px - var(--field-padding-inline))",
      "--select-popup-width": "calc(var(--anchor-width) + 2 * var(--select-align-offset))",
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
    ".ninaero-select-item + .ninaero-select-item": {
      "margin-block-start": "0.25rem",
    },
    ".ninaero-select-item[data-selected]": {
      "border-color": "var(--ring)",
      "background-color": "var(--accent)",
      color: "var(--accent-foreground)",
    },
    ".ninaero-select-item:is(:focus-visible, [data-highlighted])": {
      "outline-color": "var(--ring)",
    },
    ".ninaero-select-item[data-highlighted]:not([data-selected]):not([data-disabled])": {
      "background-color": "var(--muted)",
    },
    ".ninaero-select-item[data-disabled]": {
      color: "var(--muted-foreground)",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-select-item": {
        transition: "none",
      },
      ".ninaero-select-trigger": {
        transition: "none",
      },
      ".ninaero-select-content": {
        transition: "none",
      },
      ".ninaero-select-icon": {
        transition: "none",
      },
      ".ninaero-select-content[data-starting-style]": {
        opacity: "1",
        transform: "none",
        transition: "none",
      },
      ".ninaero-select-content[data-ending-style]": {
        opacity: "1",
        transform: "none",
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-select-trigger": {
        "border-color": "CanvasText",
        "background-color": "Canvas",
        color: "CanvasText",
        "box-shadow": "none",
      },
      ".ninaero-select-trigger[data-placeholder]": {
        color: "GrayText",
      },
      ".ninaero-select-trigger[aria-invalid=true]": {
        "border-color": "CanvasText",
      },
      ".ninaero-select-trigger[data-invalid]": {
        "border-color": "CanvasText",
      },
      ".ninaero-select-trigger:focus-visible": {
        "outline-color": "Highlight",
      },
      ".ninaero-select-trigger:disabled": {
        "border-color": "GrayText",
        "background-color": "Canvas",
        color: "GrayText",
      },
      ".ninaero-select-trigger[data-disabled]": {
        "border-color": "GrayText",
        "background-color": "Canvas",
        color: "GrayText",
      },
      ".ninaero-select-icon": {
        color: "ButtonText",
      },
      ".ninaero-select-trigger:disabled .ninaero-select-icon": {
        color: "GrayText",
      },
      ".ninaero-select-trigger[data-disabled] .ninaero-select-icon": {
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
      ".ninaero-select-item:is(:focus-visible, [data-highlighted])": {
        "outline-color": "Highlight",
      },
      ".ninaero-select-item:is(:focus-visible, [data-highlighted])[data-selected]": {
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
    },
  },
});
