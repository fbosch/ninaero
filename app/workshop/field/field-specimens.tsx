"use client";

import Link from "next/link";

import { Checkbox } from "@/registry/ninaero/ui/checkbox";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";
import { RadioGroup, RadioGroupItem } from "@/registry/ninaero/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";
import { Switch } from "@/registry/ninaero/ui/switch";
import { Textarea } from "@/registry/ninaero/ui/textarea";

const notebooks = [
  { label: "Sketchbook", value: "sketchbook" },
  { label: "Field notes", value: "field-notes" },
  { label: "Postcards", value: "postcards" },
];

const plans = [
  { value: "pocket", title: "Pocket", description: "One notebook, synced to this device." },
  { value: "studio", title: "Studio", description: "Unlimited notebooks shared with a team." },
];

function NotebookSelect({
  id,
  describedBy,
  invalid,
}: {
  id: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  return (
    <Select items={notebooks} defaultValue="sketchbook">
      <SelectTrigger
        id={id}
        className="w-full"
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {notebooks.map((notebook) => (
          <SelectItem key={notebook.value} value={notebook.value}>
            {notebook.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FieldSpecimens() {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Vertical form</FieldLegend>
        <FieldDescription>
          Each field stacks its label, control, and help text. Read the{" "}
          <Link href="/docs">documentation</Link> for the full API.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="field-title">Drawing title</FieldLabel>
            <Input
              id="field-title"
              defaultValue="Morning tidepool"
              aria-describedby="field-title-help"
            />
            <FieldDescription id="field-title-help">
              Shown above the drawing in shared links.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="field-notebook">Notebook</FieldLabel>
            <NotebookSelect id="field-notebook" />
          </Field>
          <Field>
            <FieldLabel htmlFor="field-caption">Caption</FieldLabel>
            <Textarea
              id="field-caption"
              placeholder="Describe the drawing"
              aria-describedby="field-caption-help"
            />
            <FieldDescription id="field-caption-help">Up to 280 characters.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Orientation</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <Switch id="field-autosave" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="field-autosave">Save drafts automatically</FieldLabel>
              <FieldDescription>Keeps a copy every few minutes while you draw.</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="field-author">Author name</FieldLabel>
              <FieldDescription>
                Responsive fields sit side by side in wide groups.
              </FieldDescription>
            </FieldContent>
            <Input id="field-author" defaultValue="Nina" />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Field set with a legend</FieldLegend>
        <FieldDescription>Choose where new drawings appear.</FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          {["Home feed", "Shared notebooks", "Email digest"].map((label) => {
            const id = `field-share-${label.toLowerCase().replaceAll(" ", "-")}`;
            return (
              <Field key={label} orientation="horizontal">
                <Checkbox id={id} defaultChecked={label === "Home feed"} />
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
              </Field>
            );
          })}
        </FieldGroup>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Choice cards</FieldLegend>
        <RadioGroup defaultValue="pocket">
          {plans.map((plan) => (
            <FieldLabel key={plan.value} htmlFor={`field-plan-${plan.value}`}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{plan.title}</FieldTitle>
                  <FieldDescription>{plan.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem id={`field-plan-${plan.value}`} value={plan.value} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        <FieldLabel htmlFor="field-plan-backup">
          <Field orientation="horizontal">
            <Checkbox id="field-plan-backup" defaultChecked />
            <FieldContent>
              <FieldTitle>Cloud backup</FieldTitle>
              <FieldDescription>Keep a copy of every notebook online.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </FieldSet>

      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>States</FieldLegend>
        <FieldDescription>Invalid states are visual examples; no validation runs.</FieldDescription>
        <FieldGroup>
          <Field data-invalid="true">
            <FieldLabel htmlFor="field-invalid-email">Email</FieldLabel>
            <Input
              id="field-invalid-email"
              type="email"
              defaultValue="nina@"
              aria-invalid="true"
              aria-describedby="field-invalid-email-error"
            />
            <FieldError id="field-invalid-email-error">Enter a complete email address.</FieldError>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="field-invalid-notebook">Notebook</FieldLabel>
            <NotebookSelect
              id="field-invalid-notebook"
              invalid
              describedBy="field-invalid-notebook-error"
            />
            <FieldError
              id="field-invalid-notebook-error"
              errors={[
                { message: "Choose a notebook you can edit." },
                { message: "Sketchbook is shared as read-only." },
              ]}
            />
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="field-disabled">Workspace</FieldLabel>
            <Input
              id="field-disabled"
              defaultValue="Ninaero studio"
              disabled
              aria-describedby="field-disabled-help"
            />
            <FieldDescription id="field-disabled-help">
              Only owners can rename the workspace.
            </FieldDescription>
          </Field>
          <Field orientation="horizontal" data-disabled="true">
            <Checkbox id="field-disabled-check" disabled defaultChecked />
            <FieldLabel htmlFor="field-disabled-check">Locked by your organization</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="button-specimen bg-card p-6">
        <FieldLegend>Separated groups</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="field-sep-name">Display name</FieldLabel>
            <Input id="field-sep-name" defaultValue="Nina" />
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field>
            <FieldLabel htmlFor="field-sep-handle">Handle</FieldLabel>
            <Input id="field-sep-handle" defaultValue="@nina" />
          </Field>
        </FieldGroup>
      </FieldSet>

      <DirectionProvider direction="rtl">
        <FieldSet dir="rtl" className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <FieldLegend>Right-to-left</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="field-rtl-title">Drawing title</FieldLabel>
              <Input
                id="field-rtl-title"
                defaultValue="Morning tidepool"
                aria-describedby="field-rtl-help"
              />
              <FieldDescription id="field-rtl-help">
                Shown above the drawing in shared links.
              </FieldDescription>
            </Field>
            <Field orientation="horizontal">
              <Switch id="field-rtl-autosave" defaultChecked />
              <FieldLabel htmlFor="field-rtl-autosave">Save drafts automatically</FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
      </DirectionProvider>
    </div>
  );
}
