import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
    .map((channel) => Number.parseInt(channel, 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first, second) {
  const [high, low] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
}

test("base materials, ordinary edges, ink, patterns, and cast shadows are grayscale in every accent and mode", () => {
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

test("popover and menu materials use the neutral card palette independently of Button materials", () => {
  for (const mode of ["light", "dark"]) {
    assert.equal(theme[mode].popover, "var(--card)");
    assert.equal(theme[mode]["popover-foreground"], "var(--card-foreground)");
  }
  const popover = theme.css["@layer components"][".ninaero-popover"];
  assert.equal(popover.border, "1px solid var(--border)");
  assert.equal(popover["background-color"], "var(--popover)");
  assert.equal(popover.color, "var(--popover-foreground)");
});

test("neutral overlay text and matte Button labels retain at least 4.5:1 contrast", () => {
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

test("neutral control edges retain at least 3:1 contrast on their resting materials", () => {
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

test("workshop frames use shared neutral borders rather than hard-coded blue edges", async () => {
  const site = await readFile(new URL("../../../app/site.css", import.meta.url), "utf8");
  const specimen = site.match(/\.button-specimen\s*\{([^}]+)\}/)?.[1];
  assert.ok(specimen);
  assert.match(specimen, /border:\s*1px solid var\(--border\)/);
  assert.doesNotMatch(site, /\.dark \.button-specimen/);
});

test("code blocks use neutral backing and base text without removing syntax-highlight colors", async () => {
  const site = await readFile(new URL("../../../app/site.css", import.meta.url), "utf8");
  const code = site.match(/\.syntax-code\s*\{([^}]+)\}/)?.[1];
  const dark = site.match(/\.dark \.syntax-code\s*\{([^}]+)\}/)?.[1];
  assert.ok(code);
  assert.ok(dark);
  assert.match(code, /background:\s*var\(--card\)/);
  assert.match(code, /color:\s*var\(--card-foreground\)/);
  assert.match(dark, /background:\s*var\(--muted\)/);
  assert.doesNotMatch(dark, /#[\da-f]+/i);
  assert.match(site, /color:\s*var\(--syntax-light, inherit\)/);
  assert.match(site, /color:\s*var\(--syntax-dark, inherit\)/);
});
