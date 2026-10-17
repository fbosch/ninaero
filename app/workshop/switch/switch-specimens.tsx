"use client";

import { type ComponentProps, useState } from "react";

import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/ninaero/ui/field";
import { Switch } from "@/registry/ninaero/ui/switch";

function SwitchField({
  id,
  label,
  hint,
  ...props
}: ComponentProps<typeof Switch> & {
  id: string;
  label: string;
  hint?: string;
}) {
  return (
    <Field
      orientation="horizontal"
      data-disabled={props.disabled || undefined}
      data-invalid={props["aria-invalid"] || undefined}
    >
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {hint && <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>}
      </FieldContent>
      <Switch
        {...props}
        id={id}
        aria-describedby={hint ? `${id}-hint` : props["aria-describedby"]}
      />
    </Field>
  );
}

export function SwitchSpecimens() {
  const [soundEffects, setSoundEffects] = useState(false);

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <section aria-labelledby="switch-setting" className="flex flex-col gap-3">
        <h2 id="switch-setting" className="text-xl type-heading">
          Setting
        </h2>
        <div className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <SwitchField
            id="sound-effects"
            label="Sound effects"
            hint={soundEffects ? "On" : "Off"}
            checked={soundEffects}
            onCheckedChange={setSoundEffects}
          />
        </div>
      </section>
      <section aria-labelledby="switch-sizes" className="flex flex-col gap-3">
        <h2 id="switch-sizes" className="text-xl type-heading">
          Sizes
        </h2>
        <div className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <FieldGroup>
            <SwitchField id="default-off" label="Default off" />
            <SwitchField id="default-on" label="Default on" defaultChecked />
            <SwitchField id="small-off" label="Small off" size="sm" />
            <SwitchField id="small-on" label="Small on" size="sm" defaultChecked />
          </FieldGroup>
        </div>
      </section>
      <section aria-labelledby="switch-states" className="flex flex-col gap-3">
        <h2 id="switch-states" className="text-xl type-heading">
          States
        </h2>
        <div className="button-specimen bg-card p-6">
          <FieldGroup>
            <SwitchField id="disabled-off" label="Disabled off" disabled />
            <SwitchField id="disabled-on" label="Disabled on" defaultChecked disabled />
            <SwitchField id="small-disabled-off" label="Small disabled off" size="sm" disabled />
            <SwitchField
              id="small-disabled-on"
              label="Small disabled on"
              size="sm"
              defaultChecked
              disabled
            />
            <SwitchField
              id="invalid-off"
              label="Invalid off"
              aria-invalid="true"
              hint="Visual state only; no validation runs."
            />
            <SwitchField
              id="invalid-on"
              label="Invalid on"
              aria-invalid="true"
              defaultChecked
              hint="Visual state only; no validation runs."
            />
            <SwitchField id="readonly-off" label="Read-only off" readOnly />
            <SwitchField id="readonly-on" label="Read-only on" defaultChecked readOnly />
          </FieldGroup>
        </div>
      </section>
      <section aria-labelledby="switch-direction" className="flex flex-col gap-3">
        <h2 id="switch-direction" className="text-xl type-heading">
          Right-to-left
        </h2>
        <DirectionProvider direction="rtl">
          <div dir="rtl" className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
            <FieldGroup>
              <SwitchField id="rtl-off" label="Right-to-left off" />
              <SwitchField id="rtl-on" label="Right-to-left on" defaultChecked />
              <SwitchField id="rtl-small-off" label="Small right-to-left off" size="sm" />
              <SwitchField
                id="rtl-small-on"
                label="Small right-to-left on"
                size="sm"
                defaultChecked
              />
            </FieldGroup>
          </div>
        </DirectionProvider>
      </section>
    </div>
  );
}
