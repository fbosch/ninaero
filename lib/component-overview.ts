export const componentGroups = [
  {
    id: "controls",
    title: "Controls",
    description: "Buttons, inputs, selections, and form composition.",
    items: [
      { name: "date-picker", description: "Compose Calendar and Popover to choose a date." },
      {
        name: "data-table",
        description: "Build sorting, filtering, and pagination with TanStack Table.",
      },
      {
        name: "button",
        description: "Actions in default, secondary, and outline variants.",
      },
      {
        name: "button-group",
        description: "Related actions arranged as one control.",
      },
      { name: "calendar", description: "A month grid for choosing a date." },
      {
        name: "checkbox",
        description: "Independent choices with checked and unchecked states.",
      },
      {
        name: "combobox",
        description: "An input that filters a list of options.",
      },
      {
        name: "command",
        description: "Searchable commands grouped in a compact list.",
      },
      {
        name: "field",
        description: "A control with its label and supporting description.",
      },
      {
        name: "input",
        description: "Single-line text entry and disabled states.",
      },
      {
        name: "input-group",
        description: "Text entry with an icon or other adornment.",
      },
      {
        name: "input-otp",
        description: "One cell per character of a verification code.",
      },
      {
        name: "label",
        description: "An accessible name associated with a control.",
      },
      {
        name: "native-select",
        description: "A select using the browser's native option picker.",
      },
      {
        name: "questionnaire",
        description: "Questions presented one step at a time.",
      },
      {
        name: "radio-group",
        description: "One selection from a set of choices.",
      },
      {
        name: "select",
        description: "A trigger and popup list for choosing an option.",
      },
      {
        name: "slider",
        description: "A value adjusted along a horizontal track.",
      },
      { name: "switch", description: "A setting with on and off states." },
      {
        name: "textarea",
        description: "Text entry with room for multiple lines.",
      },
      { name: "toggle", description: "A button that keeps its pressed state." },
      {
        name: "toggle-group",
        description: "Related buttons with shared selection behavior.",
      },
    ],
  },
  {
    id: "navigation",
    title: "Navigation",
    description: "Menus, tabs, paths, and expandable sections.",
    items: [
      {
        name: "accordion",
        description: "Sections expanded from labeled triggers.",
      },
      {
        name: "breadcrumb",
        description: "A path with a distinct current location.",
      },
      {
        name: "collapsible",
        description: "Content shown and hidden by a single trigger.",
      },
      {
        name: "context-menu",
        description: "A menu opened from a contextual action.",
      },
      {
        name: "dropdown-menu",
        description: "A popup menu anchored to an action button.",
      },
      { name: "menubar", description: "A row of menus for related commands." },
      {
        name: "navigation-menu",
        description: "Navigation links with expandable panels.",
      },
      { name: "pagination", description: "Controls for moving between pages." },
      {
        name: "tabs",
        description: "Switch between related panels in the same space.",
      },
    ],
  },
  {
    id: "overlays",
    title: "Overlays and notifications",
    description: "Dialogs, contextual surfaces, and transient messages.",
    items: [
      {
        name: "alert-dialog",
        description: "A modal confirmation with explicit choices.",
      },
      {
        name: "dialog",
        description: "A modal surface with managed keyboard focus.",
      },
      { name: "drawer", description: "A panel that slides from an edge." },
      {
        name: "hover-card",
        description: "Additional context for a hovered or focused link.",
      },
      { name: "popover", description: "A small panel anchored to a trigger." },
      {
        name: "sheet",
        description: "A dialog positioned along an edge of the viewport.",
      },
      {
        name: "sonner",
        description: "Toast notifications provided by Sonner.",
      },
      {
        name: "toast",
        description: "Toast notifications using Base UI primitives.",
      },
      {
        name: "tooltip",
        description: "A short description on hover or keyboard focus.",
      },
    ],
  },
  {
    id: "display",
    title: "Content and layout",
    description: "Surfaces, data, messages, and layout primitives.",
    items: [
      {
        name: "code-block",
        description: "Code, terminal output, and diffs with optional syntax highlighting.",
      },
      { name: "trace", description: "Reasoning, tool calls, sources, and agent activity." },
      { name: "typography", description: "Readable prose with a shared type scale and rhythm." },
      {
        name: "alert",
        description: "A notice with a title and supporting text.",
      },
      {
        name: "aspect-ratio",
        description: "A surface that keeps a fixed width-to-height ratio.",
      },
      {
        name: "attachment",
        description: "A file with its name, type, and attachment state.",
      },
      {
        name: "avatar",
        description: "An identity represented by initials or an image.",
      },
      { name: "badge", description: "A compact status label or count." },
      {
        name: "bubble",
        description: "Message content in contrasting conversational surfaces.",
      },
      {
        name: "card",
        description: "A surface with a title, description, and content.",
      },
      {
        name: "carousel",
        description: "A horizontal sequence with previous and next controls.",
      },
      {
        name: "chart",
        description: "Data using the theme's chart colors and tooltip surface.",
      },
      {
        name: "direction",
        description: "Directional context for left-to-right and right-to-left layouts.",
      },
      {
        name: "empty",
        description: "An empty state with a title and explanation.",
      },
      {
        name: "item",
        description: "A structured row with media and supporting content.",
      },
      {
        name: "kbd",
        description: "A visual representation of a keyboard shortcut.",
      },
      {
        name: "marker",
        description: "An annotation marker with contextual content.",
      },
      {
        name: "message",
        description: "An author, message content, and timestamp.",
      },
      {
        name: "message-scroller",
        description: "A scrollable conversation with a return-to-bottom control.",
      },
      {
        name: "progress",
        description: "A determinate progress indicator shown as a specimen.",
      },
      {
        name: "resizable",
        description: "Adjacent panels separated by a draggable handle.",
      },
      {
        name: "scroll-area",
        description: "Scrollable content with a themed track.",
      },
      {
        name: "separator",
        description: "A rule that divides related content.",
      },
      {
        name: "sidebar",
        description: "A navigation panel contained within the preview.",
      },
      {
        name: "skeleton",
        description: "Placeholder shapes shown as a loading-state specimen.",
      },
      {
        name: "spinner",
        description: "An indeterminate activity indicator shown as a specimen.",
      },
      {
        name: "table",
        description: "Tabular data with headings and aligned cells.",
      },
    ],
  },
] as const;

