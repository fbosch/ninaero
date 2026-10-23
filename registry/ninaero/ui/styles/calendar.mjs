import { recessShadow, shadowSurface, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    "[data-slot=calendar]": {
      "--ninaero-calendar-underlay": "var(--shadow-surface)",
    },
    ":is([data-slot=card-content], [data-slot=popover-content]) [data-slot=calendar] > *":
      shadowSurface("var(--ninaero-calendar-underlay)"),
    ".ninaero-button[data-day]": {
      "border-radius": "var(--cell-radius)",
      "corner-shape": "round",
    },
    "@media (hover: hover) and (forced-colors: none)": {
      ".ninaero-calendar-day-button.ninaero-button:hover:not(:disabled):not([aria-disabled=true])":
        {
          "background-color": "var(--muted)",
        },
      ".ninaero-calendar-day-button.ninaero-button:is([data-selected-single=true], [data-range-start=true], [data-range-end=true], [data-range-middle=true]):hover:not(:disabled):not([aria-disabled=true])":
        {
          "background-color": "var(--accent)",
        },
      ".ninaero-calendar-day-button.ninaero-button:is([data-selected-single=true], [data-range-start=true][data-range-end=true]):hover:not(:disabled):not([aria-disabled=true])":
        {
          "box-shadow":
            "inset 0 2px 0 var(--button-paper-highlight), inset 0 -2px 0 var(--button-paper-shade)",
        },
    },
    ".ninaero-calendar": {
      "border-radius": "var(--radius-xl)",
      border: "1px solid var(--border)",
      color: "var(--foreground)",
      "box-shadow": "inset 0 1px 0 var(--button-paper-highlight)",
    },
    ":is([data-slot=card-content], [data-slot=popover-content]) .ninaero-calendar": {
      "border-color": "transparent",
      "box-shadow": "none",
    },
    ".ninaero-calendar[aria-invalid=true]": {
      "border-color": "var(--destructive)",
    },
    ".ninaero-calendar-day-button.ninaero-button": {
      "border-radius": "var(--cell-radius)",
      "corner-shape": "round",
      border: "1px solid transparent",
      color: "var(--foreground)",
      "background-color": "transparent",
      "background-image": "none",
      "box-shadow": "none",
      "text-shadow": "none",
      "outline-offset": "-3px",
      transform: "none",
    },
    ".ninaero-calendar-day-button:focus-visible": {
      "outline-color": "var(--ring)",
    },
    ".ninaero-calendar-day[data-outside]:not([data-selected]) > .ninaero-calendar-day-button": {
      color: "var(--muted-foreground)",
    },
    ".ninaero-calendar-today > .ninaero-calendar-day-button": {
      "font-weight": "600",
      "text-decoration-line": "underline",
      "text-decoration-thickness": "1px",
      "text-underline-offset": "4px",
    },
    ".ninaero-calendar-day-button:is([data-selected-single=true], [data-range-start=true], [data-range-end=true], [data-range-middle=true])":
      {
        "background-color": "var(--accent)",
        color: "var(--accent-foreground)",
        "border-color": "var(--ring)",
      },
    ".ninaero-calendar-day[data-selected]:not([data-hidden]) + .ninaero-calendar-day[data-selected]:not([data-hidden]) > .ninaero-calendar-day-button:is([data-range-start=true], [data-range-middle=true], [data-range-end=true])":
      {
        "border-inline-start-width": "0",
        "border-start-start-radius": "0",
        "border-end-start-radius": "0",
      },
    ".ninaero-calendar-day[data-selected]:not([data-hidden]):has(+ .ninaero-calendar-day[data-selected]:not([data-hidden])) > .ninaero-calendar-day-button:is([data-range-start=true], [data-range-middle=true], [data-range-end=true])":
      {
        "border-inline-end-width": "0",
        "border-start-end-radius": "0",
        "border-end-end-radius": "0",
      },
    ".ninaero-calendar-day-button:is([data-range-start=true], [data-range-end=true])": {
      "font-weight": "600",
    },
    "@media (forced-colors: none)": {
      ".ninaero-calendar-day-button.ninaero-button:is([data-selected-single=true], [data-range-start=true], [data-range-end=true], [data-range-middle=true]):where(:not(:disabled):not([aria-disabled=true]))":
        {
          "background-image":
            "linear-gradient(180deg in oklab, color-mix(in oklab, var(--accent), white var(--recess-highlight-weight)), var(--accent) 32%, var(--accent) 72%, color-mix(in oklab, var(--accent), black var(--recess-shade-weight)))",
          "box-shadow":
            "inset 0 1px 0 var(--button-paper-highlight), inset 0 -2px 0 var(--button-paper-shade)",
        },
      ".ninaero-calendar-day-button.ninaero-button:active:not(:disabled):not([aria-disabled=true])":
        {
          "box-shadow":
            "inset 0 2px 6px color-mix(in oklab, var(--background), black var(--recess-shade-weight)), inset 0 -1px 2px color-mix(in oklab, var(--background), white var(--recess-highlight-weight))",
          transform: "none",
        },
      ".ninaero-calendar-day-button.ninaero-button:is([data-selected-single=true], [data-range-start=true], [data-range-end=true], [data-range-middle=true]):active:not(:disabled):not([aria-disabled=true])":
        {
          "background-color": "var(--accent)",
          "box-shadow":
            "inset 0 1px 0 var(--button-paper-highlight), inset 0 -2px 0 var(--button-paper-shade)",
        },
      ".ninaero-calendar-day-button.ninaero-button:is([data-selected-single=true], [data-range-start=true][data-range-end=true]):active:not(:disabled):not([aria-disabled=true])":
        {
          "background-image": "none",
          "box-shadow": recessShadow("var(--accent)"),
        },
    },
    ".ninaero-calendar-day-button.ninaero-button:is(:disabled, [aria-disabled=true])": {
      color: "var(--muted-foreground)",
      opacity: "1",
      "box-shadow": "none",
    },
    ".ninaero-calendar-nav.ninaero-button:is(:disabled, [aria-disabled=true])": {
      color: "var(--muted-foreground)",
      opacity: "1",
      "box-shadow": "none",
    },
    ".ninaero-calendar-day[data-disabled][data-selected] > .ninaero-calendar-day-button": {
      "background-color": "var(--muted)",
      "border-color": "var(--neutral-input)",
    },
    "@media (forced-colors: active)": {
      ".ninaero-calendar": {
        "--ring": "Highlight",
        "--accent": "Highlight",
        "--accent-foreground": "HighlightText",
        "border-color": "CanvasText",
        "box-shadow": "none",
      },
      ".ninaero-calendar-day-button.ninaero-button": {
        "border-color": "transparent",
        "background-color": "Canvas",
        color: "CanvasText",
        "box-shadow": "none",
      },
      ".ninaero-calendar-day-button.ninaero-button:is([data-selected-single=true], [data-range-start=true], [data-range-end=true], [data-range-middle=true])":
        {
          "forced-color-adjust": "none",
          "border-color": "Highlight",
          "background-color": "Highlight",
          color: "HighlightText",
        },
      ".ninaero-calendar-day-button.ninaero-button:focus-visible": {
        "outline-color": "Highlight",
      },
      ".ninaero-calendar-day-button.ninaero-button:is([data-selected-single=true], [data-range-start=true], [data-range-end=true], [data-range-middle=true]):focus-visible":
        {
          "outline-color": "HighlightText",
        },
      ".ninaero-calendar-day-button.ninaero-button:is(:disabled, [aria-disabled=true])": {
        "forced-color-adjust": "auto",
        "border-color": "GrayText",
        "background-color": "Canvas",
        color: "GrayText",
      },
      ".ninaero-calendar-day[data-disabled][data-selected] > .ninaero-calendar-day-button": {
        "forced-color-adjust": "auto",
        "border-color": "GrayText",
        "background-color": "Canvas",
        color: "GrayText",
      },
    },
  },
});
