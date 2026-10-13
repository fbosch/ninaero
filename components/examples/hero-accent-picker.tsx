"use client";

import { useAccent } from "@/components/accent-provider";
import { accentNames, accentPresets } from "@/registry/ninaero/accents.mjs";
import { Button } from "@/registry/ninaero/ui/button";

export function HeroAccentPicker() {
  const { accent, mounted, saved, setAccent } = useAccent();

  return (
    <fieldset className="space-y-3">
      <legend className="text-xs text-muted-foreground">Accent</legend>
      <div className="flex flex-wrap gap-1">
        {accentNames.map((name) => (
          <Button
            key={name}
            type="button"
            variant="ghost"
            size="sm"
            disabled={!mounted}
            aria-pressed={accent === name}
            onClick={() => setAccent(name)}
            className="gap-2 border border-transparent aria-pressed:border-input aria-pressed:bg-card"
          >
            <span
              aria-hidden="true"
              data-accent={name}
              className="size-3 rounded-full"
              style={{ backgroundColor: "var(--button-primary-fill)" }}
            />
            {accentPresets[name].label}
          </Button>
        ))}
      </div>
      {!saved && (
        <output className="text-xs text-muted-foreground">Accent preference wasn't saved.</output>
      )}
    </fieldset>
  );
}
