// SVG's sRGB segments approximate Oklab using a single precomputed midpoint.
export const glassGradientOffsets = [0, 50, 100];

function toOklab(hex) {
  if (typeof hex !== "string" || !/^#[0-9a-f]{6}$/i.test(hex)) {
    throw new TypeError(`Expected a six-digit sRGB hex color, received ${String(hex)}.`);
  }
  const [red, green, blue] = [1, 3, 5].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([lightness, a, b]) {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const channels = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return (
    "#" +
    channels
      .map((channel) => {
        const clamped = Math.max(0, Math.min(1, channel));
        const encoded =
          clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * clamped ** (1 / 2.4) - 0.055;
        return Math.round(encoded * 255)
          .toString(16)
          .padStart(2, "0");
      })
      .join("")
  );
}

// Run during theme/static-icon generation, never to calculate decorative colors in the browser.
export function mixOklab(start, end, amount) {
  if (!Number.isFinite(amount) || amount < 0 || amount > 1) {
    throw new RangeError("The Oklab mixing amount must be between zero and one.");
  }
  const first = toOklab(start);
  const second = toOklab(end);
  return fromOklab(first.map((value, index) => value + (second[index] - value) * amount));
}

export function createGlassGradientTokens(palette) {
  const rim = palette["button-primary-edge"];
  // Focus colors vary in brightness by preset; shade the material edge instead.
  const paths = {
    rim: [rim, mixOklab(rim, "#000000", 0.08)],
    face: [palette["button-primary-hover"], palette["button-primary-pressed"]],
  };
  return Object.fromEntries(
    Object.entries(paths).flatMap(([part, [start, end]]) =>
      glassGradientOffsets.map((offset) => [
        `glass-mark-${part}-${offset}`,
        mixOklab(start, end, offset / 100),
      ]),
    ),
  );
}

export function withGlassGradientVariables(variables) {
  const palette = Object.fromEntries(
    Object.entries(variables).map(([name, value]) => [name.slice(2), value]),
  );
  return {
    ...variables,
    ...Object.fromEntries(
      Object.entries(createGlassGradientTokens(palette)).map(([name, value]) => [
        `--${name}`,
        value,
      ]),
    ),
  };
}
