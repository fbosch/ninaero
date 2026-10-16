import assert from "node:assert/strict";
import test from "node:test";

import { accentPresets } from "../../../registry/ninaero/accents.mjs";
import { theme } from "../../../registry/ninaero/theme.mjs";

function luminance(color) {
  const oklch = color.match(/^oklch\(([\d.]+) 0 0\)$/);
  if (oklch) return Number(oklch[1]) ** 3;
  const channels = color
    .slice(1)
    .match(/../g)
    .map((channel) => {
      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function composite(foreground, background) {
  const alpha = Number.parseInt(foreground.slice(7, 9) || "ff", 16) / 255;
  const channels = [1, 3, 5].map((offset) => {
    const front = Number.parseInt(foreground.slice(offset, offset + 2), 16);
    const back = Number.parseInt(background.slice(offset, offset + 2), 16);
    return Math.round(front * alpha + back * (1 - alpha))
      .toString(16)
      .padStart(2, "0");
  });
  return `#${channels.join("")}`;
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function selectedTones(palette) {
  return ["tabs-active-top", "tabs-active-fill", "tabs-active-bottom"].flatMap((token) => [
    palette[token],
    composite(palette["tabs-active-highlight"], palette[token]),
  ]);
}

test("tab labels retain AA contrast across neutral materials, presets, and color modes", () => {
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = { ...theme[mode], ...preset[mode] };
      const backgrounds = [
        palette["tabs-track-fill"],
        composite(palette["tabs-track-shade"], palette["tabs-track-fill"]),
        palette["tabs-hover-fill"],
      ];
      for (const background of backgrounds) {
        const ratio = contrast(palette["tabs-ink"], background);
        assert.ok(ratio >= 4.5, `${name} ${mode} inactive label: ${ratio.toFixed(2)}:1`);
      }
      for (const background of [...selectedTones(palette), palette["tabs-hover-fill"]]) {
        const ratio = contrast(palette.foreground, background);
        assert.ok(ratio >= 4.5, `${name} ${mode} selected label: ${ratio.toFixed(2)}:1`);
      }
    }
  }
});

test("selected tab boundaries retain 3:1 contrast against the track and raised material", () => {
  for (const mode of ["light", "dark"]) {
    const palette = theme[mode];
    for (const background of [
      palette["tabs-track-fill"],
      composite(palette["tabs-track-shade"], palette["tabs-track-fill"]),
      ...selectedTones(palette),
    ]) {
      const ratio = contrast(palette["tabs-active-edge"], background);
      assert.ok(ratio >= 3, `${mode} selection boundary: ${ratio.toFixed(2)}:1`);
    }
  }
});

test("underline labels and accent markers retain contrast on page and card surfaces", () => {
  for (const [name, preset] of Object.entries(accentPresets)) {
    for (const mode of ["light", "dark"]) {
      const palette = { ...theme[mode], ...preset[mode] };
      for (const background of [palette.background, palette.card]) {
        for (const ink of [palette["tabs-ink"], palette.foreground]) {
          const ratio = contrast(ink, background);
          assert.ok(ratio >= 4.5, `${name} ${mode} underline label: ${ratio.toFixed(2)}:1`);
        }
        const marker = contrast(palette["button-primary-edge"], background);
        assert.ok(marker >= 3, `${name} ${mode} selection marker: ${marker.toFixed(2)}:1`);
      }
    }
  }
});
