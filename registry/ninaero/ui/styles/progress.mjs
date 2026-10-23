import { withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-progress-circular-edge": {
      stroke: "var(--input-edge)",
    },
    ".ninaero-progress-circular-track": {
      stroke: "var(--input-fill)",
    },
    ".ninaero-progress-track-shade": {
      "flood-color": "color-mix(in oklab, var(--input-fill), black var(--recess-shade-weight))",
    },
    ".ninaero-progress-track-highlight": {
      "flood-color": "color-mix(in oklab, var(--input-fill), white var(--recess-highlight-weight))",
    },
    ".ninaero-progress-circular-rim": {
      stroke: "color-mix(in oklab, var(--button-primary-edge) 55%, var(--glass-mark-face-50))",
    },
    ".ninaero-progress-indicator-highlight": {
      "stop-color": "var(--glass-mark-face-0)",
    },
    ".ninaero-progress-indicator-middle": {
      "stop-color": "var(--glass-mark-face-50)",
    },
    ".ninaero-progress-indicator-fill": {
      "stop-color": "var(--glass-mark-face-100)",
    },
    ".ninaero-progress-circular-indicator[data-indeterminate]": {
      animation: "ninaero-progress-circular 1s linear infinite",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-progress-circular-indicator[data-indeterminate]": {
        animation: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-progress-circular-edge": {
        display: "none",
      },
      ".ninaero-progress-circular-track": {
        stroke: "GrayText",
        filter: "none",
      },
      ".ninaero-progress-circular-indicator > path": {
        stroke: "Highlight",
      },
    },
    "@keyframes ninaero-progress-circular": {
      from: {
        "stroke-dashoffset": "100",
      },
      to: {
        "stroke-dashoffset": "0",
      },
    },
  },
});
