const componentSpecimens = [
  {
    href: "/workshop/buttons",
    title: "Buttons",
    description: "Variants, sizes, press feedback, and accent comparisons.",
  },
  {
    href: "/workshop/inputs",
    title: "Inputs",
    description: "Editable, disabled, and invalid states.",
  },
  {
    href: "/workshop/dialog",
    title: "Dialog",
    description: "Overlay surfaces and keyboard focus.",
  },
  {
    href: "/workshop/tabs",
    title: "Tabs",
    description: "Neutral selection, keyboard focus, and action hierarchy.",
  },
  {
    href: "/workshop/slider",
    title: "Sliders",
    description: "Single values, ranges, drag feedback, and keyboard focus.",
  },
  {
    href: "/workshop/switch",
    title: "Switches",
    description: "On and off states, sizes, press feedback, and keyboard focus.",
  },
  {
    href: "/workshop/checkbox",
    title: "Checkboxes",
    description: "Checked, indeterminate, invalid, and disabled states.",
  },
  {
    href: "/workshop/radio-group",
    title: "Radio Group",
    description: "Single selection, keyboard navigation, invalid, and disabled states.",
  },
  {
    href: "/workshop/toggle",
    title: "Toggles",
    description: "Single and multiple selection, joined edges, and press feedback.",
  },
] as const;

const foundationSpecimens = [
  {
    href: "/workshop/patterns",
    title: "Patterns",
    description: "Paper textures, checkerboards, spacing, ink colors, and fills.",
  },
  {
    href: "/workshop/tokens",
    title: "Tokens",
    description: "Shared semantic colors.",
  },
] as const;

export const workshopGroups = [
  { title: "Workshop", items: [{ href: "/workshop", title: "Overview" }] },
  { title: "Components", items: componentSpecimens },
  { title: "Foundations", items: foundationSpecimens },
] as const;

export const workshopSpecimens = [...componentSpecimens, ...foundationSpecimens];
