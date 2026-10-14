import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";

const neutralRoles = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "sidebar",
  "sidebar-foreground",
  "sidebar-border",
  "border",
  "input",
  "neutral-border",
  "neutral-input",
  "button-paper-fill",
  "button-paper-hover",
  "button-paper-pressed",
  "button-paper-ink",
  "button-paper-edge",
  "button-outline-edge",
  "button-paper-highlight",
  "button-paper-shade",
  "paper-fill",
  "paper-rule",
  "paper-dot",
];

function resolve(palette, token) {
  const seen = new Set();
  while (true) {
    assert.ok(!seen.has(token), `cyclic color token: ${token}`);
    seen.add(token);
    const value = palette[token];
    assert.equal(typeof value, "string", `missing color token: ${token}`);
    const alias = value.match(/^var\(--([\w-]+)\)$/);
    if (!alias) return value;
    token = alias[1];
  }
}

function assertGrayscale(color, label) {
  const hex = color.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})(?:[\da-f]{2})?$/i);
  if (hex) {
    assert.equal(hex[1], hex[2], `${label}: ${color}`);
    assert.equal(hex[2], hex[3], `${label}: ${color}`);
    return;
  }
  assert.match(color, /^oklch\([\d.]+ 0 0\)$/, `${label}: ${color}`);
}

function luminance(color) {
  const oklch = color.match(/^oklch\(([\d.]+) 0 0\)$/);
  if (oklch) return Number(oklch[1]) ** 3;
  assert.match(color, /^#[\da-f]{6}$/i);
  const channels = color
    .slice(1)
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  const [high, low] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
}

test("neutral materials and ordinary edges remain grayscale across accents and modes", () => {
  for (const mode of ["light", "dark"]) {
    for (const [name, preset] of Object.entries(accentPresets)) {
      const palette = { ...theme[mode], ...preset[mode] };
      for (const token of neutralRoles) {
        assertGrayscale(resolve(palette, token), `${mode} ${name} ${token}`);
      }
      for (const token of ["shadow-color", "shadow-color-paper"]) {
        assert.match(palette[token], /^\d+deg 0% \d+%$/, `${mode} ${name} ${token}`);
      }
    }
  }
});

test("neutral overlay text and matte Button labels retain 4.5:1 contrast", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    for (const token of ["popover-foreground", "muted-foreground"]) {
      const ratio = contrast(resolve(palette, token), resolve(palette, "popover"));
      assert.ok(ratio >= 4.5, `${mode} ${token}: ${ratio.toFixed(2)}:1`);
    }
    for (const state of ["fill", "hover", "pressed"]) {
      const ratio = contrast(palette["button-paper-ink"], palette[`button-paper-${state}`]);
      assert.ok(ratio >= 4.5, `${mode} paper ${state}: ${ratio.toFixed(2)}:1`);
    }
  }
});

test("neutral control edges retain 3:1 contrast on their resting materials", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    for (const token of ["neutral-input", "button-paper-edge", "button-outline-edge"]) {
      for (const fill of ["card", "paper-fill", "button-paper-fill"]) {
        const ratio = contrast(resolve(palette, token), resolve(palette, fill));
        assert.ok(ratio >= 3, `${mode} ${token} on ${fill}: ${ratio.toFixed(2)}:1`);
      }
    }
  }
});
