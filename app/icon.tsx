import { renderFrutigerDolloSvg } from "@/lib/frutiger-dollo-mark";
import { accentPresets, defaultAccent } from "@/registry/ninaero/accents.mjs";

export const contentType = "image/svg+xml";
export const size = { width: 32, height: 32 };
export const dynamic = "force-static";

export default function Icon() {
  const palette = accentPresets[defaultAccent];

  return new Response(renderFrutigerDolloSvg(palette.light, size.width, palette.dark), {
    headers: { "Content-Type": contentType },
  });
}
