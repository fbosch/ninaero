import { shadowSurface, withMaterialShadows } from "../../theme.mjs";

export const styles = withMaterialShadows({
  "@layer components": {
    "[data-slot=bubble][data-variant=default] > [data-slot=bubble-content]": {
      "--ninaero-bubble-shadow-surface": "var(--primary)",
    },
    "[data-slot=bubble][data-variant=default] > [data-slot=bubble-content]:is(button,a):hover": {
      "--ninaero-bubble-shadow-surface":
        "color-mix(in srgb, var(--primary) 80%, var(--shadow-surface))",
    },
    "[data-slot=bubble][data-variant=secondary] > [data-slot=bubble-content]": {
      "--ninaero-bubble-shadow-surface": "var(--secondary)",
    },
    "[data-slot=bubble][data-variant=secondary] > [data-slot=bubble-content]:is(button,a):hover": {
      "--ninaero-bubble-shadow-surface":
        "color-mix(in oklch, var(--secondary), var(--foreground) 5%)",
    },
    "[data-slot=bubble][data-variant=muted] > [data-slot=bubble-content]": {
      "--ninaero-bubble-shadow-surface": "var(--muted)",
    },
    "[data-slot=bubble][data-variant=muted] > [data-slot=bubble-content]:is(button,a):hover": {
      "--ninaero-bubble-shadow-surface": "color-mix(in oklch, var(--muted), var(--foreground) 5%)",
    },
    "[data-slot=bubble][data-variant=tinted] > [data-slot=bubble-content]": {
      "--ninaero-bubble-shadow-surface": "oklch(from var(--primary) 0.93 calc(c * 0.4) h)",
    },
    "[data-slot=bubble][data-variant=tinted] > [data-slot=bubble-content]:is(button,a):hover": {
      "--ninaero-bubble-shadow-surface": "oklch(from var(--primary) 0.88 calc(c * 0.5) h)",
    },
    ".dark [data-slot=bubble][data-variant=tinted] > [data-slot=bubble-content]": {
      "--ninaero-bubble-shadow-surface": "oklch(from var(--primary) 0.3 calc(c * 0.4) h)",
    },
    ".dark [data-slot=bubble][data-variant=tinted] > [data-slot=bubble-content]:is(button,a):hover":
      {
        "--ninaero-bubble-shadow-surface": "oklch(from var(--primary) 0.35 calc(c * 0.5) h)",
      },
    "[data-slot=bubble][data-variant=outline] > [data-slot=bubble-content]": {
      "--ninaero-bubble-shadow-surface": "var(--background)",
    },
    "[data-slot=bubble][data-variant=outline] > [data-slot=bubble-content]:is(button,a):hover": {
      "--ninaero-bubble-shadow-surface": "var(--muted)",
    },
    ".dark [data-slot=bubble][data-variant=outline] > [data-slot=bubble-content]:is(button,a):hover":
      {
        "--ninaero-bubble-shadow-surface":
          "color-mix(in srgb, var(--input) 30%, var(--shadow-surface))",
      },
    "[data-slot=bubble][data-variant=ghost] > [data-slot=bubble-content]": {
      "--ninaero-bubble-shadow-surface": "var(--shadow-surface)",
    },
    "[data-slot=bubble][data-variant=ghost] > [data-slot=bubble-content]:is(button,a):hover": {
      "--ninaero-bubble-shadow-surface": "var(--muted)",
    },
    ".dark [data-slot=bubble][data-variant=ghost] > [data-slot=bubble-content]:is(button,a):hover":
      {
        "--ninaero-bubble-shadow-surface":
          "color-mix(in srgb, var(--muted) 50%, var(--shadow-surface))",
      },
    "[data-slot=bubble][data-variant=destructive] > [data-slot=bubble-content]": {
      "--ninaero-bubble-shadow-surface":
        "color-mix(in srgb, var(--destructive) 10%, var(--shadow-surface))",
    },
    "[data-slot=bubble][data-variant=destructive] > [data-slot=bubble-content]:is(button,a):hover":
      {
        "--ninaero-bubble-shadow-surface":
          "color-mix(in srgb, var(--destructive) 20%, var(--shadow-surface))",
      },
    ".dark [data-slot=bubble][data-variant=destructive] > [data-slot=bubble-content]": {
      "--ninaero-bubble-shadow-surface":
        "color-mix(in srgb, var(--destructive) 20%, var(--shadow-surface))",
    },
    ".dark [data-slot=bubble][data-variant=destructive] > [data-slot=bubble-content]:is(button,a):hover":
      {
        "--ninaero-bubble-shadow-surface":
          "color-mix(in srgb, var(--destructive) 30%, var(--shadow-surface))",
      },
    "[data-slot=bubble] > [data-slot=bubble-content] > *": shadowSurface(
      "var(--ninaero-bubble-shadow-surface)",
    ),
  },
});
