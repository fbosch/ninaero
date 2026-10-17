import assert from "node:assert/strict";
import test from "node:test";

import { theme } from "../../../registry/ninaero/theme.mjs";

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const [mode, palette] of [
  ["light", theme.light],
  ["dark", theme.dark],
]) {
  test(`${mode} primary and paper labels meet 4.5:1 across fill and hover states`, () => {
    for (const material of ["primary", "paper"]) {
      for (const state of ["fill", "hover"]) {
        const ratio = contrast(
          palette[`button-${material}-ink`],
          palette[`button-${material}-${state}`],
        );
        assert.ok(ratio >= 4.5, `${material} ${state}: ${ratio.toFixed(2)}:1`);
      }
    }
  });

  test(`${mode} keyboard focus meets 3:1 on paper`, () => {
    const ratio = contrast(palette["button-focus"], palette["button-paper-fill"]);
    assert.ok(ratio >= 3, `focus: ${ratio.toFixed(2)}:1`);
  });
}
