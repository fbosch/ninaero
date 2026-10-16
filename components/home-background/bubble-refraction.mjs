export const bubbleRefractionStrength = 0.25;

export function bubbleRefractionPixels(size = 64) {
  if (!Number.isInteger(size) || size < 4 || size > 256) {
    throw new RangeError("Refraction map size must be an integer between 4 and 256");
  }
  const pixels = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = ((x + 0.5) / size) * 2 - 1;
      const ny = ((y + 0.5) / size) * 2 - 1;
      // Sampling inward magnifies the centre; zero displacement and slope at the rim avoid a seam.
      const falloff = Math.max(0, 1 - nx * nx - ny * ny) ** 2;
      const offset = (y * size + x) * 4;
      pixels[offset] = Math.round((0.5 - nx * falloff * 0.5) * 255);
      pixels[offset + 1] = Math.round((0.5 - ny * falloff * 0.5) * 255);
      pixels[offset + 2] = 128;
      pixels[offset + 3] = 255;
    }
  }
  return pixels;
}
