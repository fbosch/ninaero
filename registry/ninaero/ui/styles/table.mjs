import { shadowSurface, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    "[data-slot=table-footer]": {
      "--ninaero-table-footer-shadow-surface":
        "color-mix(in srgb, var(--muted) 50%, var(--shadow-surface))",
    },
    "[data-slot=table-footer] > *": shadowSurface("var(--ninaero-table-footer-shadow-surface)"),
    "[data-slot=table-row]": {
      "--ninaero-table-row-shadow-surface": "var(--shadow-surface)",
    },
    "[data-slot=table-row]:has([aria-expanded=true])": {
      "--ninaero-table-row-shadow-surface":
        "color-mix(in srgb, var(--muted) 50%, var(--shadow-surface))",
    },
    "[data-slot=table-row][data-state=selected]": {
      "--ninaero-table-row-shadow-surface": "var(--muted)",
    },
    "[data-slot=table-row] > *": shadowSurface("var(--ninaero-table-row-shadow-surface)"),
    "@media (hover: hover)": {
      "[data-slot=table-row]:hover:not([data-state=selected])": {
        "--ninaero-table-row-shadow-surface":
          "color-mix(in srgb, var(--muted) 50%, var(--shadow-surface))",
      },
    },
  },
});
