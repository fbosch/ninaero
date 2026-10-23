import { shadowSurface, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-tabs-list[data-variant=default] > *": shadowSurface("var(--tabs-track-fill)"),
    ".ninaero-tabs-list": {
      "border-radius": "var(--radius-lg)",
      "corner-shape": "round",
      border: "1px solid var(--border)",
      "background-color": "var(--tabs-track-fill)",
      "box-shadow":
        "inset 0 2px 6px color-mix(in oklab, var(--tabs-track-fill), black var(--recess-shade-weight)), inset 0 -1px 2px color-mix(in oklab, var(--tabs-track-fill), white var(--recess-highlight-weight))",
    },
    ".ninaero-tabs-trigger": {
      "border-radius": "var(--radius-md)",
      "corner-shape": "round",
      border: "1px solid transparent",
      color: "var(--tabs-ink)",
      "background-color": "transparent",
      outline: "2px solid transparent",
      "outline-offset": "2px",
      transition:
        "background-color 100ms ease-out, border-color 100ms ease-out, box-shadow 100ms ease-out, color 100ms ease-out",
    },
    ".ninaero-tabs-trigger[data-active]": {
      color: "var(--foreground)",
    },
    ".ninaero-tabs-list[data-variant=default] > .ninaero-tabs-trigger:where(:not(:disabled):not([data-disabled]):not([aria-disabled=true]))[data-active]":
      {
        "border-color": "var(--tabs-active-edge)",
        "background-color": "var(--tabs-active-fill)",
        "text-shadow": "var(--control-label-text-shadow)",
        "background-image":
          "radial-gradient(ellipse at 50% -45% in oklab, var(--tabs-active-highlight), transparent 75%), linear-gradient(180deg in oklab, var(--tabs-active-top), var(--tabs-active-fill) 48%, var(--tabs-active-bottom))",
        "box-shadow":
          "inset 0 1px 0 var(--tabs-active-highlight), inset 0 -1px 0 var(--tabs-active-bottom), 0 1px 2px hsl(var(--shadow-color) / 0.2)",
      },
    ".ninaero-tabs-list[data-variant=default] > .ninaero-tabs-trigger:where(:not(:disabled):not([data-disabled]):not([aria-disabled=true])):active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
      {
        "background-color": "var(--tabs-hover-fill)",
        "background-image": "none",
        "box-shadow":
          "inset 0 2px 6px color-mix(in oklab, var(--tabs-hover-fill), black var(--recess-shade-weight)), inset 0 -1px 2px color-mix(in oklab, var(--tabs-hover-fill), white var(--recess-highlight-weight))",
        "text-shadow": "none",
      },
    ".ninaero-tabs-trigger:disabled": {
      color: "var(--muted-foreground)",
      "background-image": "none",
      "box-shadow": "none",
      "text-shadow": "none",
      cursor: "not-allowed",
    },
    ".ninaero-tabs-trigger[data-disabled]": {
      color: "var(--muted-foreground)",
      "background-image": "none",
      "box-shadow": "none",
      "text-shadow": "none",
      cursor: "not-allowed",
    },
    ".ninaero-tabs-trigger[aria-disabled=true]": {
      color: "var(--muted-foreground)",
      "background-image": "none",
      "box-shadow": "none",
      "text-shadow": "none",
      cursor: "not-allowed",
    },
    ".ninaero-tabs-content": {
      outline: "2px solid transparent",
      "outline-offset": "3px",
    },
    ".ninaero-tabs-trigger:focus-visible": {
      "outline-color": "var(--ring)",
    },
    ".ninaero-tabs-content:focus-visible": {
      "outline-color": "var(--ring)",
    },
    ".ninaero-tabs-list[data-variant=line]": {
      "border-radius": "0",
      border: "0",
      "background-color": "transparent",
      "box-shadow": "none",
    },
    ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger": {
      "border-color": "transparent",
      "background-color": "transparent",
      "background-image": "none",
      "box-shadow": "none",
    },
    ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger::after": {
      "--tabs-marker-fill": "var(--button-primary-edge)",
      content: '""',
      position: "absolute",
      "inset-inline": "0.75rem",
      "inset-block-end": "0",
      height: "4px",
      "box-sizing": "border-box",
      "border-radius": "2px",
      border: "0",
      "background-color": "var(--tabs-marker-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, color-mix(in oklab, var(--tabs-marker-fill), white 10%), var(--tabs-marker-fill))",
      "box-shadow": "0 1px 2px hsl(var(--shadow-color) / 0.16)",
      "pointer-events": "none",
      opacity: "0",
    },
    ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger[data-active]::after": {
      opacity: "1",
    },
    ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger:where(:active:not(:disabled):not([data-disabled]):not([aria-disabled=true]))::after":
      {
        "background-color": "var(--button-primary-edge)",
        "background-image": "none",
        "box-shadow": "none",
      },
    ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger:where(:disabled, [data-disabled], [aria-disabled=true])::after":
      {
        "background-color": "var(--muted-foreground)",
        "background-image": "none",
        "box-shadow": "none",
      },
    ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger[data-orientation=vertical]::after":
      {
        "inset-inline-start": "auto",
        "inset-inline-end": "0",
        "inset-block": "4px",
        width: "4px",
        height: "auto",
      },
    "@media (hover: hover)": {
      ".ninaero-tabs-trigger:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([data-active])":
        {
          color: "var(--foreground)",
        },
      ".ninaero-tabs-list[data-variant=default] > .ninaero-tabs-trigger:where(:not(:disabled):not([data-disabled]):not([aria-disabled=true])):hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([data-active])":
        {
          "background-color": "var(--tabs-hover-fill)",
        },
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-tabs-trigger": {
        transition: "none",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-tabs-list": {
        "border-color": "CanvasText",
        "background-color": "Canvas",
        "box-shadow": "none",
      },
      ".ninaero-tabs-trigger": {
        color: "ButtonText",
        "background-color": "ButtonFace",
        "box-shadow": "none",
      },
      ".ninaero-tabs-list[data-variant=default] > .ninaero-tabs-trigger:where(:not(:disabled):not([data-disabled]):not([aria-disabled=true]))[data-active]":
        {
          "border-color": "Highlight",
          "background-color": "Highlight",
          "background-image": "none",
          color: "HighlightText",
          "box-shadow": "none",
          "text-shadow": "none",
        },
      ".ninaero-tabs-list[data-variant=default] > .ninaero-tabs-trigger:where(:not(:disabled):not([data-disabled]):not([aria-disabled=true])):hover:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([data-active])":
        {
          "background-color": "ButtonFace",
          color: "ButtonText",
          "box-shadow": "none",
        },
      ".ninaero-tabs-list[data-variant=default] > .ninaero-tabs-trigger:where(:not(:disabled):not([data-disabled]):not([aria-disabled=true])):active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "ButtonFace",
          color: "ButtonText",
          "box-shadow": "none",
        },
      ".ninaero-tabs-list[data-variant=default] > .ninaero-tabs-trigger:where(:not(:disabled):not([data-disabled]):not([aria-disabled=true]))[data-active]:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "Highlight",
          color: "HighlightText",
        },
      ".ninaero-tabs-list[data-variant=line]": {
        "background-color": "Canvas",
        "box-shadow": "none",
      },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger": {
        "border-color": "transparent",
        "background-color": "Canvas",
        "box-shadow": "none",
      },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger::after": {
        "background-color": "Highlight",
        "background-image": "none",
        "box-shadow": "none",
      },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger:where(:disabled, [data-disabled], [aria-disabled=true])::after":
        {
          "background-color": "GrayText",
        },
      ".ninaero-tabs-list[data-variant=line] > .ninaero-tabs-trigger[data-active]": {
        color: "Highlight",
      },
      ".ninaero-tabs-trigger:disabled": {
        color: "GrayText",
        "box-shadow": "none",
      },
      ".ninaero-tabs-trigger[data-disabled]": {
        color: "GrayText",
        "box-shadow": "none",
      },
      ".ninaero-tabs-trigger[aria-disabled=true]": {
        color: "GrayText",
        "box-shadow": "none",
      },
      ".ninaero-tabs-trigger:focus-visible": {
        "outline-color": "Highlight",
      },
      ".ninaero-tabs-content:focus-visible": {
        "outline-color": "Highlight",
      },
    },
  },
});
