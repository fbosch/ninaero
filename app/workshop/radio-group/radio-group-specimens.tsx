"use client";

import { type ComponentProps, useState } from "react";

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
import { RadioGroup, RadioGroupItem } from "@/registry/ninaero/ui/radio-group";

type Choice = {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
};

const formats: readonly Choice[] = [
  { value: "ruled", label: "Ruled" },
  { value: "dotted", label: "Dotted" },
  { value: "grid", label: "Grid" },
];

function RadioChoices({
  id,
  choices = formats,
  invalid,
  ...props
}: ComponentProps<typeof RadioGroup> & {
  id: string;
  choices?: readonly Choice[];
  invalid?: boolean;
}) {
  return (
    <RadioGroup {...props} id={id} aria-labelledby={`${id}-legend`}>
      <FieldGroup className="gap-4">
        {choices.map(({ value, label, hint, disabled }) => {
          const itemId = `${id}-${value}`;
          return (
            <Field
              key={value}
              orientation="horizontal"
              data-disabled={props.disabled || disabled || undefined}
              data-invalid={invalid || undefined}
            >
              <RadioGroupItem
                id={itemId}
                value={value}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                aria-describedby={hint ? `${itemId}-hint` : undefined}
              />
              <FieldContent>
                <FieldLabel htmlFor={itemId}>{label}</FieldLabel>
                {hint && <FieldDescription id={`${itemId}-hint`}>{hint}</FieldDescription>}
              </FieldContent>
            </Field>
          );
        })}
      </FieldGroup>
    </RadioGroup>
  );
}

export function RadioGroupSpecimens() {
  const [format, setFormat] = useState("ruled");

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend id="format-legend">Choose a notebook format</FieldLegend>
        <RadioChoices
          id="format"
          name="notebook-format"
          value={format}
          onValueChange={setFormat}
          choices={[
            ...formats,
            {
              value: "blank",
              label: "Blank",
              hint: "Not available in this example.",
              disabled: true,
            },
          ]}
        />
        <p role="status" className="text-sm text-muted-foreground">
          Selected format: {formats.find((choice) => choice.value === format)?.label}
        </p>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend id="empty-legend">No initial selection</FieldLegend>
        <RadioChoices id="empty" name="empty-format" />
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend id="invalid-legend">Invalid</FieldLegend>
        <FieldDescription id="invalid-description">
          Visual examples; no validation runs.
        </FieldDescription>
        <RadioChoices
          id="invalid"
          name="invalid-format"
          defaultValue="ruled"
          aria-describedby="invalid-description"
          invalid
        />
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend id="disabled-legend">Disabled</FieldLegend>
        <RadioChoices id="disabled" name="disabled-format" defaultValue="ruled" disabled />
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend id="readonly-legend">Read-only</FieldLegend>
        <RadioChoices id="readonly" name="readonly-format" defaultValue="ruled" readOnly />
      </FieldSet>

      <DirectionProvider direction="rtl">
        <FieldSet dir="rtl" className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <FieldLegend id="rtl-legend">Right-to-left</FieldLegend>
          <RadioChoices
            id="rtl"
            name="rtl-format"
            defaultValue="ruled"
            choices={[
              ...formats,
              {
                value: "wide",
                label: "Wide ruled pages with extra space for notes from shared notebooks",
              },
            ]}
          />
        </FieldSet>
      </DirectionProvider>
    </div>
  );
}
