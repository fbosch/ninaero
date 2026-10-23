import { withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-accordion-trigger": {
      color: "var(--foreground)",
      transition: "background-color 140ms ease, color 140ms ease",
      "&:not([data-disabled]):hover": {
        "background-color": "color-mix(in oklab, var(--muted) 50%, transparent)",
      },
      "&:not([data-disabled]):active": {
        "background-color": "var(--muted)",
      },
      "&[data-disabled]": {
        color: "var(--muted-foreground)",
        cursor: "not-allowed",
      },
    },
    ".ninaero-accordion-icon": {
      color: "var(--muted-foreground)",
      transition: "transform 160ms ease",
      ".ninaero-accordion-trigger[aria-expanded=true] &": {
        transform: "rotate(180deg)",
      },
    },
    ".ninaero-accordion-content": {
      height: "var(--accordion-panel-height)",
      transition: "height 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      "&[data-starting-style], &[data-ending-style]": {
        height: "0",
      },
      "&[data-ending-style]": {
        "transition-duration": "140ms",
      },
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-accordion-trigger": {
        transition: "none",
      },
      ".ninaero-accordion-icon": {
        transition: "none",
      },
      ".ninaero-accordion-content": {
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-accordion-item": {
        "border-color": "CanvasText",
      },
      ".ninaero-accordion-trigger": {
        color: "ButtonText",
        "&:not([data-disabled]):hover": {
          "background-color": "Canvas",
          "text-decoration": "underline",
        },
        "&:not([data-disabled]):active": {
          "background-color": "Highlight",
          color: "HighlightText",
        },
        "&[data-disabled]": {
          color: "GrayText",
        },
      },
      ".ninaero-accordion-icon": {
        color: "currentColor",
      },
    },
  },
});
