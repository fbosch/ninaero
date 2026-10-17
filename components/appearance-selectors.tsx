"use client";

import { useId } from "react";

import { useAccent } from "@/components/accent-provider";
import { AccentSwitcher } from "@/components/accent-switcher";
import { OverlaySwitcher } from "@/components/overlay-switcher";
import { ButtonGroup } from "@/registry/ninaero/ui/button-group";
import { Field, FieldTitle } from "@/registry/ninaero/ui/field";

export function AppearanceSelectors() {
  const id = useId();
  const { saved } = useAccent();
  const errorId = `${id}-error`;

  return (
    <Field className="w-auto">
      <FieldTitle id={id} className="sr-only">
        Accent and overlay
      </FieldTitle>
      <ButtonGroup aria-labelledby={id}>
        <AccentSwitcher errorId={errorId} />
        <OverlaySwitcher />
      </ButtonGroup>
      {!saved ? (
        <output id={errorId} aria-live="polite" className="text-xs text-muted-foreground">
          Unable to save accent preference.
        </output>
      ) : null}
    </Field>
  );
}
