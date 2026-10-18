"use client";

import { useAccent } from "@/components/accent-provider";
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

export function AccentSwitcher({ errorId }: { errorId: string }) {
  const { accent, mounted, saved, setAccent } = useAccent();
  const label = `Accent: ${accentPresets[accent].label}`;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={<Button size="icon-sm" variant="secondary" />}
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
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="min-w-44" align="end" aria-label="Accent">
        <DropdownMenuRadioGroup
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
