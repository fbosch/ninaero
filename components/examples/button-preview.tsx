"use client";

import { useId, useState } from "react";

import { useAccent } from "@/components/accent-provider";
import { CheckIcon, PlusIcon } from "@/lib/icons";
import { accentNames, accentPresets } from "@/registry/ninaero/accents.mjs";
import { Button } from "@/registry/ninaero/ui/button";
import { ButtonGroup } from "@/registry/ninaero/ui/button-group";
import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";

const variants = [
  ["default", "Primary"],
  ["secondary", "Secondary"],
  ["outline", "Outline"],
  ["ghost", "Ghost"],
  ["destructive", "Destructive"],
  ["link", "Link"],
] as const;

const sizes = ["xs", "sm", "default", "lg", "xl"] as const;
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

export function ButtonPreview() {
  const { accent, mounted, setAccent } = useAccent();
  const inputId = useId();
  const [activations, setActivations] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="button-specimen ninaero-surface-paper flex flex-col justify-center gap-5 p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Paper + {accentPresets[accent].label.toLowerCase()}</p>
          <p className="text-sm">
            Test the button with a pointer or keyboard. Each activation increments the counter.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={inputId}>Editable input specimen</Label>
          <Input id={inputId} placeholder="Compare with a plain input" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => setActivations((count) => count + 1)}>
            <PlusIcon data-icon="inline-start" />
            Test action
          </Button>
          <Button
            size="lg"
            variant="secondary"
            disabled={activations === 0}
            onClick={() => setActivations(0)}
          >
            Reset counter
          </Button>
        </div>
        <output className="text-sm tabular-nums">Activations: {activations}</output>
        <p className="text-xs">The counter is preview-only and is not saved.</p>
      </div>
      <div className="space-y-5">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Compare accents</legend>
          <p className="text-xs text-muted-foreground">
            Choose an accent to apply it across the workshop, catalogue, and docs. Compare each in
            light and dark mode.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {accentNames.map((name) => (
              <Button
                key={name}
                data-accent={name}
                className="relative w-full"
                disabled={!mounted}
                aria-pressed={accent === name}
                onClick={() => setAccent(name)}
              >
                <CheckIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 data-[selected=true]:opacity-100"
                  data-selected={accent === name}
                  aria-hidden="true"
                />
                {accentPresets[name].label}
              </Button>
            ))}
          </div>
        </fieldset>
        <div className="space-y-3">
          <h3 className="text-sm type-title tracking-normal">Variants and states</h3>
          <p className="text-xs text-muted-foreground">
            These variant, size, and state specimens perform no action.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {variants.map(([variant, label]) => (
              <Button key={variant} variant={variant}>
                {label}
              </Button>
            ))}
            <Button disabled>Disabled</Button>
            <Button variant="outline" aria-invalid="true">
              Invalid state
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm type-title tracking-normal">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            {sizes.map((size) => (
              <Button key={size} size={size} variant="secondary">
                {size}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm type-title tracking-normal">Icon squircles</h3>
          <div className="flex flex-wrap items-center gap-3">
            {iconSizes.map((size) => (
              <Button key={size} size={size} aria-label={`${size} specimen`}>
                <PlusIcon />
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm type-title tracking-normal">Joined controls</h3>
          <ButtonGroup aria-label="Button group specimen">
            <Button variant="secondary">First</Button>
            <Button variant="secondary">Second</Button>
            <Button variant="secondary">Third</Button>
          </ButtonGroup>
        </div>
        <p className="squircle-support-note text-xs text-muted-foreground">
          This browser does not support CSS squircle corners. Buttons display ordinary rounded
          corners here.
        </p>
      </div>
    </div>
  );
}
