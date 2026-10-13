"use client";

import { useId } from "react";

import { useAccent } from "@/components/accent-provider";
import { accentNames, accentPresets, isAccent } from "@/registry/ninaero/accents.mjs";

export function AccentSwitcher() {
  const id = useId();
  const { accent, mounted, saved, setAccent } = useAccent();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor={id} className="text-sm font-medium">
        Accent
      </label>
      <select
        id={id}
        value={accent}
        disabled={!mounted}
        onChange={(event) => {
          const value = event.target.value;
          if (!isAccent(value)) throw new Error(`Unknown accent: ${value}`);
          setAccent(value);
        }}
        className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
      >
        {accentNames.map((name) => (
          <option key={name} value={name}>
            {accentPresets[name].label}
          </option>
        ))}
      </select>
      {!saved ? (
        <output aria-live="polite" className="text-xs text-muted-foreground">
          Unable to save accent preference.
        </output>
      ) : null}
    </div>
  );
}
