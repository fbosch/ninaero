"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { ComponentName, PreviewProps } from "@/lib/component-overview";

const previews = {
  button: dynamic(() => import("./button-preview").then((module) => module.ButtonPreview)),
  "button-group": dynamic(() =>
    import("./button-group-preview").then((module) => module.ButtonGroupPreview),
  ),
  calendar: dynamic(() => import("./calendar-preview")),
  checkbox: dynamic(() => import("./checkbox-preview").then((module) => module.CheckboxPreview)),
  combobox: dynamic(() => import("./combobox-preview").then((module) => module.ComboboxPreview)),
  command: dynamic(() => import("./command-preview").then((module) => module.CommandPreview)),
  field: dynamic(() => import("./field-preview").then((module) => module.FieldPreview)),
  input: dynamic(() => import("./input-preview").then((module) => module.InputPreview)),
  "data-table": dynamic(() => import("./data-table-preview")),
  "date-picker": dynamic(() => import("./date-picker-preview")),
  "input-group": dynamic(() =>
    import("./input-group-preview").then((module) => module.InputGroupPreview),
  ),
  "input-otp": dynamic(() =>
    import("./input-otp-preview").then((module) => module.InputOTPPreview),
  ),
  label: dynamic(() => import("./label-preview").then((module) => module.LabelPreview)),
  "native-select": dynamic(() =>
    import("./native-select-preview").then((module) => module.NativeSelectPreview),
  ),
  questionnaire: dynamic(() => import("./questionnaire-preview")),
  "radio-group": dynamic(() =>
    import("./radio-group-preview").then((module) => module.RadioGroupPreview),
  ),
  select: dynamic(() => import("./select-preview").then((module) => module.SelectPreview)),
  slider: dynamic(() => import("./slider-preview").then((module) => module.SliderPreview)),
  "sound-provider": dynamic(() => import("./sound-provider-preview")),
  switch: dynamic(() => import("./switch-preview").then((module) => module.SwitchPreview)),
  textarea: dynamic(() => import("./textarea-preview").then((module) => module.TextareaPreview)),
  toggle: dynamic(() => import("./toggle-preview").then((module) => module.TogglePreview)),
  "toggle-group": dynamic(() =>
    import("./toggle-group-preview").then((module) => module.ToggleGroupPreview),
  ),
  accordion: dynamic(() => import("./accordion-preview").then((module) => module.AccordionPreview)),
  breadcrumb: dynamic(() =>
    import("./breadcrumb-preview").then((module) => module.BreadcrumbPreview),
  ),
  collapsible: dynamic(() =>
    import("./collapsible-preview").then((module) => module.CollapsiblePreview),
  ),
  "context-menu": dynamic(() =>
    import("./context-menu-preview").then((module) => module.ContextMenuPreview),
  ),
  "dropdown-menu": dynamic(() =>
    import("./dropdown-menu-preview").then((module) => module.DropdownMenuPreview),
  ),
  menubar: dynamic(() => import("./menubar-preview").then((module) => module.MenubarPreview)),
  "navigation-menu": dynamic(() =>
    import("./navigation-menu-preview").then((module) => module.NavigationMenuPreview),
  ),
  pagination: dynamic(() =>
    import("./pagination-preview").then((module) => module.PaginationPreview),
  ),
  tabs: dynamic(() => import("./tabs-preview").then((module) => module.TabsPreview)),
  "alert-dialog": dynamic(() =>
    import("./alert-dialog-preview").then((module) => module.AlertDialogPreview),
  ),
  dialog: dynamic(() => import("./dialog-preview").then((module) => module.DialogPreview)),
  drawer: dynamic(() => import("./drawer-preview").then((module) => module.DrawerPreview)),
  "hover-card": dynamic(() =>
    import("./hover-card-preview").then((module) => module.HoverCardPreview),
  ),
  popover: dynamic(() => import("./popover-preview").then((module) => module.PopoverPreview)),
  sheet: dynamic(() => import("./sheet-preview").then((module) => module.SheetPreview)),
  sonner: dynamic(() => import("./sonner-preview").then((module) => module.SonnerPreview)),
  toast: dynamic(() => import("./toast-preview").then((module) => module.ToastPreview)),
  tooltip: dynamic(() => import("./tooltip-preview").then((module) => module.TooltipPreview)),
  alert: dynamic(() => import("./alert-preview").then((module) => module.AlertPreview)),
  "aspect-ratio": dynamic(() =>
    import("./aspect-ratio-preview").then((module) => module.AspectRatioPreview),
  ),
  attachment: dynamic(() =>
    import("./attachment-preview").then((module) => module.AttachmentPreview),
  ),
  avatar: dynamic(() => import("./avatar-preview").then((module) => module.AvatarPreview)),
  badge: dynamic(() => import("./badge-preview").then((module) => module.BadgePreview)),
  bubble: dynamic(() => import("./bubble-preview").then((module) => module.BubblePreview)),
  card: dynamic(() => import("./card-preview").then((module) => module.CardPreview)),
  carousel: dynamic(() => import("./carousel-preview").then((module) => module.CarouselPreview)),
  chart: dynamic(() => import("./chart-preview").then((module) => module.ChartPreview)),
  direction: dynamic(() => import("./direction-preview").then((module) => module.DirectionPreview)),
  empty: dynamic(() => import("./empty-preview").then((module) => module.EmptyPreview)),
  item: dynamic(() => import("./item-preview").then((module) => module.ItemPreview)),
  kbd: dynamic(() => import("./kbd-preview").then((module) => module.KeyboardPreview)),
  marker: dynamic(() => import("./marker-preview").then((module) => module.MarkerPreview)),
  message: dynamic(() => import("./message-preview").then((module) => module.MessagePreview)),
  "message-scroller": dynamic(() =>
    import("./message-scroller-preview").then((module) => module.MessageScrollerPreview),
  ),
  progress: dynamic(() => import("./progress-preview").then((module) => module.ProgressPreview)),
  resizable: dynamic(() => import("./resizable-preview").then((module) => module.ResizablePreview)),
  "scroll-area": dynamic(() =>
    import("./scroll-area-preview").then((module) => module.ScrollAreaPreview),
  ),
  separator: dynamic(() => import("./separator-preview").then((module) => module.SeparatorPreview)),
  sidebar: dynamic(() => import("./sidebar-preview").then((module) => module.SidebarPreview)),
  skeleton: dynamic(() => import("./skeleton-preview").then((module) => module.SkeletonPreview)),
  spinner: dynamic(() => import("./spinner-preview").then((module) => module.SpinnerPreview)),
  table: dynamic(() => import("./table-preview").then((module) => module.TablePreview)),
  "code-block": dynamic(() => import("./code-block-preview")),
  trace: dynamic(() => import("./trace-preview")),
  typography: dynamic(() => import("./typography-preview")),
} satisfies Record<ComponentName, ComponentType<PreviewProps>>;

export function ComponentPreview({
  name,
  interactive = false,
}: PreviewProps & { name: ComponentName }) {
  const Preview = previews[name];
  return <Preview interactive={interactive} />;
}
