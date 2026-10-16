export const componentGuides = [
  {
    name: "data-table",
    previewPath: "components/overview/data-table-preview.tsx",
    items: ["table", "button", "input-group", "checkbox", "badge", "field"],
    packages: ["@tanstack/react-table@^9.3.1"],
    description:
      "Build a data table from Table and TanStack Table. Keep columns and features in your application rather than hiding them in one universal component.",
    upstreamUrl: "https://ui.shadcn.com/docs/components/base/data-table",
  },
  {
    name: "date-picker",
    previewPath: "components/overview/date-picker-preview.tsx",
    items: ["calendar", "popover", "button", "field"],
    packages: [],
    description:
      "A Date Picker is a composition of Calendar, Popover, and Button. Keep the selected date and open state in the component that owns the form.",
    upstreamUrl: "https://ui.shadcn.com/docs/components/base/date-picker",
  },
  {
    name: "typography",
    previewPath: "components/overview/typography-preview.tsx",
    items: ["theme", "table"],
    packages: [],
    description:
      "Typography is a styling guide, not an installable React control. Use Ninaero's shared font and semantic text colors. Upstream now documents prose styling through Typeset.",
    upstreamUrl: "https://ui.shadcn.com/docs/typeset",
  },
];

export function upstreamDocumentationUrl(name) {
  return (
    componentGuides.find((guide) => guide.name === name)?.upstreamUrl ??
    `https://ui.shadcn.com/docs/components/${name === "sonner" ? "radix" : "base"}/${name}`
  );
}
