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
    href: "/workshop/code-block",
    title: "Code Block",
    description: "Highlighted code, diffs, wrapping, copying, and keyboard focus.",
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
  {
    href: "/workshop/tooltip",
    title: "Tooltips",
    description: "Floating hints, placement, keyboard focus, wrapping, and RTL.",
  },
  {
    href: "/workshop/popover",
    title: "Popovers",
    description: "Floating panels, forms, placement, dismissal, and keyboard focus.",
  },
  {
    href: "/workshop/dropdown-menu",
    title: "Dropdown Menu",
    description: "Actions, checked items, submenus, placement, and keyboard navigation.",
  },
  {
    href: "/workshop/field",
    title: "Fields",
    description: "Labels, descriptions, errors, orientation, choice cards, and states.",
  },
  {
    href: "/workshop/card",
    title: "Cards",
    description: "Paper panels, sizes, header actions, footers, images, and RTL.",
  },
  {
    href: "/workshop/combobox",
    title: "Combobox",
    description:
      "Search, single and multiple selection, chips, field states, and keyboard navigation.",
  },
  {
    href: "/workshop/calendar",
    title: "Calendar",
    description: "Single dates, ranges, unavailable dates, month navigation, and keyboard focus.",
  },
  {
    href: "/workshop/accordion",
    title: "Accordion",
    description:
      "Disclosure rows, multiple expansion, disabled states, wrapping, and keyboard focus.",
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
