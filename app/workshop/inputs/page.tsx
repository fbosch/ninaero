import type { Metadata } from "next";

import { Button } from "@/registry/ninaero/ui/button";
import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";
import { Textarea } from "@/registry/ninaero/ui/textarea";

export const metadata: Metadata = { title: "Input workshop | Ninaero" };

export default function InputWorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Inputs</h1>
        <p className="text-muted-foreground">
          Single-line and multiline fields with matching materials and states.
        </p>
        <p className="text-sm text-muted-foreground">
          Squircle corners require browser support for CSS corner-shape. Other browsers show
          ordinary rounded corners. Use Tab to inspect keyboard focus.
        </p>
      </header>
      <div className="button-specimen ninaero-paper-ruled max-w-lg space-y-5 p-6">
        <div className="space-y-2">
          <Label htmlFor="editable-input">Editable input</Label>
          <Input id="editable-input" placeholder="Try typing here" />
          <div className="flex flex-wrap gap-2 pt-1">
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
        <div className="button-specimen ninaero-paper-ruled max-w-lg space-y-5 p-6">
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
    </div>
  );
}
