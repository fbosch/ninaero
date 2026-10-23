import { recessShadow, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-combobox-chips": {
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
    ".ninaero-combobox-chips:where(:hover:not([data-disabled]):not(:has(input:disabled)))": {
      "border-color": "var(--neutral-input)",
    },
    ".ninaero-combobox-chips input::placeholder": {
      color: "var(--input-placeholder)",
      opacity: "1",
    },
    ".ninaero-combobox-chips[aria-invalid=true]": {
      "border-color": "var(--destructive)",
      "box-shadow":
        "inset 0 2px 6px var(--input-invalid-shade), inset 0 -1px 2px color-mix(in oklab, var(--input-fill), white var(--recess-highlight-weight))",
    },
    ".ninaero-combobox-chips[data-invalid]": {
      "border-color": "var(--destructive)",
      "box-shadow":
        "inset 0 2px 6px var(--input-invalid-shade), inset 0 -1px 2px color-mix(in oklab, var(--input-fill), white var(--recess-highlight-weight))",
    },
    ".ninaero-combobox-chips:has(input[aria-invalid=true])": {
      "border-color": "var(--destructive)",
      "box-shadow":
        "inset 0 2px 6px var(--input-invalid-shade), inset 0 -1px 2px color-mix(in oklab, var(--input-fill), white var(--recess-highlight-weight))",
    },
    ".ninaero-combobox-chips[data-disabled]": {
      "border-color": "var(--border)",
      "background-color": "var(--input-disabled-fill)",
      color: "var(--muted-foreground)",
      "box-shadow": "none",
    },
    ".ninaero-combobox-chips:has(input:disabled)": {
      "border-color": "var(--border)",
      "background-color": "var(--input-disabled-fill)",
      color: "var(--muted-foreground)",
      "box-shadow": "none",
    },
    ".ninaero-combobox-content": {
      "transform-origin": "var(--transform-origin)",
      transition: "opacity 100ms ease-out, transform 180ms cubic-bezier(0.22, 1.2, 0.35, 1)",
    },
    ".ninaero-combobox-content[data-starting-style]": {
      opacity: "0",
      transform: "scale(0.96)",
    },
    ".ninaero-combobox-content[data-ending-style]": {
      opacity: "0",
      transform: "scale(0.98)",
      transition: "opacity 120ms ease-in, transform 120ms ease-in",
    },
    ".ninaero-combobox-trigger > svg": {
      color: "var(--input-placeholder)",
      transition: "transform 80ms ease-out",
    },
    ".ninaero-combobox-trigger[data-popup-open] > svg": {
      transform: "rotate(180deg)",
    },
    ".ninaero-combobox-item": {
      "border-radius": "var(--radius-md)",
      "corner-shape": "round",
      border: "1px solid transparent",
      outline: "2px solid transparent",
      "outline-offset": "-3px",
      transition:
        "background-color 80ms ease-out, border-color 80ms ease-out, outline-color 80ms ease-out, color 80ms ease-out",
    },
    ".ninaero-combobox-item + .ninaero-combobox-item": {
      "margin-block-start": "0.25rem",
    },
    ".ninaero-combobox-item[data-selected]": {
      "border-color": "var(--ring)",
      "background-color": "var(--accent)",
      color: "var(--accent-foreground)",
    },
    ".ninaero-combobox-item:is(:focus-visible, [data-highlighted])": {
      "outline-color": "var(--ring)",
    },
    ".ninaero-combobox-item[data-highlighted]:not([data-selected]):not([data-disabled])": {
      "background-color": "var(--muted)",
    },
    ".ninaero-combobox-item[data-disabled]": {
      color: "var(--muted-foreground)",
    },
    ".ninaero-combobox-chip": {
      "border-color": "var(--ring)",
      "background-color": "var(--accent)",
      color: "var(--accent-foreground)",
      "overflow-wrap": "anywhere",
    },
    ".ninaero-combobox-chips[data-disabled] .ninaero-combobox-chip": {
      "border-color": "var(--border)",
      "background-color": "var(--input-disabled-fill)",
      color: "var(--muted-foreground)",
    },
    ".ninaero-combobox-chip[data-disabled]": {
      "border-color": "var(--border)",
      "background-color": "var(--input-disabled-fill)",
      color: "var(--muted-foreground)",
    },
    ".ninaero-combobox-chips input": {
      color: "inherit",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-combobox-item": {
        transition: "none",
      },
      ".ninaero-combobox-chips": {
        transition: "none",
      },
      ".ninaero-combobox-content": {
        transition: "none",
      },
      ".ninaero-combobox-trigger > svg": {
        transition: "none",
      },
      ".ninaero-combobox-content[data-starting-style]": {
        opacity: "1",
        transform: "none",
        transition: "none",
      },
      ".ninaero-combobox-content[data-ending-style]": {
        opacity: "1",
        transform: "none",
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-combobox-chips": {
        "border-color": "CanvasText",
        "background-color": "Canvas",
        color: "CanvasText",
        "box-shadow": "none",
      },
      ".ninaero-combobox-chips input::placeholder": {
        color: "GrayText",
      },
      ".ninaero-combobox-chips[aria-invalid=true]": {
        "border-color": "CanvasText",
      },
      ".ninaero-combobox-chips[data-invalid]": {
        "border-color": "CanvasText",
      },
      ".ninaero-combobox-chips:has(input[aria-invalid=true])": {
        "border-color": "CanvasText",
      },
      ".ninaero-combobox-chips:has(input:focus-visible)": {
        "outline-color": "Highlight",
      },
      ".ninaero-combobox-chips[data-disabled]": {
        "border-color": "GrayText",
        "background-color": "Canvas",
        color: "GrayText",
      },
      ".ninaero-combobox-chips:has(input:disabled)": {
        "border-color": "GrayText",
        "background-color": "Canvas",
        color: "GrayText",
      },
      ".ninaero-combobox-trigger > svg": {
        color: "ButtonText",
      },
      ".ninaero-combobox-trigger[data-disabled] > svg": {
        color: "GrayText",
      },
      ".ninaero-combobox-item": {
        "border-color": "Canvas",
        "outline-color": "Canvas",
        "background-color": "Canvas",
        color: "CanvasText",
      },
      ".ninaero-combobox-item[data-selected]": {
        "border-color": "Highlight",
        "background-color": "Highlight",
        color: "HighlightText",
      },
      ".ninaero-combobox-item:is(:focus-visible, [data-highlighted])": {
        "outline-color": "Highlight",
      },
      ".ninaero-combobox-item:is(:focus-visible, [data-highlighted])[data-selected]": {
        "outline-color": "HighlightText",
      },
      ".ninaero-combobox-item[data-highlighted]:not([data-selected]):not([data-disabled])": {
        "background-color": "Canvas",
      },
      ".ninaero-combobox-item[data-disabled]": {
        "border-color": "Canvas",
        "background-color": "Canvas",
        color: "GrayText",
      },
      ".ninaero-combobox-chip": {
        "border-color": "Highlight",
        "background-color": "Canvas",
        color: "CanvasText",
      },
      ".ninaero-combobox-chips[data-disabled] .ninaero-combobox-chip": {
        "border-color": "GrayText",
        "background-color": "Canvas",
        color: "GrayText",
      },
      ".ninaero-combobox-chip[data-disabled]": {
        "border-color": "GrayText",
        "background-color": "Canvas",
        color: "GrayText",
      },
    },
  },
});
