import { glassGradientOffsets } from "../registry/ninaero/glass-materials.mjs";

export const ninaeroMarkViewBox = "0 0 24 24";

// Share SVG data without bringing a React DOM server renderer into Next metadata.
export function ninaeroMarkElements(gradientId) {
  const id =
    "ninaero-" +
    Array.from(gradientId, (character) => character.codePointAt(0).toString(16)).join("-");
  const rimStops = glassGradientOffsets.map((offset) => ({
    tag: "stop",
    attributes: { offset: `${offset}%`, stopColor: `var(--glass-mark-rim-${offset})` },
  }));
  return [
    {
      tag: "defs",
      attributes: {},
      children: [
        {
          tag: "linearGradient",
          attributes: { id, x1: "0%", y1: "0%", x2: "0%", y2: "100%", colorInterpolation: "sRGB" },
          children: rimStops,
        },
        // Curvature concentrates the membrane's color at its edge, not its center.
        {
          tag: "radialGradient",
          attributes: {
            id: `${id}-body`,
            cx: "50%",
            cy: "50%",
            r: "50%",
            colorInterpolation: "sRGB",
          },
          children: [
            { offset: "0%", stopColor: "var(--glass-mark-face-0)", stopOpacity: 0.22 },
            { offset: "40%", stopColor: "var(--glass-mark-face-0)", stopOpacity: 0.28 },
            { offset: "70%", stopColor: "var(--glass-mark-face-50)", stopOpacity: 0.5 },
            { offset: "100%", stopColor: "var(--glass-mark-face-100)", stopOpacity: 0.82 },
          ].map((attributes) => ({ tag: "stop", attributes })),
        },
      ],
    },
    {
      tag: "g",
      attributes: {
        fill: "none",
        stroke: `url(#${id})`,
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
      children: [
        {
          tag: "circle",
          attributes: {
            className: "ninaero-mark-face",
            cx: 12,
            cy: 12,
            r: 9.25,
            fill: `url(#${id}-body)`,
          },
        },
        {
          tag: "path",
          attributes: {
            className: "ninaero-mark-highlight",
            d: "M8 7a6.5 6.5 0 0 1 8 0",
            stroke: "var(--button-highlight)",
            strokeWidth: 2,
          },
        },
      ],
    },
  ];
}

const xmlAttributeNames = {
  className: "class",
  strokeWidth: "stroke-width",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  stopOpacity: "stop-opacity",
  colorInterpolation: "color-interpolation",
  stopColor: "stop-color",
};
const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
const escapeXml = (value) => String(value).replace(/[&<>"']/g, (character) => entities[character]);

function serializeElement(element) {
  const attributes = Object.entries(element.attributes)
    .map(([name, value]) => ` ${xmlAttributeNames[name] ?? name}="${escapeXml(value)}"`)
    .join("");
  return `<${element.tag}${attributes}>${(element.children ?? []).map(serializeElement).join("")}</${element.tag}>`;
}

export function renderNinaeroIconSvg(styles, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${ninaeroMarkViewBox}"><style>${escapeXml(styles)}</style>${ninaeroMarkElements("favicon").map(serializeElement).join("")}</svg>`;
}
