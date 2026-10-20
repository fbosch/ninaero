"use client";

import { useDirection } from "@base-ui/react/direction-provider";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "cn";
import type * as React from "react";

import { CheckIcon, ChevronRightIcon } from "@/lib/icons";

import { HighlightSound, SoundGroup, useControlSound, HoverSound } from "./sound-feedback";

function DropdownMenu({ sound = true, ...props }: MenuPrimitive.Root.Props & { sound?: boolean }) {
  return (
    <SoundGroup sound={sound}>
      <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
    </SoundGroup>
  );
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({
  sound = true,
  ...props
}: MenuPrimitive.Trigger.Props & { sound?: boolean }) {
  return (
    <HoverSound sound={sound}>
      <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
    </HoverSound>
  );
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  const direction = useDirection();
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          dir={direction}
          className={cn(
            "ninaero-popover ninaero-dropdown-menu-content relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-[min(8rem,var(--available-width))] max-w-(--available-width) overflow-x-hidden overflow-y-auto p-2 outline-none",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-3 py-1 text-xs font-medium text-muted-foreground data-inset:ps-9",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  render,
  onClick,
  sound = true,
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
  sound?: boolean;
}) {
  const { play } = useControlSound(sound);
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "ninaero-dropdown-menu-item group/dropdown-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-md px-3 py-1 text-sm select-none data-inset:ps-9 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
      render={(elementProps, state) => (
        <HighlightSound elementProps={elementProps} state={state} render={render} sound={sound} />
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !event.baseUIHandlerPrevented && !props.disabled)
          play("tap");
      }}
    />
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  sound = true,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
} & { sound?: boolean }) {
  return (
    <HoverSound sound={sound}>
      <MenuPrimitive.SubmenuTrigger
        data-slot="dropdown-menu-sub-trigger"
        data-inset={inset}
        className={cn(
          "ninaero-dropdown-menu-item flex min-h-8 cursor-default items-center gap-2 rounded-md px-3 py-1 text-sm select-none data-inset:ps-9 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronRightIcon className="ms-auto rtl:rotate-180" />
      </MenuPrimitive.SubmenuTrigger>
    </HoverSound>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "inline-end",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("w-auto min-w-[min(6rem,var(--available-width))]", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  render,
  onCheckedChange,
  sound = true,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
  sound?: boolean;
}) {
  const { play } = useControlSound(sound);
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "ninaero-dropdown-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-md py-1 pe-9 ps-3 text-sm select-none data-inset:ps-9 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
      render={(elementProps, state) => (
        <HighlightSound elementProps={elementProps} state={state} render={render} sound={sound} />
      )}
      onCheckedChange={(value, details) => {
        onCheckedChange?.(value, details);
        if (!details.isCanceled && details.event.type !== "reset") play("tap");
      }}
    >
      <span
        className="pointer-events-none absolute end-3 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  sound = true,
  onValueChange,
  ...props
}: MenuPrimitive.RadioGroup.Props & { sound?: boolean }) {
  const { play } = useControlSound(sound);
  return (
    <SoundGroup sound={sound}>
      <MenuPrimitive.RadioGroup
        data-slot="dropdown-menu-radio-group"
        {...props}
        onValueChange={(value, details) => {
          onValueChange?.(value, details);
          if (!details.isCanceled && details.event.type !== "reset") play("tap");
        }}
      />
    </SoundGroup>
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  render,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "ninaero-dropdown-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-md py-1 pe-9 ps-3 text-sm select-none data-inset:ps-9 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
      render={(elementProps, state) => (
        <HighlightSound elementProps={elementProps} state={state} render={render} />
      )}
    >
      <span
        className="pointer-events-none absolute end-3 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ninaero-dropdown-menu-shortcut ms-auto text-xs type-caption", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