export type ControlName = (typeof componentGroups)[0]["items"][number]["name"];
export type NavigationName = (typeof componentGroups)[1]["items"][number]["name"];
export type OverlayName = (typeof componentGroups)[2]["items"][number]["name"];
export type DisplayName = (typeof componentGroups)[3]["items"][number]["name"];
export type ComponentName = ControlName | NavigationName | OverlayName | DisplayName;

export type PreviewProps = { interactive?: boolean };

export const overviewItems = componentGroups
  .flatMap<{
    name: ComponentName;
    description: string;
  }>((group) => group.items)
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

export const upstreamItems = overviewItems.filter((item) => item.name !== "sonner");
export const extraItems = overviewItems.filter((item) => item.name === "sonner");
export const newComponentNames = ["code-block", "trace"] as const;
const titles: Partial<Record<ComponentName, string>> = {
  "input-otp": "Input OTP",
  kbd: "Kbd",
  sonner: "Sonner",
};

export function componentTitle(name: ComponentName) {
  return (
    titles[name] ??
    name
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export function matchesComponent(
  item: { name: ComponentName; description: string },
  query: string,
) {
  const term = query.trim().toLowerCase();
  return `${item.name} ${componentTitle(item.name)} ${item.description}`
    .toLowerCase()
    .includes(term);
}

export function isComponentName(value: string): value is ComponentName {
  return overviewItems.some((item) => item.name === value);
}
