import { bubbleRefractionPixels } from "@/lib/bubble-refraction.mjs";

let texture: string | undefined;

export function bubbleRefractionTexture() {
  if (texture) return texture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.putImageData(new ImageData(bubbleRefractionPixels(size), size, size), 0, 0);
  texture = canvas.toDataURL();
  return texture;
}
