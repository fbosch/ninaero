import type { Metadata } from "next";

import { Button } from "@/registry/ninaero/ui/button";
import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";
import { Textarea } from "@/registry/ninaero/ui/textarea";

export const metadata: Metadata = { title: "Input workshop | Ninaero" };

const selectChoices = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "custom", label: "Custom (unavailable)", disabled: true },
];

function SelectSpecimen({
  id,
  defaultValue,
  disabled,
  readOnly,
  invalid,
  size,
}: {
  id: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  size?: "sm" | "default";
}) {
  return (
    <Select
      items={selectChoices}
      defaultValue={defaultValue}
      disabled={disabled}
      readOnly={readOnly}
    >
      <SelectTrigger
        id={id}
        size={size}
        className="w-full"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? "invalid-select-hint" : undefined}
      >
        <SelectValue placeholder="Choose a color mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Color modes</SelectLabel>
          {selectChoices.map((choice) => (
            <SelectItem key={choice.value} value={choice.value} disabled={choice.disabled}>
              {choice.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function InputWorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Inputs</h1>
        <p className="text-muted-foreground">
          Single-line, multiline, and selection fields with matching materials and states.
        </p>
        <p className="text-sm text-muted-foreground">
          Squircle corners require browser support for CSS corner-shape. Other browsers show
          ordinary rounded corners. Use Tab to inspect keyboard focus.
        </p>
      </header>
      <div className="button-specimen ninaero-paper-ruled max-w-lg space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="editable-input">Editable input</Label>
          <Input id="editable-input" placeholder="Try typing here" />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">Secondary action</Button>
            <Button variant="outline">Outline action</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="disabled-input">Disabled input</Label>
          <Input id="disabled-input" disabled defaultValue="Unavailable" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="readonly-input">Read-only input</Label>
          <Input id="readonly-input" readOnly defaultValue="Select and copy this text" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invalid-input">Invalid input</Label>
          <Input
            id="invalid-input"
            aria-invalid="true"
            aria-describedby="invalid-hint"
            defaultValue="Invalid-state example"
          />
          <p id="invalid-hint" className="text-xs text-muted-foreground">
            This is a visual specimen, not live validation.
          </p>
        </div>
      </div>
      <section aria-labelledby="textarea-states" className="space-y-3">
        <h2 id="textarea-states" className="text-xl font-semibold">
          Textareas
        </h2>
        <div className="button-specimen ninaero-paper-ruled max-w-lg space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="editable-textarea">Editable textarea</Label>
            <Textarea id="editable-textarea" placeholder="Try typing a few lines" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled-textarea">Disabled textarea</Label>
            <Textarea id="disabled-textarea" disabled defaultValue="Unavailable" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="readonly-textarea">Read-only textarea</Label>
            <Textarea
              id="readonly-textarea"
              readOnly
              defaultValue={"Select and copy this text.\nThis field keeps its multiline layout."}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invalid-textarea">Invalid textarea</Label>
            <Textarea
              id="invalid-textarea"
              aria-invalid="true"
              aria-describedby="invalid-textarea-hint"
              defaultValue={"Invalid-state example\nThe field keeps its neutral fill."}
            />
            <p id="invalid-textarea-hint" className="text-xs text-muted-foreground">
              This is a visual specimen, not live validation.
            </p>
          </div>
        </div>
      </section>
      <section aria-labelledby="select-states" className="space-y-3">
        <h2 id="select-states" className="text-xl font-semibold">
          Selects
        </h2>
        <div className="button-specimen ninaero-paper-ruled max-w-lg space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="editable-select">Editable select</Label>
            <SelectSpecimen id="editable-select" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled-select">Disabled select</Label>
            <SelectSpecimen id="disabled-select" disabled defaultValue="system" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="readonly-select">Read-only select</Label>
            <SelectSpecimen id="readonly-select" readOnly defaultValue="system" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invalid-select">Invalid select</Label>
            <SelectSpecimen id="invalid-select" invalid defaultValue="system" />
            <p id="invalid-select-hint" className="text-xs text-muted-foreground">
              This is a visual specimen, not live validation.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="compact-select">Compact select</Label>
            <SelectSpecimen id="compact-select" size="sm" defaultValue="system" />
          </div>
        </div>
      </section>
    </div>
  );
}
