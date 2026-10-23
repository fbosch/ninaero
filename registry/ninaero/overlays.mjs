import { overlayDotRadius, textureMasks } from "./patterns.mjs";

const overlayChannels = {
  multiply: "clamp(0, 2 * r / max(0.000001, 1 - alpha + alpha * 2 * g), 1)",
  screen: "clamp(0, (2 * r - alpha * 2 * g) / max(0.000001, 1 - alpha * 2 * g), 1)",
  normal: "clamp(0, (2 * r - alpha * 2 * g) / max(0.000001, 1 - alpha), 1)",
};

function overlaySurface(surface) {
  // Neutral surfaces and ink have equal RGB channels. Pack surface/ink into R/G
  // and effective opacity into alpha so relative CSS colors can invert the blend.
  const pair = `color-mix(in srgb, color(from ${surface} srgb r 0 0) 50%, color(from var(--foreground) srgb 0 g 0))`;
  const origin = `color(from ${pair} srgb r g b / var(--ninaero-overlay-effective-opacity))`;
  const channel = "var(--ninaero-overlay-compensated-channel)";
  return `color(from ${origin} srgb ${channel} ${channel} ${channel} / 1)`;
}

export const styles = {
  ":root": {
    ...textureMasks,
    "--overlay-checker-mask":
      "conic-gradient(black 25%, transparent 0 50%, black 0 75%, transparent 0)",
    "--ninaero-overlay-blend-mode": "multiply",
    "--ninaero-overlay-opacity": "0.06",
    "--ninaero-overlay-coverage": "0.5",
    "--ninaero-overlay-compensation": "1",
  },
  ".dark": { "--ninaero-overlay-blend-mode": "screen" },
  "@utility ninaero-overlay-dither": {
    isolation: "isolate",
    "@supports (color: color(from red srgb r g b)) and (opacity: calc(1px / 1px)) and (color: if(style(--ninaero-overlay-blend-mode: multiply): red))":
      {
        "--ninaero-overlay-compensated-channel": `if(${Object.entries(overlayChannels)
          .map(([mode, channel]) => `style(--ninaero-overlay-blend-mode: ${mode}): ${channel}`)
          .join("; ")}; else: calc(2 * r))`,
        "--ninaero-overlay-effective-opacity":
          "calc(clamp(0, var(--ninaero-overlay-opacity), 1) * clamp(0, var(--ninaero-overlay-coverage), 1) * clamp(0, var(--ninaero-overlay-compensation), 1))",
        "--ninaero-overlay-background": overlaySurface("var(--background)"),
        "--ninaero-overlay-card": overlaySurface("var(--card)"),
        "--ninaero-overlay-muted": overlaySurface("var(--muted)"),
        "&:where(body)": { "background-color": "var(--ninaero-overlay-background)" },
      },
    "@media (forced-colors: active), print": {
      "--ninaero-overlay-compensation": "0",
    },
    "&::after": {
      content: '""',
      position: "fixed",
      inset: "0",
      // Keep the texture below page content and portaled UI.
      "z-index": "0",
      "pointer-events": "none",
      "user-select": "none",
      "background-color": "var(--foreground)",
      "mix-blend-mode": "var(--ninaero-overlay-blend-mode)",
      "mask-image": "var(--ninaero-overlay-pattern, var(--overlay-checker-mask))",
      "mask-mode": "alpha",
      "mask-size":
        "var(--ninaero-overlay-size, var(--ninaero-overlay-tile, 2px)) var(--ninaero-overlay-size, var(--ninaero-overlay-tile, 2px))",
      "mask-repeat": "repeat",
      opacity: "var(--ninaero-overlay-opacity)",
      "@media (forced-colors: active)": { display: "none" },
      "@media print": { display: "none" },
    },
  },
  // A blended texture escapes backdrop-filter sampling; use normal blending while modals blur it.
  "body.ninaero-overlay-dither:has(.ninaero-dialog-overlay)": {
    "--ninaero-overlay-blend-mode": "normal",
  },
  "@utility ninaero-overlay-dots": {
    "--ninaero-overlay-pattern": "var(--overlay-dots-mask)",
    "--ninaero-overlay-tile": "4px",
    "--ninaero-overlay-coverage": `clamp(0, calc(pi * pow(${overlayDotRadius}px / var(--ninaero-overlay-size, var(--ninaero-overlay-tile)), 2)), 1)`,
  },
  "@utility ninaero-overlay-lines": {
    "--ninaero-overlay-pattern": "var(--overlay-lines-mask)",
    "--ninaero-overlay-tile": "4px",
    "--ninaero-overlay-coverage": "0.25",
  },
  "@utility ninaero-overlay-flipnote": {
    "--ninaero-overlay-pattern": "var(--overlay-flipnote-mask)",
    "--ninaero-overlay-tile": "8px",
    "--ninaero-overlay-coverage": "0.125",
  },
};
