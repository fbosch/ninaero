import { withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-popover-content": {
      "border-color": "color-mix(in oklab, var(--foreground) 18%, var(--popover))",
      "background-image":
        "linear-gradient(180deg in oklab, var(--popover), color-mix(in oklab, var(--popover), var(--dialog-fill-shade) 50%))",
      "box-shadow":
        "inset 0 1px 0 var(--dialog-highlight), inset 0 -1px 2px var(--dialog-shade), var(--shadow-floating)",
      "overflow-wrap": "anywhere",
      "transform-origin": "var(--transform-origin)",
      opacity: "1",
      transform: "translate(0, 0) scale(1)",
      transition: "opacity 120ms ease-out, transform 240ms cubic-bezier(0.22, 2, 0.35, 1)",
      "--popover-enter-x": "0px",
      "--popover-enter-y": "0px",
    },
    ".ninaero-popover-content[data-starting-style]": {
      opacity: "0",
      transform: "translate(var(--popover-enter-x), var(--popover-enter-y)) scale(0.95)",
    },
    ".ninaero-popover-content[data-ending-style]": {
      opacity: "0",
      transform: "scale(0.98)",
      transition: "opacity 120ms ease-in, transform 120ms ease-in",
    },
    ".ninaero-popover-content[data-instant]": {
      transition: "none",
    },
    ".ninaero-popover-content[data-side=top]": {
      "--popover-enter-y": "3px",
    },
    ".ninaero-popover-content[data-side=bottom]": {
      "--popover-enter-y": "-3px",
    },
    ".ninaero-popover-content:is([data-side=left], [data-side=inline-start][dir=ltr], [data-side=inline-end][dir=rtl])":
      {
        "--popover-enter-x": "3px",
      },
    ".ninaero-popover-content:is([data-side=right], [data-side=inline-end][dir=ltr], [data-side=inline-start][dir=rtl])":
      {
        "--popover-enter-x": "-3px",
      },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-popover-content": {
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-popover-content[data-starting-style]": {
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-popover-content[data-ending-style]": {
        transition: "none",
        transform: "none",
        opacity: "1",
      },
    },
  },
});
