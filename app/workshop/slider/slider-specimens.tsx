"use client";

import { useState } from "react";

import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/ninaero/ui/field";
import { Slider } from "@/registry/ninaero/ui/slider";

function SliderField({
  id,
  label,
  valueText,
  hint,
  ...props
}: React.ComponentProps<typeof Slider> & {
  id: string;
  label: string;
  valueText?: string;
  hint?: string;
}) {
  return (
    <Field
      data-disabled={props.disabled || undefined}
      data-invalid={props["aria-invalid"] || undefined}
    >
      <div className="flex items-center justify-between gap-4">
        <FieldLabel id={`${id}-label`}>{label}</FieldLabel>
        {valueText && (
          <output aria-hidden="true" className="text-sm text-muted-foreground tabular-nums">
            {valueText}
          </output>
        )}
      </div>
      <Slider
        {...props}
        id={id}
        aria-labelledby={`${id}-label`}
        aria-describedby={hint ? `${id}-hint` : props["aria-describedby"]}
      />
      {hint && <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>}
    </Field>
  );
}

export function SliderSpecimens() {
  const [volume, setVolume] = useState(40);
  const [range, setRange] = useState([25, 75]);

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <section aria-labelledby="slider-values" className="flex flex-col gap-3">
        <h2 id="slider-values" className="text-xl type-heading">
          Values
        </h2>
        <div className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <FieldGroup>
            <SliderField
              id="volume-slider"
              label="Volume"
              value={volume}
              valueText={`${volume}%`}
              getAriaValueText={(_, next) => `${next}%`}
              onValueChange={(next) => setVolume(typeof next === "number" ? next : next[0])}
            />
            <SliderField
              id="range-slider"
              label="Range limits"
              value={range}
              valueText={`${range[0]} to ${range[1]}`}
              getAriaLabel={(index) => (index === 0 ? "Lower limit" : "Upper limit")}
              onValueChange={(next) => setRange(typeof next === "number" ? [next] : [...next])}
            />
          </FieldGroup>
        </div>
      </section>
      <section aria-labelledby="slider-states" className="flex flex-col gap-3">
        <h2 id="slider-states" className="text-xl type-heading">
          States
        </h2>
        <div className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <FieldGroup>
            <SliderField id="minimum-slider" label="Minimum value" defaultValue={0} />
            <SliderField id="maximum-slider" label="Maximum value" defaultValue={100} />
            <SliderField id="disabled-slider" label="Disabled level" defaultValue={40} disabled />
            <SliderField
              id="invalid-slider"
              label="Invalid level"
              defaultValue={50}
              aria-invalid="true"
              hint="Visual state only; no validation runs."
            />
          </FieldGroup>
        </div>
      </section>
      <section aria-labelledby="slider-orientations" className="flex flex-col gap-3">
        <h2 id="slider-orientations" className="text-xl type-heading">
          Orientations
        </h2>
        <div className="button-specimen ninaero-surface-paper bg-(--paper-fill) grid gap-8 p-6 sm:grid-cols-2">
          <Field>
            <FieldLabel id="vertical-slider-label">Vertical level</FieldLabel>
            <FieldContent>
              <div className="h-40 w-8">
                <Slider
                  id="vertical-slider"
                  aria-labelledby="vertical-slider-label"
                  defaultValue={60}
                  orientation="vertical"
                />
              </div>
            </FieldContent>
          </Field>
          <DirectionProvider direction="rtl">
            <Field dir="rtl">
              <FieldLabel id="rtl-slider-label">Right-to-left level</FieldLabel>
              <Slider id="rtl-slider" aria-labelledby="rtl-slider-label" defaultValue={40} />
            </Field>
          </DirectionProvider>
        </div>
      </section>
    </div>
  );
}
