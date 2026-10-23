import { recessShadow, shadowSurface, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-radio-group-item": {
      border: "1px solid var(--input-edge)",
      "background-color": "var(--input-fill)",
      "box-shadow": recessShadow("var(--input-fill)"),
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
    ".ninaero-radio-group-item:where([data-checked], [data-indeterminate])": {
      "background-color": "var(--button-primary-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--glass-mark-face-0), var(--glass-mark-face-50) 48%, var(--glass-mark-face-100))",
      "box-shadow":
        "inset 0 1px 0 color-mix(in oklab, var(--glass-mark-face-0), white 25%), inset 0 -1px 0 color-mix(in oklab, var(--glass-mark-face-100), black 8%)",
      "--button-recess-fill": "var(--button-primary-pressed)",
      "border-color": "var(--button-primary-edge)",
      color: "color-mix(in oklab, var(--primary-foreground), black 12%)",
    },
    ".ninaero-radio-group-item:where(:hover:not([data-disabled]):not([data-readonly])[data-unchecked]:not([data-indeterminate]))":
      {
        "border-color": "var(--neutral-input)",
      },
    ".ninaero-radio-group-item:where(:hover:not([data-disabled]):not([data-readonly])):where([data-checked], [data-indeterminate])":
      {
        "border-color": "var(--ring)",
      },
    ".ninaero-radio-group-item:where(:active:not([data-disabled]):not([data-readonly]))": {
      "background-image": "none",
      "background-color": "var(--button-recess-fill)",
      "box-shadow": recessShadow("var(--button-recess-fill)"),
    },
    ".ninaero-radio-group-item:where([aria-invalid=true], [data-invalid])": {
      "border-color": "var(--destructive)",
    },
    ".ninaero-radio-group-item:where([data-checked], [data-indeterminate]):where([aria-invalid=true], [data-invalid])":
      {
        "--button-primary-fill": "var(--button-destructive-fill)",
        "--glass-mark-face-0": "var(--button-destructive-hover)",
        "--glass-mark-face-50":
          "color-mix(in oklab, var(--button-destructive-hover), var(--button-destructive-pressed))",
        "--glass-mark-face-100": "var(--button-destructive-pressed)",
        "--button-recess-fill": "var(--button-destructive-pressed)",
        color: "color-mix(in oklab, var(--button-destructive-ink), black 12%)",
      },
    ".ninaero-radio-group-item:where([data-readonly])": {
      cursor: "default",
    },
    ".ninaero-radio-group-item:where([data-disabled])": {
      "background-color": "var(--input-disabled-fill)",
      "border-color": "var(--border)",
      color: "var(--muted-foreground)",
      "background-image": "none",
      "box-shadow": "none",
      cursor: "not-allowed",
    },
    ".ninaero-radio-group-dot": {
      ...shadowSurface("var(--glass-mark-face-50)"),
      border: "1px solid",
      "border-color": "var(--button-paper-edge)",
      "background-color": "var(--button-paper-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
      "box-shadow": "inset 0 -1px 0 var(--button-paper-shade), var(--shadow-control)",
    },
    ".ninaero-radio-group-item:where(:active:not([data-disabled]):not([data-readonly])) .ninaero-radio-group-dot":
      {
        "--shadow-surface": "var(--button-recess-fill)",
      },
    ".ninaero-radio-group-item:where([data-disabled]) .ninaero-radio-group-dot": {
      "border-color": "currentColor",
      "background-color": "currentColor",
      "background-image": "none",
      "box-shadow": "none",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-radio-group-item": {
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-radio-group-item": {
        "forced-color-adjust": "none",
        "border-color": "CanvasText",
        "background-color": "Canvas",
        color: "CanvasText",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-radio-group-item:where([data-checked], [data-indeterminate])": {
        "border-color": "Highlight",
        "background-color": "Highlight",
        color: "HighlightText",
      },
      ".ninaero-radio-group-item:where([aria-invalid=true], [data-invalid])": {
        "border-style": "dashed",
      },
      ".ninaero-radio-group-item:where([data-disabled])": {
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
    },
  },
});
