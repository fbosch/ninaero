import { elevationVariables, shadowSurface, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-tooltip": {
      ...elevationVariables,
      position: "relative",
      isolation: "isolate",
      "max-width": "min(20rem, var(--available-width))",
      "border-radius": "1rem",
      "corner-shape": "round",
      border: "1px solid color-mix(in oklab, var(--foreground), var(--background) 22%)",
      "background-color": "var(--foreground)",
      "background-image":
        "linear-gradient(180deg in oklab, color-mix(in oklab, var(--foreground), white 12%), color-mix(in oklab, var(--foreground), black 12%))",
      color: "var(--background)",
      "box-shadow":
        "inset 0 1px 0 color-mix(in oklab, var(--foreground), white 18%), inset 0 -1px 2px color-mix(in oklab, var(--foreground), black 20%), var(--shadow-floating)",
      "overflow-wrap": "anywhere",
      "transform-origin": "var(--transform-origin)",
      opacity: "1",
      "--tooltip-enter-x": "0px",
      "--tooltip-enter-y": "0px",
      transform: "translate(0, 0) scale(1)",
      transition: "opacity 120ms ease-out, transform 240ms cubic-bezier(0.22, 2, 0.35, 1)",
    },
    ".ninaero-tooltip > *": shadowSurface("var(--foreground)"),
    ".ninaero-tooltip::before": {
      content: '""',
      position: "absolute",
      inset: "0",
      "z-index": "-1",
      "pointer-events": "none",
      "border-radius": "inherit",
      "corner-shape": "inherit",
      "--ninaero-paper-step": "4px",
      "--ninaero-pattern-ink": "var(--tooltip-scanline-ink)",
      "background-image":
        "repeating-linear-gradient(transparent 0 calc(var(--ninaero-paper-step) - 1px), var(--ninaero-pattern-ink, var(--paper-rule)) calc(var(--ninaero-paper-step) - 1px) var(--ninaero-paper-step))",
    },
    ".ninaero-tooltip[data-side=top]": {
      "--tooltip-enter-y": "4px",
    },
    ".ninaero-tooltip[data-side=bottom]": {
      "--tooltip-enter-y": "-4px",
    },
    ".ninaero-tooltip:is([data-side=left], [data-side=inline-start][dir=ltr], [data-side=inline-end][dir=rtl])":
      {
        "--tooltip-enter-x": "4px",
      },
    ".ninaero-tooltip:is([data-side=right], [data-side=inline-end][dir=ltr], [data-side=inline-start][dir=rtl])":
      {
        "--tooltip-enter-x": "-4px",
      },
    ".ninaero-tooltip[data-starting-style]": {
      opacity: "0",
      transform: "translate(var(--tooltip-enter-x), var(--tooltip-enter-y)) scale(0.88)",
    },
    ".ninaero-tooltip[data-ending-style]": {
      opacity: "0",
      transform: "scale(0.98)",
      transition: "opacity 120ms ease-in, transform 120ms ease-in",
    },
    ".ninaero-tooltip[data-instant]": {
      transition: "none",
    },
    ".ninaero-tooltip[data-instant][data-starting-style]": {
      opacity: "1",
      transform: "none",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-tooltip": {
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-tooltip[data-starting-style]": {
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-tooltip[data-ending-style]": {
        transition: "none",
        transform: "none",
        opacity: "1",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-tooltip": {
        "forced-color-adjust": "none",
        "background-color": "Canvas",
        "background-image": "none",
        "border-color": "CanvasText",
        color: "CanvasText",
        "box-shadow": "none",
      },
      ".ninaero-tooltip::before": {
        display: "none",
      },
    },
  },
  "@layer utilities": {
    "@media (forced-colors: active)": {
      ".ninaero-tooltip [data-slot=kbd]": {
        "background-color": "Canvas",
        color: "CanvasText",
        border: "1px solid CanvasText",
      },
    },
  },
});
