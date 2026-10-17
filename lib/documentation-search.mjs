export const documentationGuides = [
  {
    title: "Installation",
    description: "Install the Ninaero preset or add individual components.",
    href: "/docs#docs-quick-start",
    keywords: ["getting started", "introduction", "setup", "registry", "shadcn"],
  },
  {
    title: "Theming",
    description: "Customize shared tokens, accent presets, and light and dark modes.",
    href: "/docs/theme",
    keywords: ["theme", "colors", "typography"],
  },
  {
    title: "Patterns",
    description: "Use paper patterns, checkerboards, and dithering.",
    href: "/docs/patterns",
    keywords: ["background", "paper", "dots", "grid", "ruled", "notebook"],
  },
  {
    title: "Site-wide overlays",
    description: "Apply a static texture across the viewport, including menus and dialogs.",
    href: "/docs/patterns#site-wide-overlays",
    keywords: [
      "overlay",
      "patterns",
      "texture",
      "checker",
      "dithering",
      "opacity",
      "blend",
      "multiply",
      "screen",
    ],
  },
];

/**
 * @template {{ title: string, description: string, keywords?: readonly string[] }} T
 * @param {readonly T[]} entries
 * @param {string} query
 * @returns {T[]}
 */
export function findDocumentation(entries, query) {
  const search = query.trim().toLowerCase();
  const terms = search.split(/\s+/).filter(Boolean);
  const rank = (entry) => {
    const title = entry.title.toLowerCase();
    return title === search ? 0 : title.startsWith(search) ? 1 : 2;
  };

  return entries
    .filter((entry) => {
      const text =
        `${entry.title} ${entry.description} ${(entry.keywords ?? []).join(" ")}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    })
    .sort((a, b) => rank(a) - rank(b));
}
