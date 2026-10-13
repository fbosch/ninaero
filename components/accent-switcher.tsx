"use client";

import { CheckIcon } from "lucide-react";
import { useId } from "react";

import { useAccent } from "@/components/accent-provider";
import { accentNames, accentPresets, isAccent } from "@/registry/ninaero/accents.mjs";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ninaero/ui/toggle-group";

export function AccentSwitcher() {
  const id = useId();
  const { accent, mounted, saved, setAccent } = useAccent();

  return (
    <fieldset className="space-y-2">
      <legend id={id} className="text-xs text-muted-foreground">
        Accent
      </legend>
      <ToggleGroup
        aria-labelledby={id}
        value={[accent]}
        multiple={false}
        disabled={!mounted}
        spacing={1}
        size="lg"
        onValueChange={(values) => {
          // A preference stays selected when its active toggle is pressed again.
          if (values.length === 0) return;
          const value = values[0];
          if (!isAccent(value)) throw new Error(`Unknown accent: ${value}`);
          setAccent(value);
        }}
        className="grid w-full grid-cols-2"
      >
        {accentNames.map((name) => (
          <ToggleGroupItem
            key={name}
            value={name}
            className="justify-start gap-2 px-2 text-sm font-normal"
          >
            <span
              aria-hidden="true"
              data-accent={name}
              className="size-3.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--button-primary-fill)" }}
            />
            {accentPresets[name].label}
            {accent === name ? <CheckIcon aria-hidden="true" className="ml-auto size-3.5" /> : null}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {!saved ? (
        <output aria-live="polite" className="block text-xs text-muted-foreground">
          Unable to save accent preference.
        </output>
      ) : null}
    </fieldset>
  );
}
