import {
  elevationVariables,
  recessShadow,
  shadowSurface,
  withMaterialShadows,
} from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-switch-thumb": {
      ...elevationVariables,
      border: "1px solid",
      "border-color": "var(--button-paper-edge)",
      "background-color": "var(--button-paper-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
      "box-shadow": "inset 0 -1px 0 var(--button-paper-shade), var(--shadow-control)",
      "inline-size": "var(--switch-thumb-size)",
      "block-size": "var(--switch-thumb-size)",
      "border-radius": "50%",
      transform: "translateX(0)",
      transition:
        "transform 140ms ease-out, background-color 80ms ease-out, box-shadow 80ms ease-out",
    },
    ".ninaero-switch > .ninaero-switch-thumb": shadowSurface("var(--input-fill)"),
    ".ninaero-switch[data-checked] > .ninaero-switch-thumb": shadowSurface(
      "var(--glass-mark-face-50)",
    ),
    ".ninaero-switch": {
      border: "1px solid var(--input-edge)",
      "background-color": "var(--input-fill)",
      "box-shadow": recessShadow("var(--input-fill)"),
      "--switch-width": "2.25rem",
      "--switch-thumb-size": "1rem",
      "--switch-direction": "1",
      "inline-size": "var(--switch-width)",
      "block-size": "calc(var(--switch-thumb-size) + 4px)",
      padding: "1px",
      cursor: "pointer",
      outline: "none",
      transition: "background-color 80ms ease-out, border-color 80ms ease-out",
    },
    ".ninaero-switch[data-size=sm]": {
      "--switch-width": "1.75rem",
      "--switch-thumb-size": "0.75rem",
    },
    ".ninaero-switch[data-direction=rtl]": {
      "--switch-direction": "-1",
    },
    ".ninaero-switch:where([data-checked])": {
      "background-color": "var(--button-primary-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--glass-mark-face-0), var(--glass-mark-face-50) 48%, var(--glass-mark-face-100))",
      "box-shadow":
        "inset 0 1px 0 color-mix(in oklab, var(--glass-mark-face-0), white 25%), inset 0 -1px 0 color-mix(in oklab, var(--glass-mark-face-100), black 8%)",
      "border-color": "var(--button-primary-edge)",
    },
    ".ninaero-switch-thumb:where([data-checked])": {
      transform:
        "translateX(calc((var(--switch-width) - var(--switch-thumb-size) - 4px) * var(--switch-direction)))",
    },
    ".ninaero-switch:where(:hover:not([data-disabled]):not([data-readonly])[data-unchecked])": {
      "border-color": "var(--neutral-input)",
    },
    ".ninaero-switch:where(:hover:not([data-disabled]):not([data-readonly])) .ninaero-switch-thumb":
      {
        "background-color": "var(--button-paper-hover)",
      },
    ".ninaero-switch:where(:active:not([data-disabled]):not([data-readonly])) .ninaero-switch-thumb":
      {
        "background-color": "var(--button-paper-pressed)",
        "background-image": "none",
        "box-shadow": recessShadow("var(--button-paper-pressed)"),
      },
    ".ninaero-switch:where([aria-invalid=true], [data-invalid])": {
      "border-color": "var(--destructive)",
      "--button-primary-fill": "var(--button-destructive-fill)",
      "--glass-mark-face-0": "var(--button-destructive-hover)",
      "--glass-mark-face-50":
        "color-mix(in oklab, var(--button-destructive-hover), var(--button-destructive-pressed))",
      "--glass-mark-face-100": "var(--button-destructive-pressed)",
    },
    ".ninaero-switch:where([data-readonly])": {
      cursor: "default",
    },
    ".ninaero-switch:where([data-disabled])": {
      "border-color": "var(--border)",
      "background-color": "var(--input-disabled-fill)",
      "background-image": "none",
      "box-shadow": "none",
      cursor: "not-allowed",
    },
    ".ninaero-switch:where([data-disabled][data-checked])": {
      "background-color": "var(--muted-foreground)",
    },
    ".ninaero-switch:where([data-disabled]) .ninaero-switch-thumb": {
      "border-color": "var(--border)",
      "background-color": "var(--muted)",
      "background-image": "none",
      "box-shadow": "none",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-switch": {
        transition: "none",
      },
      ".ninaero-switch-thumb": {
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-switch": {
        "forced-color-adjust": "none",
        "border-color": "CanvasText",
        "background-color": "Canvas",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-switch:where([data-checked])": {
        "background-color": "Highlight",
      },
      ".ninaero-switch .ninaero-switch-thumb": {
        "border-color": "ButtonText",
        "background-color": "ButtonFace",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-switch:where([data-checked]) .ninaero-switch-thumb": {
        "border-color": "HighlightText",
        "background-color": "HighlightText",
      },
      ".ninaero-switch:where([data-disabled])": {
        "border-color": "GrayText",
      },
      ".ninaero-switch:where([data-disabled][data-checked])": {
        "background-color": "GrayText",
      },
      ".ninaero-switch:where([data-disabled]) .ninaero-switch-thumb": {
        "border-color": "GrayText",
        "background-color": "Canvas",
      },
      ".ninaero-switch:where([aria-invalid=true], [data-invalid])": {
        "border-style": "dashed",
      },
    },
  },
});
