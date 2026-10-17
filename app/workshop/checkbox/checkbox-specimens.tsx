"use client";

import { type ComponentProps, useState } from "react";

import { Checkbox } from "@/registry/ninaero/ui/checkbox";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/ninaero/ui/field";

function CheckboxField({
  id,
  label,
  hint,
  ...props
}: ComponentProps<typeof Checkbox> & {
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
      <Checkbox
        {...props}
        id={id}
        aria-describedby={hint ? `${id}-hint` : props["aria-describedby"]}
      />
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {hint && <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>}
      </FieldContent>
    </Field>
  );
}

const drawings = ["Garden", "Clouds", "Tidepool"] as const;

export function CheckboxSpecimens() {
  const [selected, setSelected] = useState<string[]>(["Garden"]);
  const allSelected = selected.length === drawings.length;
  const someSelected = selected.length > 0 && !allSelected;

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Choose drawings</FieldLegend>
        <FieldGroup>
          <CheckboxField
            id="all-drawings"
            label="Select all drawings"
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={(checked) => setSelected(checked ? [...drawings] : [])}
          />
          {drawings.map((drawing) => (
            <CheckboxField
              key={drawing}
              id={`drawing-${drawing.toLowerCase()}`}
              label={drawing}
              checked={selected.includes(drawing)}
              onCheckedChange={(checked) =>
                setSelected((current) =>
                  checked ? [...current, drawing] : current.filter((item) => item !== drawing),
                )
              }
            />
          ))}
        </FieldGroup>
        <p role="status" className="text-sm text-muted-foreground">
          {selected.length} of {drawings.length} selected
        </p>
      </FieldSet>
      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>States</FieldLegend>
        <FieldDescription>Invalid states are visual examples; no validation runs.</FieldDescription>
        <FieldGroup>
          <CheckboxField id="unchecked" label="Unchecked" />
          <CheckboxField id="checked" label="Checked" defaultChecked />
          <CheckboxField id="mixed" label="Indeterminate" indeterminate />
          <CheckboxField id="invalid-unchecked" label="Invalid unchecked" aria-invalid="true" />
          <CheckboxField
            id="invalid-checked"
            label="Invalid checked"
            aria-invalid="true"
            defaultChecked
          />
          <CheckboxField
            id="invalid-mixed"
            label="Invalid indeterminate"
            aria-invalid="true"
            indeterminate
          />
          <CheckboxField id="disabled-unchecked" label="Disabled unchecked" disabled />
          <CheckboxField id="disabled-checked" label="Disabled checked" defaultChecked disabled />
          <CheckboxField
            id="disabled-mixed"
            label="Disabled indeterminate"
            indeterminate
            disabled
          />
          <CheckboxField id="readonly-unchecked" label="Read-only unchecked" readOnly />
          <CheckboxField id="readonly-checked" label="Read-only checked" defaultChecked readOnly />
        </FieldGroup>
      </FieldSet>
      <DirectionProvider direction="rtl">
        <FieldSet dir="rtl" className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <FieldLegend>Right-to-left</FieldLegend>
          <FieldGroup>
            <CheckboxField id="rtl-unchecked" label="Right-to-left unchecked" />
            <CheckboxField id="rtl-checked" label="Right-to-left checked" defaultChecked />
            <CheckboxField id="rtl-mixed" label="Right-to-left indeterminate" indeterminate />
            <Field orientation="horizontal">
              <FieldLabel>
                <Checkbox />
                Include drawings from shared notebooks in this preview selection
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
      </DirectionProvider>
    </div>
  );
}
