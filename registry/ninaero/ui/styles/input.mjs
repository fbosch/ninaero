import { recessShadow, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-input": {
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
    ".ninaero-input:where(:hover:not(:disabled))": {
      "border-color": "var(--neutral-input)",
    },
    ".ninaero-input::placeholder": {
      color: "var(--input-placeholder)",
      opacity: "1",
    },
    ".ninaero-input[aria-invalid=true]": {
      "border-color": "var(--destructive)",
      "box-shadow":
        "inset 0 2px 6px var(--input-invalid-shade), inset 0 -1px 2px color-mix(in oklab, var(--input-fill), white var(--recess-highlight-weight))",
    },
    ".ninaero-input:disabled": {
      "border-color": "var(--border)",
      "background-color": "var(--input-disabled-fill)",
      color: "var(--muted-foreground)",
      "box-shadow": "none",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-input": {
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-input": {
        "border-color": "CanvasText",
        "background-color": "Canvas",
        color: "CanvasText",
        "box-shadow": "none",
      },
      ".ninaero-input::placeholder": {
        color: "GrayText",
      },
      ".ninaero-input[aria-invalid=true]": {
        "border-color": "CanvasText",
      },
      ".ninaero-input:focus-visible": {
        "outline-color": "Highlight",
      },
      ".ninaero-input:disabled": {
        "border-color": "GrayText",
        "background-color": "Canvas",
        color: "GrayText",
      },
    },
  },
});
