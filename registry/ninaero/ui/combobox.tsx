"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "cn";
import * as React from "react";

import { CheckIcon, ChevronDownIcon, XIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/ninaero/ui/input-group";

import { SoundGroup, useControlSound, HoverSound } from "./sound-feedback";
import { getSoundPitch } from "./sound-runtime";

function Combobox<Value, Multiple extends boolean | undefined = false, Item = Value>({
  sound = true,
  onValueChange,
  onItemHighlighted,
  ...props
}: ComboboxPrimitive.Root.Props<Value, Multiple, Item> & { sound?: boolean }) {
  const { play } = useControlSound(sound);
  return (
    <SoundGroup sound={sound}>
      <ComboboxPrimitive.Root
        {...props}
        onValueChange={(value, details) => {
          onValueChange?.(value, details);
          if (!details.isCanceled && details.reason === "item-press") play("tap");
        }}
        onItemHighlighted={(value, details) => {
          onItemHighlighted?.(value, details);
          if (
            value !== undefined &&
            details.index >= 0 &&
            (details.reason === "keyboard" || details.reason === "pointer")
          ) {
            play("tick", { pitch: getSoundPitch(-details.index, -12, 0) });
          }
        }}
      />
    </SoundGroup>
  );
}

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxTrigger({
  className,
  children,
  sound = true,
  ...props
}: ComboboxPrimitive.Trigger.Props & { sound?: boolean }) {
  return (
    <HoverSound sound={sound}>
      <ComboboxPrimitive.Trigger
        data-slot="combobox-trigger"
        className={cn("ninaero-combobox-trigger [&_svg:not([class*='size-'])]:size-4", className)}
        {...props}
      >
        {children}
        <ChevronDownIcon className="pointer-events-none size-4" />
      </ComboboxPrimitive.Trigger>
    </HoverSound>
  );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      aria-label="Clear selection"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  return (
    <InputGroup className={cn("w-full", className)}>
      <ComboboxPrimitive.Input render={<InputGroupInput disabled={disabled} />} {...props} />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            aria-label="Toggle options"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "ninaero-popover ninaero-combobox-content group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-0 overflow-hidden *:data-[slot=input-group]:mx-2 *:data-[slot=input-group]:mt-2 *:data-[slot=input-group]:w-auto",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-[min(18rem,calc(var(--available-height)-4rem))] scroll-py-2 overflow-y-auto overscroll-contain p-2 data-empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "ninaero-combobox-item relative flex min-h-8 w-full cursor-default items-center gap-2 py-1 ps-3 pe-8 text-sm type-body leading-5 select-none data-disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute end-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />
  );
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("px-3 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />;
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center px-5 py-3 text-center text-sm type-body text-muted-foreground group-data-empty/combobox-content:flex",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("mx-2 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "ninaero-combobox-chips flex min-h-(--field-height) w-full min-w-0 flex-wrap items-center gap-1 px-(--field-padding-inline) py-1 text-base md:text-sm has-data-[slot=combobox-chip]:px-1",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "ninaero-combobox-chip flex min-h-6 max-w-full w-fit items-center gap-1 rounded-md border px-2 text-sm type-body leading-5 has-data-[slot=combobox-chip-remove]:pe-0",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="shrink-0"
          data-slot="combobox-chip-remove"
          aria-label={typeof children === "string" ? `Remove ${children}` : "Remove selection"}
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 bg-transparent py-0.5 text-inherit outline-none", className)}
      {...props}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
