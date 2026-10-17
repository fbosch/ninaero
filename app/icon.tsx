import { renderNinaeroIconSvg } from "@/lib/ninaero-mark.mjs";
import { glassGradientOffsets } from "@/registry/ninaero/glass-materials.mjs";
import { glassMarkForcedColors, theme } from "@/registry/ninaero/theme.mjs";

export const contentType = "image/svg+xml";
export const size = { width: 32, height: 32 };
export const dynamic = "force-static";

function paletteVariables(palette: Readonly<Record<string, string>>) {
  const names = glassGradientOffsets.flatMap((offset) => [
    `glass-mark-rim-${offset}`,
    `glass-mark-face-${offset}`,
  ]);
  names.push("button-highlight");
  return names.map((name) => `--${name}:${palette[name]};`).join("");
}

export default function Icon() {
  const forcedColors = Object.entries<Record<string, string>>(glassMarkForcedColors)
    .map(
      ([selector, properties]) =>
        `${selector}{${Object.entries(properties)
          .map(([name, value]) => `${name}:${value};`)
          .join("")}}`,
    )
    .join("");
  const styles = `svg{${paletteVariables(theme.light)}}@media(prefers-color-scheme:dark){svg{${paletteVariables(theme.dark)}}}@media(forced-colors:active){${forcedColors}}`;

  return new Response(renderNinaeroIconSvg(styles, size.width), {
    headers: { "Content-Type": contentType },
  });
}
