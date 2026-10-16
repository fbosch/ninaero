"use client";

import { useId } from "react";

import { useAccent } from "@/components/accent-provider";
import { accentNames, accentPresets, isAccent } from "@/registry/ninaero/accents.mjs";
import { Field, FieldLabel } from "@/registry/ninaero/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";

const accentItems = accentNames.map((value) => ({ value, label: accentPresets[value].label }));

export function AccentSwitcher() {
  const id = useId();
  const { accent, mounted, saved, setAccent } = useAccent();

  return (
    <Field className="w-auto sm:w-32">
      <FieldLabel htmlFor={id} className="sr-only">
        Accent
      </FieldLabel>
      <Select
        items={accentItems}
        value={accent}
        disabled={!mounted}
        onValueChange={(value) => {
          if (!isAccent(value)) throw new Error(`Unknown accent: ${value}`);
          setAccent(value);
        }}
      >
        <SelectTrigger id={id} size="sm" aria-describedby={!saved ? `${id}-error` : undefined}>
          <span
            aria-hidden="true"
            data-accent={accent}
            className="size-3.5 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--button-primary-fill)" }}
          />
          <SelectValue className="sr-only sm:not-sr-only" />
        </SelectTrigger>
        <SelectContent align="end" alignItemWithTrigger={false}>
          <SelectGroup>
            {accentNames.map((name) => (
              <SelectItem key={name} value={name}>
                <span
                  aria-hidden="true"
                  data-accent={name}
                  className="size-3.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--button-primary-fill)" }}
                />
                {accentPresets[name].label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {!saved ? (
        <output id={`${id}-error`} aria-live="polite" className="text-xs text-muted-foreground">
          Unable to save accent preference.
        </output>
      ) : null}
    </Field>
  );
}
