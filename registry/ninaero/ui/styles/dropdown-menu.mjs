import { elevationVariables, menuItemCastShadow, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-dropdown-menu-item": {
      ...elevationVariables,
      "corner-shape": "round",
      outline: "2px solid transparent",
      "outline-offset": "-3px",
      transition: "background-color 80ms ease-out",
      "--ninaero-menu-item-fill": "var(--accent)",
    },
    ".ninaero-dropdown-menu-content": {
      "border-color": "color-mix(in oklab, var(--foreground) 18%, var(--popover))",
      "background-image":
        "linear-gradient(180deg in oklab, var(--popover), color-mix(in oklab, var(--popover), var(--dialog-fill-shade) 50%))",
      "box-shadow":
        "inset 0 1px 0 var(--dialog-highlight), inset 0 -1px 2px var(--dialog-shade), var(--shadow-floating)",
      "overflow-wrap": "anywhere",
      "transform-origin": "var(--transform-origin)",
      opacity: "1",
      transform: "scale(1)",
      transition: "opacity 100ms ease-out, transform 180ms cubic-bezier(0.22, 1.2, 0.35, 1)",
      "scroll-padding-block": "0.5rem",
    },
    ".ninaero-dropdown-menu-content[data-starting-style]": {
      opacity: "0",
      transform: "scale(0.96)",
    },
    ".ninaero-dropdown-menu-content[data-ending-style]": {
      opacity: "0",
      transform: "scale(0.98)",
      transition: "opacity 120ms ease-in, transform 120ms ease-in",
    },
    ".ninaero-dropdown-menu-content[data-instant]": {
      transition: "none",
    },
    ".ninaero-dropdown-menu-item:where([data-highlighted], [data-popup-open]):not([data-disabled])":
      {
        "background-color": "var(--ninaero-menu-item-fill)",
        "box-shadow": `inset 0 1px 0 color-mix(in oklab, var(--ninaero-menu-item-fill), white var(--recess-highlight-weight)), ${menuItemCastShadow}`,
        "z-index": "1",
        color: "var(--accent-foreground)",
      },
    ".ninaero-dropdown-menu-item[data-variant=destructive]": {
      color: "var(--destructive)",
      "--ninaero-menu-item-fill": "color-mix(in oklab, var(--destructive) 10%, var(--popover))",
    },
    ".ninaero-dropdown-menu-item[data-variant=destructive]:where([data-highlighted], :active):not([data-disabled])":
      {
        "background-color": "var(--ninaero-menu-item-fill)",
        color: "var(--destructive)",
      },
    ".ninaero-dropdown-menu-item:focus-visible": {
      "outline-color": "var(--ring)",
    },
    ".ninaero-dropdown-menu-item[data-disabled]": {
      color: "var(--muted-foreground)",
    },
    ".ninaero-dropdown-menu-shortcut": {
      color: "var(--muted-foreground)",
    },
    ".ninaero-dropdown-menu-item:is([data-highlighted], [data-popup-open], [data-disabled]) .ninaero-dropdown-menu-shortcut":
      {
        color: "inherit",
      },
    ".ninaero-dropdown-menu-item + .ninaero-dropdown-menu-item": {
      "margin-block-start": "0.25rem",
    },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-dropdown-menu-item": {
        transition: "none",
      },
      ".ninaero-dropdown-menu-content": {
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-dropdown-menu-content[data-starting-style]": {
        transition: "none",
        transform: "none",
        opacity: "1",
      },
      ".ninaero-dropdown-menu-content[data-ending-style]": {
        transition: "none",
        transform: "none",
        opacity: "1",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-dropdown-menu-item": {
        "forced-color-adjust": "none",
        transition: "none",
        "background-color": "Canvas",
        color: "CanvasText",
      },
      ".ninaero-dropdown-menu-item[data-variant=destructive]": {
        "forced-color-adjust": "none",
        transition: "none",
        "background-color": "Canvas",
        color: "CanvasText",
      },
      ".ninaero-dropdown-menu-item:is([data-highlighted], [data-popup-open]):not([data-disabled])":
        {
          "background-color": "Highlight",
          color: "HighlightText",
          "box-shadow": "none",
        },
      ".ninaero-dropdown-menu-item:focus-visible": {
        "outline-color": "Highlight",
      },
      ".ninaero-dropdown-menu-item[data-highlighted]:focus-visible:not([data-disabled])": {
        "outline-color": "HighlightText",
      },
      ".ninaero-dropdown-menu-item[data-disabled]": {
        color: "GrayText",
      },
      ".ninaero-dropdown-menu-shortcut": {
        color: "inherit",
      },
    },
  },
});
