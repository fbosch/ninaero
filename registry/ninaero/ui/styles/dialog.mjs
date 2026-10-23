import { elevationVariables, shadowSurface, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-dialog": {
      ...elevationVariables,
      "--dialog-corner": "3rem",
      "border-radius": "var(--dialog-corner)",
      "corner-shape": "squircle",
      border: "1px solid color-mix(in oklab, var(--foreground) 18%, var(--popover))",
      "background-color": "var(--popover)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--popover), var(--dialog-fill-shade))",
      "box-shadow":
        "inset 0 1px 0 var(--dialog-highlight), inset 0 -1px 2px var(--dialog-shade), var(--shadow-dialog)",
      opacity: "1",
      transform: "translateY(0) scale(1)",
      "transform-origin": "center",
      transition: "opacity 140ms ease-out, transform 260ms cubic-bezier(0.22, 2.2, 0.35, 1)",
    },
    ".ninaero-dialog > *": shadowSurface("var(--popover)"),
    ".ninaero-dialog[data-starting-style]": {
      opacity: "0",
      transform: "translateY(8px) scale(0.92)",
    },
    ".ninaero-dialog[data-ending-style]": {
      opacity: "0",
      transform: "translateY(4px) scale(0.96)",
      transition: "opacity 140ms ease-in, transform 140ms ease-in",
    },
    ".ninaero-dialog-overlay": {
      opacity: "1",
      transition: "opacity 160ms ease-out",
    },
    ".ninaero-dialog-overlay[data-starting-style]": {
      opacity: "0",
    },
    ".ninaero-dialog-overlay[data-ending-style]": {
      opacity: "0",
      "transition-duration": "140ms",
    },
    '.ninaero-dialog:has(> [data-slot="dialog-close"]) [data-slot="dialog-header"]': {
      "padding-inline-end": "2rem",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-dialog": {
        animation: "none",
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-dialog[data-starting-style]": {
        animation: "none",
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-dialog[data-ending-style]": {
        animation: "none",
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-dialog-overlay": {
        animation: "none",
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-dialog-overlay[data-starting-style]": {
        animation: "none",
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-dialog-overlay[data-ending-style]": {
        animation: "none",
        transition: "none",
        transform: "none",
        opacity: "1",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-dialog": {
        "border-color": "CanvasText",
        "background-color": "Canvas",
        "background-image": "none",
        color: "CanvasText",
        "box-shadow": "none",
      },
    },
  },
});
