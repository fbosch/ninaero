import { elevationVariables, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    ".ninaero-button-group": elevationVariables,
    ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator])))":
      {
        "border-radius": "var(--button-group-corner, 1rem)",
        "corner-shape": "squircle",
        "box-shadow": "var(--shadow-control)",
      },
    ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator]))):has(> .ninaero-button[data-size=xs])":
      {
        "--button-group-corner": "0.75rem",
      },
    ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator]))):has(> .ninaero-button[data-size=icon-xs])":
      {
        "--button-group-corner": "0.75rem",
      },
    ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator]))):has(> .ninaero-button[data-size=sm])":
      {
        "--button-group-corner": "0.875rem",
      },
    ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator]))):has(> .ninaero-button[data-size=icon-sm])":
      {
        "--button-group-corner": "0.875rem",
      },
    ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator]))):has(> .ninaero-button[data-size=lg])":
      {
        "--button-group-corner": "1.125rem",
      },
    ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator]))):has(> .ninaero-button[data-size=icon-lg])":
      {
        "--button-group-corner": "1.125rem",
      },
    ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator]))):has(> .ninaero-button[data-size=xl])":
      {
        "--button-group-corner": "1.5rem",
      },
    ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator]))) > .ninaero-button":
      {
        "--button-cast-shadow": "var(--shadow-flat)",
      },
    "@media (forced-colors: active)": {
      ".ninaero-button-group:has(> :is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive):not(:disabled):not([data-disabled]):not([aria-disabled=true])):not(:has(> :not(:is(.ninaero-button--primary, .ninaero-button--secondary, .ninaero-button--destructive), [data-slot=button-group-separator])))":
        {
          "box-shadow": "none",
        },
    },
  },
});
