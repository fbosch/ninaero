import { withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-field-label:has(> [data-slot=field])": {
      "border-radius": "var(--radius-lg)",
      "corner-shape": "round",
      border: "1px solid var(--border)",
      transition: "background-color 80ms ease-out, border-color 80ms ease-out",
    },
    ".ninaero-field-label:has(> [data-slot=field]):has([data-checked])": {
      "background-color": "var(--accent)",
      "border-color": "var(--ring)",
    },
    ".ninaero-field-label:has(> [data-slot=field]):has([data-checked]) [data-slot=field-description]":
      {
        color: "color-mix(in oklab, var(--muted-foreground), var(--foreground) 15%)",
      },
    "@media (hover: hover)": {
      ".ninaero-field-label:has(> [data-slot=field]):not(:has(:disabled, [data-disabled])):not(:has([data-checked])):hover":
        {
          "background-color": "color-mix(in oklab, var(--muted) 50%, transparent)",
          "border-color": "var(--neutral-input)",
        },
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-field-label:has(> [data-slot=field])": {
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-field-label:has(> [data-slot=field])": {
        "border-color": "CanvasText",
      },
      ".ninaero-field-label:has(> [data-slot=field]):has([data-checked])": {
        "border-color": "Highlight",
      },
    },
  },
});
