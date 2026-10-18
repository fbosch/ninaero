"use client";

import { cn } from "cn";
import { useState } from "react";

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

export function OverlaySwitcher() {
  const [overlay, setOverlay] = useState<(typeof overlayItems)[number]["value"]>("checker");
  const currentOverlay = overlayItems.find((item) => item.value === overlay);
  if (!currentOverlay) throw new Error(`Unknown overlay: ${overlay}`);
  const label = `Overlay: ${currentOverlay.label}`;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={<Button size="icon-sm" variant="secondary" />}
              aria-label={label}
            />
          }
        >
          <span
            aria-hidden="true"
            data-overlay={overlay}
            className={cn(styles.swatch, currentOverlay.className)}
          />
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-max min-w-44" align="end" aria-label="Overlay">
        <DropdownMenuRadioGroup
          value={overlay}
          onValueChange={(value) => {
            const selected = overlayItems.find((item) => item.value === value);
            if (!selected) throw new Error(`Unknown overlay: ${value}`);
            for (const item of overlayItems) {
              if (item.className) document.body.classList.remove(item.className);
            }
            document.body.classList.toggle("ninaero-overlay-dither", selected.value !== "off");
            if (selected.className) document.body.classList.add(selected.className);
            setOverlay(selected.value);
          }}
        >
          {overlayItems.map((item) => (
            <DropdownMenuRadioItem
              key={item.value}
              value={item.value}
              className="gap-2"
              closeOnClick
            >
              <span
                aria-hidden="true"
                data-overlay={item.value}
                className={cn(styles.swatch, item.className)}
              />
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
