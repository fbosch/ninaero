"use client";

import { useState } from "react";

import { CheckIcon, FileTextIcon } from "@/lib/icons";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/ninaero/ui/field";
import { Toggle } from "@/registry/ninaero/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ninaero/ui/toggle-group";

const sizes = [
  { value: "sm", label: "Small" },
  { value: "default", label: "Default" },
  { value: "lg", label: "Large" },
] as const;

const alignments = ["Left", "Center", "Right"] as const;

export function ToggleSpecimens() {
  const [reviewed, setReviewed] = useState(false);
  const [alignment, setAlignment] = useState<string[]>(["Left"]);
  const [formatting, setFormatting] = useState<string[]>(["Bold"]);

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Standalone</FieldLegend>
        <div className="flex flex-wrap items-center gap-3">
          <Toggle id="reviewed" pressed={reviewed} onPressedChange={setReviewed}>
            <CheckIcon data-icon="inline-start" />
            Reviewed
          </Toggle>
          <Toggle variant="outline">
            <FileTextIcon data-icon="inline-start" />
            Show guide lines
          </Toggle>
          <Toggle variant="outline" aria-label="Show drawing details" defaultPressed>
            <FileTextIcon />
          </Toggle>
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          Drawing {reviewed ? "reviewed" : "not reviewed"}.
        </p>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Variants and sizes</FieldLegend>
        <FieldGroup>
          {(["default", "outline"] as const).map((variant) => (
            <Field key={variant}>
              <FieldLabel id={`${variant}-sizes`}>
                {variant === "default" ? "Default" : "Outline"}
              </FieldLabel>
              <div
                role="group"
                aria-labelledby={`${variant}-sizes`}
                className="flex flex-wrap gap-3"
              >
                {sizes.map(({ value, label }) => (
                  <Toggle
                    key={value}
                    variant={variant}
                    size={value}
                    defaultPressed={value === "default"}
                    aria-label={`${variant} ${label}`}
                  >
                    {label}
                  </Toggle>
                ))}
              </div>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>

      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend id="alignment-legend">Single selection</FieldLegend>
        <FieldDescription>Select the active option again to clear it.</FieldDescription>
        <ToggleGroup
          id="alignment"
          aria-labelledby="alignment-legend"
          variant="outline"
          spacing={0}
          value={alignment}
          onValueChange={setAlignment}
        >
          {alignments.map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p role="status" className="text-sm text-muted-foreground">
          Selected alignment: {alignment[0] ?? "None"}
        </p>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend id="formatting-legend">Multiple selection</FieldLegend>
        <ToggleGroup
          id="formatting"
          aria-labelledby="formatting-legend"
          multiple
          variant="outline"
          value={formatting}
          onValueChange={setFormatting}
        >
          {["Bold", "Italic", "Underline"].map((value) => (
            <ToggleGroupItem key={value} value={value} disabled={value === "Underline"}>
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p role="status" className="text-sm text-muted-foreground">
          Selected formatting: {formatting.join(", ") || "None"}
        </p>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend id="vertical-legend">Joined vertical group</FieldLegend>
        <ToggleGroup
          id="vertical"
          aria-labelledby="vertical-legend"
          orientation="vertical"
          variant="outline"
          spacing={0}
          defaultValue={["Medium"]}
        >
          {["Small", "Medium", "Large"].map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Invalid</FieldLegend>
        <FieldDescription id="toggle-invalid-description">
          Visual examples; no validation runs.
        </FieldDescription>
        <div className="flex flex-wrap gap-3">
          <Toggle variant="outline" aria-invalid aria-describedby="toggle-invalid-description">
            Compact view
          </Toggle>
          <Toggle
            variant="outline"
            defaultPressed
            aria-invalid
            aria-describedby="toggle-invalid-description"
          >
            Guide lines
          </Toggle>
        </div>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend id="disabled-toggle-legend">Disabled group</FieldLegend>
        <ToggleGroup
          id="disabled-tools"
          aria-labelledby="disabled-toggle-legend"
          variant="outline"
          spacing={0}
          disabled
          defaultValue={["Grid"]}
        >
          <ToggleGroupItem value="List">List</ToggleGroupItem>
          <ToggleGroupItem value="Grid">Grid</ToggleGroupItem>
        </ToggleGroup>
      </FieldSet>

      <DirectionProvider direction="rtl">
        <FieldSet dir="rtl" className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <FieldLegend id="rtl-toggle-legend">Right-to-left</FieldLegend>
          <ToggleGroup
            id="rtl-toggle"
            aria-labelledby="rtl-toggle-legend"
            variant="outline"
            spacing={0}
            defaultValue={["Start"]}
          >
            {["Start", "Center", "End"].map((value) => (
              <ToggleGroupItem key={value} value={value}>
                {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldSet>
      </DirectionProvider>
    </div>
  );
}
