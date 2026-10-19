"use client";

import { cn } from "cn";

import { ChevronDownIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/registry/ninaero/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/ninaero/ui/tooltip";

import styles from "./overlay-switcher.module.css";

const overlayItems = [
  { value: "off", label: "Off", className: "" },
  { value: "checker", label: "Checker", className: "" },
  { value: "dots", label: "Ordered dots", className: "ninaero-overlay-dots" },
  { value: "lines", label: "Diagonal lines", className: "ninaero-overlay-lines" },
  { value: "flipnote", label: "Flipnote dither", className: "ninaero-overlay-flipnote" },
] as const;

export type OverlayValue = (typeof overlayItems)[number]["value"];

type OverlayMenuProps = {
  value: OverlayValue;
  onValueChange: (value: OverlayValue) => void;
};

export function OverlaySwitcher({
  value,
  onValueChange,
  showLabel = false,
}: OverlayMenuProps & { showLabel?: boolean }) {
  const currentOverlay = overlayItems.find((item) => item.value === value);
  if (!currentOverlay) throw new Error(`Unknown overlay: ${value}`);
  const label = `Overlay: ${currentOverlay.label}`;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  size={showLabel ? "sm" : "icon-sm"}
                  variant="secondary"
                  className={cn(showLabel && "ninaero-rounded-control w-40 justify-between")}
                />
              }
              aria-label={label}
            />
          }
        >
          <span
            aria-hidden="true"
            data-overlay={value}
            className={cn(styles.swatch, currentOverlay.className)}
          />
          {showLabel ? (
            <>
              <span className="min-w-0 flex-1 text-left">{currentOverlay.label}</span>
              <ChevronDownIcon data-icon="inline-end" />
            </>
          ) : null}
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-max min-w-44" align="end" aria-label="Overlay">
        <OverlayMenuOptions value={value} onValueChange={onValueChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OverlayMenuOptions({ value, onValueChange }: OverlayMenuProps) {
  return (
    <DropdownMenuRadioGroup
      aria-label="Overlay"
      value={value}
      onValueChange={(nextValue) => {
        const selected = overlayItems.find((item) => item.value === nextValue);
        if (!selected) throw new Error(`Unknown overlay: ${nextValue}`);
        for (const item of overlayItems) {
          if (item.className) document.body.classList.remove(item.className);
        }
        document.body.classList.toggle("ninaero-overlay-dither", selected.value !== "off");
        if (selected.className) document.body.classList.add(selected.className);
        onValueChange(selected.value);
      }}
    >
      {overlayItems.map((item) => (
        <DropdownMenuRadioItem key={item.value} value={item.value} className="gap-2" closeOnClick>
          <span
            aria-hidden="true"
            data-overlay={item.value}
            className={cn(styles.swatch, item.className)}
          />
          {item.label}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
