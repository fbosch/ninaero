"use client";

import { useEffect, useId, useState } from "react";

import { useAccent } from "@/components/accent-provider";
import { AccentSwitcher } from "@/components/accent-switcher";
import { OverlaySwitcher, type OverlayValue } from "@/components/overlay-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SlidersHorizontalIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import { ButtonGroup } from "@/registry/ninaero/ui/button-group";
import { Field, FieldGroup, FieldLegend, FieldSet, FieldTitle } from "@/registry/ninaero/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ninaero/ui/popover";

export function AppearanceSelectors() {
  const id = useId();
  const { mounted, saved } = useAccent();
  const errorId = `${id}-error`;
  const [overlay, setOverlay] = useState<OverlayValue>("checker");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    // The portalled panel must close when its mobile trigger disappears.
    const desktop = window.matchMedia("(min-width: 40rem)");
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [open]);

  return (
    <FieldSet className="ninaero-surface-paper min-w-0 max-w-full flex-row flex-wrap items-start justify-end gap-2 lg:col-start-3 lg:row-start-1 lg:justify-self-end">
      <FieldLegend className="sr-only">Appearance</FieldLegend>
      <div className="sm:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={<Button size="icon-sm" variant="secondary" />}
            aria-label="Appearance settings"
            aria-describedby={!saved ? errorId : undefined}
            title="Appearance settings"
            disabled={!mounted}
          >
            <SlidersHorizontalIcon />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-4 sm:hidden">
            <PopoverTitle>Appearance</PopoverTitle>
            <FieldGroup className="gap-4">
              <Field orientation="horizontal" className="flex-wrap justify-between">
                <FieldTitle>Color mode</FieldTitle>
                <ThemeSwitcher />
              </Field>
              <Field orientation="horizontal" className="flex-wrap justify-between">
                <FieldTitle>Accent</FieldTitle>
                <AccentSwitcher errorId={errorId} showLabel />
              </Field>
              <Field orientation="horizontal" className="flex-wrap justify-between">
                <FieldTitle>Overlay</FieldTitle>
                <OverlaySwitcher value={overlay} onValueChange={setOverlay} showLabel />
              </Field>
            </FieldGroup>
          </PopoverContent>
        </Popover>
      </div>
      <Field className="hidden w-auto sm:flex">
        <FieldTitle id={id} className="sr-only">
          Accent and overlay
        </FieldTitle>
        <ButtonGroup aria-labelledby={id}>
          <AccentSwitcher errorId={errorId} />
          <OverlaySwitcher value={overlay} onValueChange={setOverlay} />
        </ButtonGroup>
      </Field>
      <div className="hidden sm:block">
        <ThemeSwitcher />
      </div>
      {!saved ? (
        <output id={errorId} aria-live="polite" className="w-full text-xs text-muted-foreground">
          Unable to save accent preference.
        </output>
      ) : null}
    </FieldSet>
  );
}
