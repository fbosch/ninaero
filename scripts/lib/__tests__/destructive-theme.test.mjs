import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";

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

function channels(color) {
  const neutral = color.match(/^oklch\(([\d.]+) 0 0\)$/);
  if (neutral) {
    const linear = Number(neutral[1]) ** 3;
    const channel = linear <= 0.0031308 ? linear * 12.92 : 1.055 * linear ** (1 / 2.4) - 0.055;
    return [channel, channel, channel];
  }
  assert.match(color, /^#[\da-f]{6}$/i);
  return color
    .slice(1)
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16) / 255);
}

function luminance(channels) {
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

for (const mode of ["light", "dark"]) {
  test(`${mode} destructive text and invalid edges retain contrast across accent presets`, () => {
    for (const [name, preset] of Object.entries(accentPresets)) {
      const palette = { ...theme[mode], ...preset[mode] };
      assert.equal(palette.destructive, theme[mode].destructive, `${name} status color`);
      const ink = channels(resolve(palette, "destructive"));
      for (const surface of [
        "background",
        "card",
        "popover",
        "muted",
        "input-fill",
        "accent-soft",
      ]) {
        const ratio = contrast(ink, channels(resolve(palette, surface)));
        assert.ok(ratio >= 4.5, `${name} on ${surface}: ${ratio.toFixed(2)}:1`);
      }
    }
  });

  test(`${mode} destructive feedback remains readable on tinted paper and panels`, () => {
    const palette = theme[mode];
    const ink = channels(resolve(palette, "destructive"));
    const opacities = mode === "light" ? [0.1, 0.2] : [0.2, 0.3];
    for (const surface of ["background", "card"]) {
      const background = channels(resolve(palette, surface));
      for (const opacity of opacities) {
        const tinted = ink.map(
          (channel, index) => channel * opacity + background[index] * (1 - opacity),
        );
        const ratio = contrast(ink, tinted);
        assert.ok(ratio >= 4.5, `${surface} at ${opacity}: ${ratio.toFixed(2)}:1`);
      }
    }
  });
}
