"use client";

import { cn } from "cn";

import { useAccent } from "@/components/accent-provider";
import { ChevronDownIcon } from "@/lib/icons";
import { accentNames, accentPresets, isAccent } from "@/registry/ninaero/accents.mjs";
import { Button } from "@/registry/ninaero/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/registry/ninaero/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/ninaero/ui/tooltip";

export function AccentSwitcher({
  errorId,
  showLabel = false,
}: {
  errorId: string;
  showLabel?: boolean;
}) {
  const { accent, mounted, saved } = useAccent();
  const label = `Accent: ${accentPresets[accent].label}`;

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
              disabled={!mounted}
              aria-label={label}
              aria-describedby={!saved ? errorId : undefined}
            />
          }
        >
          <span
            aria-hidden="true"
            data-accent={accent}
            className="size-3.5 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--button-primary-fill)" }}
          />
          {showLabel ? (
            <>
              <span className="min-w-0 flex-1 text-left">{accentPresets[accent].label}</span>
              <ChevronDownIcon data-icon="inline-end" />
            </>
          ) : null}
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="min-w-44" align="end" aria-label="Accent">
        <AccentMenuOptions />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccentMenuOptions() {
  const { accent, setAccent } = useAccent();

  return (
    <DropdownMenuRadioGroup
      aria-label="Accent"
      value={accent}
      onValueChange={(value) => {
        if (!isAccent(value)) throw new Error(`Unknown accent: ${value}`);
        setAccent(value);
      }}
    >
      {accentNames.map((name) => (
        <DropdownMenuRadioItem key={name} value={name} className="gap-2" closeOnClick>
          <span
            aria-hidden="true"
            data-accent={name}
            className="size-3.5 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--button-primary-fill)" }}
          />
          {accentPresets[name].label}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
