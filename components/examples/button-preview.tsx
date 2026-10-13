"use client";

import { PlusIcon } from "lucide-react";
import { useId, useState } from "react";
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

const sizes = ["xs", "sm", "default", "lg"] as const;
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

export function ButtonPreview() {
  const inputId = useId();
  const [activations, setActivations] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="button-specimen flex flex-col justify-center gap-5 p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Paper + cyan</p>
          <p className="text-sm">
            Test the button with a pointer or keyboard. Each activation
            increments the counter.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={inputId}>Editable input specimen</Label>
          <Input id={inputId} placeholder="Compare with a plain input" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            onClick={() => setActivations((count) => count + 1)}
          >
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
        <output className="text-sm tabular-nums">
          Activations: {activations}
        </output>
        <p className="text-xs">Preview only. No data is saved.</p>
      </div>
      <div className="space-y-5">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Variants and states</h3>
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
          <h3 className="text-sm font-medium">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            {sizes.map((size) => (
              <Button key={size} size={size} variant="secondary">
                {size}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Icon squircles</h3>
          <div className="flex flex-wrap items-center gap-3">
            {iconSizes.map((size) => (
              <Button key={size} size={size} aria-label={`${size} specimen`}>
                <PlusIcon />
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Joined controls</h3>
          <ButtonGroup aria-label="Button group specimen">
            <Button variant="secondary">First</Button>
            <Button variant="secondary">Second</Button>
            <Button variant="secondary">Third</Button>
          </ButtonGroup>
        </div>
        <p className="squircle-support-note text-xs text-muted-foreground">
          This browser does not support CSS squircle corners. Buttons display
          ordinary rounded corners here.
        </p>
      </div>
    </div>
  );
}
