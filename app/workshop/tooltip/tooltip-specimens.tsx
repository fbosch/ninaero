"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { useRef, useState } from "react";

import { InfoIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import { FieldDescription, FieldLegend, FieldSet } from "@/registry/ninaero/ui/field";
import { Field, FieldLabel } from "@/registry/ninaero/ui/field";
import { Kbd } from "@/registry/ninaero/ui/kbd";
import { Switch } from "@/registry/ninaero/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ninaero/ui/tooltip";

const sides = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "inline-start", label: "Inline start" },
  { value: "inline-end", label: "Inline end" },
] as const;

export function TooltipSpecimens() {
  const composedRef = useRef<HTMLButtonElement>(null);
  const [activations, setActivations] = useState(0);
  const [controlledOpen, setControlledOpen] = useState(false);
  const [handle] = useState(() => TooltipPrimitive.createHandle<{ label: string }>());
  return (
    <div className="flex max-w-xl flex-col gap-8">
      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Hover and keyboard focus</FieldLegend>
        <div className="flex flex-wrap items-center gap-3">
          <Tooltip>
            <TooltipTrigger id="tooltip-basic" render={<Button variant="outline" />}>
              Hover or focus
            </TooltipTrigger>
            <TooltipContent>A short note about this control.</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              id="tooltip-icon"
              aria-label="About tooltips"
              render={<Button variant="outline" size="icon" />}
            >
              <InfoIcon />
            </TooltipTrigger>
            <TooltipContent>Tooltips add context without moving keyboard focus.</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger id="tooltip-keyboard" render={<Button variant="outline" />}>
              Keyboard hint
            </TooltipTrigger>
            <TooltipContent>
              Shortcut example <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </TooltipContent>
          </Tooltip>
        </div>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Sides</FieldLegend>
        <div className="flex flex-wrap gap-3">
          {sides.map(({ value, label }) => (
            <Tooltip key={value}>
              <TooltipTrigger id={`tooltip-side-${value}`} render={<Button variant="outline" />}>
                {label}
              </TooltipTrigger>
              <TooltipContent side={value}>Short contextual help.</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </FieldSet>

      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Alignment</FieldLegend>
        <div className="flex flex-wrap gap-3">
          {(["start", "center", "end"] as const).map((align) => (
            <Tooltip key={align}>
              <TooltipTrigger id={`tooltip-align-${align}`} render={<Button variant="outline" />}>
                Align {align}
              </TooltipTrigger>
              <TooltipContent align={align}>Aligned contextual help.</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Wrapping</FieldLegend>
        <Tooltip>
          <TooltipTrigger id="tooltip-long" render={<Button variant="outline" className="w-fit" />}>
            Long description
          </TooltipTrigger>
          <TooltipContent>
            Keep short notes here. Longer descriptions wrap within the available space, including
            filenames such as skærmbillede-af-den-færdige-tegning-med-mange-detaljer.png.
          </TooltipContent>
        </Tooltip>
      </FieldSet>

      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Disabled controls</FieldLegend>
        <div className="flex flex-wrap items-center gap-3">
          <Tooltip>
            <TooltipTrigger
              id="tooltip-unavailable"
              render={<span className="inline-flex" />}
              role="group"
              aria-label="Export drawing unavailable"
              tabIndex={0}
            >
              <Button variant="outline" disabled>
                Export drawing
              </Button>
            </TooltipTrigger>
            <TooltipContent>Finish a drawing before exporting.</TooltipContent>
          </Tooltip>
          <Tooltip disabled>
            <TooltipTrigger id="tooltip-disabled" render={<Button variant="outline" />}>
              Tooltip disabled
            </TooltipTrigger>
            <TooltipContent>This tooltip is disabled.</TooltipContent>
          </Tooltip>
        </div>
        <FieldDescription>
          The disabled button has a focusable wrapper for its explanation.
        </FieldDescription>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Shared delay</FieldLegend>
        <FieldDescription>
          The first hint waits 400 ms. Move to its neighbor to see the next hint immediately.
        </FieldDescription>
        <TooltipProvider delay={400}>
          <div className="flex flex-wrap gap-3">
            <Tooltip>
              <TooltipTrigger id="tooltip-delay-first" render={<Button variant="outline" />}>
                First hint
              </TooltipTrigger>
              <TooltipContent>The first hint has a short hover delay.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger id="tooltip-delay-next" render={<Button variant="outline" />}>
                Next hint
              </TooltipTrigger>
              <TooltipContent>Nearby hints share the provider timing.</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </FieldSet>

      <DirectionProvider direction="rtl">
        <FieldSet dir="rtl" className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <FieldLegend>Right-to-left</FieldLegend>
          <div className="flex flex-wrap gap-3">
            {(["inline-start", "inline-end"] as const).map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger id={`tooltip-rtl-${side}`} render={<Button variant="outline" />}>
                  {side === "inline-start" ? "Inline start (RTL)" : "Inline end (RTL)"}
                </TooltipTrigger>
                <TooltipContent side={side}>
                  Logical placement follows the reading direction.
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </FieldSet>
      </DirectionProvider>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Consumer composition</FieldLegend>
        <FieldDescription id="tooltip-composition-help">
          This description stays available when the tooltip closes.
        </FieldDescription>
        <FieldDescription id="tooltip-direct-help">
          The trigger's own description stays linked as well.
        </FieldDescription>
        <div className="flex flex-wrap gap-3">
          <Tooltip>
            <TooltipTrigger
              id="tooltip-composed"
              aria-describedby="tooltip-direct-help"
              render={
                <Button
                  ref={composedRef}
                  variant="outline"
                  aria-describedby="tooltip-composition-help"
                  onClick={() => setActivations((count) => count + 1)}
                />
              }
            >
              Composed trigger
            </TooltipTrigger>
            <TooltipContent id="tooltip-composed-content">
              Extra context for the composed trigger.
            </TooltipContent>
          </Tooltip>
          <Button
            variant="outline"
            id="tooltip-focus-composed"
            onClick={() => composedRef.current?.focus()}
          >
            Focus composed trigger
          </Button>
          <Tooltip>
            <TooltipTrigger
              id="tooltip-render-function"
              render={(props, state) => (
                <Button {...props} variant="outline">
                  {state.open ? "Hint open" : "Hint closed"}
                </Button>
              )}
            />
            <TooltipContent>
              The render callback receives the primitive's open state.
            </TooltipContent>
          </Tooltip>
        </div>
        <p role="status" id="tooltip-activation-status" className="text-sm text-muted-foreground">
          Example activations: {activations}.
        </p>
      </FieldSet>

      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Detached triggers</FieldLegend>
        <div className="flex flex-wrap gap-3">
          <TooltipTrigger
            id="tooltip-detached-first"
            handle={handle}
            payload={{ label: "First" }}
            render={<Button variant="outline" />}
          >
            First detached hint
          </TooltipTrigger>
          <TooltipTrigger
            id="tooltip-detached-next"
            handle={handle}
            payload={{ label: "Next" }}
            render={<Button variant="outline" />}
          >
            Next detached hint
          </TooltipTrigger>
        </div>
        <Tooltip handle={handle}>
          {({ payload }) => (
            <TooltipContent id="tooltip-detached-content">
              {payload
                ? `Context for the ${payload.label.toLowerCase()} trigger.`
                : "Shared context."}
            </TooltipContent>
          )}
        </Tooltip>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Controlled state</FieldLegend>
        <Field orientation="horizontal">
          <Switch
            id="tooltip-controlled-visibility"
            checked={controlledOpen}
            onCheckedChange={setControlledOpen}
          />
          <FieldLabel htmlFor="tooltip-controlled-visibility">Show controlled hint</FieldLabel>
        </Field>
        <Tooltip
          open={controlledOpen}
          onOpenChange={setControlledOpen}
          triggerId="tooltip-controlled"
        >
          <TooltipTrigger
            id="tooltip-controlled"
            render={<Button variant="outline" className="w-fit" />}
          >
            Controlled hint
          </TooltipTrigger>
          <TooltipContent id="tooltip-controlled-content">
            Visibility follows the caller's state.
          </TooltipContent>
        </Tooltip>
      </FieldSet>
    </div>
  );
}
