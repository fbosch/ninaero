export const patternGuidance = {
  ruled: {
    suggestedUse: "Journal entries, notes, and line-aligned prose.",
    caution:
      "Match the line height and paragraph gaps to the rule interval. Use a plain background when alignment cannot be maintained.",
  },
  dotted: {
    suggestedUse: "Whiteboards, sketchpads, and spatial canvases.",
    caution:
      "Dots are visual guides, not a snapping system. Keep their spacing and position aligned with your canvas.",
  },
  grid: {
    suggestedUse: "Diagram editors, drawing canvases, and layout previews.",
    caution:
      "Keep the visual grid aligned with your own pan, zoom, and snapping logic. Put controls and dense content on opaque backgrounds.",
  },
  notebook: {
    suggestedUse: "Notebook-themed covers, empty states, and educational illustrations.",
    caution:
      "Use as decorative artwork, not a ruled writing surface. Keep text and controls on plain, opaque backgrounds.",
  },
  dither: {
    suggestedUse: "Illustration shading and retro or game artwork.",
    caution:
      "This is a static texture, not an image-dithering filter. Keep it off dense text and controls.",
  },
  checker: {
    suggestedUse: "Transparency previews for images, icons, and other assets.",
    caution:
      "For transparency previews, place checks behind the media, not over it. The pattern does not make opaque media transparent.",
  },
  "checker-wide": {
    suggestedUse: "Decorative banners, horizontal bands, and media frames.",
    caution:
      "Use as decoration, not a layout grid or a state indicator. The numeric size sets height; width stays twice the height.",
  },
} as const;
