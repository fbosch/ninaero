import { elevationVariables, recessShadow, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-button": {
      ...elevationVariables,
      "--button-corner": "1rem",
      "--button-press-shift": "1px",
      "--button-recess-fill": "var(--background)",
      "border-radius": "var(--button-corner)",
      "corner-shape": "squircle",
      border: "1px solid transparent",
      outline: "2px solid transparent",
      "outline-offset": "3px",
      transition:
        "background-color 80ms ease-out, border-color 80ms ease-out, box-shadow 80ms ease-out, transform 80ms ease-out",
    },
    ".ninaero-rounded-control": {
      "border-radius": "var(--radius-md)",
      "corner-shape": "round",
    },
    ".ninaero-button[data-slot=combobox-trigger]": {
      "border-radius": "var(--radius-md)",
      "corner-shape": "round",
    },
    ".ninaero-button[data-slot=combobox-chip-remove]": {
      "border-radius": "var(--radius-md)",
      "corner-shape": "round",
    },
    ".ninaero-button--primary": {
      "--button-recess-fill": "var(--button-primary-pressed)",
      color: "var(--button-primary-ink)",
      "text-shadow": "0 0.5px 0 color-mix(in oklab, var(--button-primary-fill), white 60%)",
      "background-color": "var(--button-primary-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--button-highlight), transparent 65%)",
      "border-color": "var(--button-primary-edge)",
      "box-shadow":
        "inset 0 1px 0 var(--button-highlight), var(--button-cast-shadow, var(--shadow-control))",
    },
    ".ninaero-button--secondary": {
      "--button-recess-fill": "var(--button-paper-pressed)",
      color: "var(--button-paper-ink)",
      "text-shadow": "var(--button-paper-text-shadow)",
      "border-color": "var(--button-paper-edge)",
      "background-color": "var(--button-paper-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--button-paper-highlight), transparent 55%, var(--button-paper-shade))",
      "box-shadow":
        "inset 0 1px 0 var(--button-paper-highlight), inset 0 -1px 0 var(--button-paper-shade), var(--button-cast-shadow, var(--shadow-control))",
    },
    ".ninaero-button--outline": {
      "--button-recess-fill": "var(--button-paper-pressed)",
      color: "var(--button-paper-ink)",
      "text-shadow": "var(--button-paper-text-shadow)",
      "border-color": "var(--button-outline-edge)",
      "background-color": "var(--background)",
      "box-shadow":
        "inset 0 1px 0 var(--button-paper-highlight), inset 0 -1px 0 var(--button-paper-shade), 0 1px 2px hsl(var(--shadow-color) / 0.08)",
    },
    ".ninaero-button--destructive": {
      "--button-recess-fill": "var(--button-destructive-pressed)",
      color: "var(--button-destructive-ink)",
      "text-shadow": "0 0.5px 0 color-mix(in oklab, var(--button-destructive-fill), white 60%)",
      "background-color": "var(--button-destructive-fill)",
      "background-image":
        "linear-gradient(180deg in oklab, var(--button-destructive-highlight), transparent 55%, var(--button-destructive-shade))",
      "border-color": "var(--button-destructive-edge)",
      "box-shadow":
        "inset 0 1px 0 var(--button-destructive-highlight), inset 0 -1px 0 var(--button-destructive-shade), var(--button-cast-shadow, var(--shadow-control))",
    },
    ".ninaero-button--ghost": {
      color: "var(--button-paper-ink)",
    },
    ".ninaero-button--link": {
      color: "var(--button-link-ink)",
      "text-underline-offset": "4px",
    },
    ".ninaero-button--outline[aria-expanded=true]": {
      "background-color": "var(--button-paper-hover)",
    },
    ".ninaero-button--secondary[aria-expanded=true]": {
      "background-color": "var(--button-paper-hover)",
    },
    ".ninaero-button--ghost[aria-expanded=true]": {
      "background-color": "var(--button-paper-hover)",
    },
    ".ninaero-button[aria-invalid=true]": {
      "border-color": "var(--button-destructive-edge)",
    },
    ".ninaero-button:disabled": {
      "box-shadow": "none",
      "text-shadow": "none",
      opacity: "0.5",
    },
    ".ninaero-button[data-disabled]": {
      "box-shadow": "none",
      "text-shadow": "none",
      opacity: "0.5",
    },
    ".ninaero-button[aria-disabled=true]": {
      "box-shadow": "none",
      "text-shadow": "none",
      opacity: "0.5",
    },
    "@media (hover: hover)": {
      ".ninaero-button--primary:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "var(--button-primary-hover)",
          "--button-hover-glow":
            "color-mix(in oklab, var(--button-primary-fill), var(--button-primary-edge) 20%)",
          "background-image":
            "linear-gradient(180deg in oklab, color-mix(in oklab, var(--button-highlight), white 55%), transparent 50%)",
          "box-shadow":
            "inset 0 1px 0 color-mix(in oklab, var(--button-highlight), white 60%), var(--button-cast-shadow, var(--shadow-control)), 0 1px 3px color-mix(in oklab, var(--button-hover-glow) 9%, transparent), 0 3px 8px color-mix(in oklab, var(--button-hover-glow) 6%, transparent), 0 6px 16px color-mix(in oklab, var(--button-hover-glow) 3%, transparent)",
        },
      ".ninaero-button--secondary:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "var(--button-paper-hover)",
        },
      ".ninaero-button--outline:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "var(--button-paper-hover)",
        },
      ".ninaero-button--ghost:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "var(--button-paper-hover)",
        },
      ".ninaero-button--destructive:hover:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
        {
          "background-color": "var(--button-destructive-hover)",
        },
      ".ninaero-button--link:hover": {
        "text-decoration-line": "underline",
      },
    },
    ".ninaero-button--primary:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
      {
        "background-color": "var(--button-primary-pressed)",
        "background-image": "none",
      },
    ".ninaero-button--secondary:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
      {
        "background-color": "var(--button-paper-pressed)",
        "background-image": "none",
      },
    ".ninaero-button--outline:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
      {
        "background-color": "var(--button-paper-pressed)",
        "background-image": "none",
      },
    ".ninaero-button--destructive:active:not(:disabled):not([data-disabled]):not([aria-disabled=true])":
      {
        "background-color": "var(--button-destructive-pressed)",
        "background-image": "none",
      },
    ".ninaero-button:active:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-haspopup]):not(.ninaero-button--link):not(.ninaero-button--ghost:not([data-slot=code-block-copy-button]))":
      {
        transform: "translateY(var(--button-press-shift))",
        "text-shadow": "none",
        "box-shadow": recessShadow("var(--button-recess-fill)"),
      },
    "@media (prefers-reduced-motion: reduce)": {
      ".ninaero-button": {
        transition: "none",
        "--button-press-shift": "0px",
      },
    },
    "@media (forced-colors: active)": {
      ".ninaero-button": {
        "background-image": "none",
        "border-color": "ButtonText",
        "box-shadow": "none",
        "text-shadow": "none",
      },
      ".ninaero-button:active:not(:disabled):not([data-disabled]):not([aria-disabled=true]):not([aria-haspopup]):not(.ninaero-button--link):not(.ninaero-button--ghost:not([data-slot=code-block-copy-button]))":
        {
          "box-shadow": "none",
        },
      ".ninaero-button[aria-invalid=true]": {
        "border-color": "ButtonText",
      },
      ".ninaero-button:focus-visible": {
        "outline-color": "Highlight",
      },
      ".ninaero-button:disabled": {
        "border-color": "GrayText",
      },
      ".ninaero-button[data-disabled]": {
        "border-color": "GrayText",
      },
      ".ninaero-button[aria-disabled=true]": {
        "border-color": "GrayText",
      },
    },
  },
});
