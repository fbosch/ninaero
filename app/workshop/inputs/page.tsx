import type { Metadata } from "next";

import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";

export const metadata: Metadata = { title: "Input workshop | Ninaero" };

export default function InputWorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Inputs</h1>
        <p className="text-muted-foreground">
          Opaque fills with editable, disabled, and invalid states.
        </p>
      </header>
      <div className="button-specimen ninaero-paper-ruled max-w-lg space-y-5 p-6">
        <div className="space-y-2">
          <Label htmlFor="editable-input">Editable input</Label>
          <Input id="editable-input" placeholder="Try typing here" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disabled-input">Disabled input</Label>
          <Input id="disabled-input" disabled defaultValue="Unavailable" />
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
    </div>
  );
}
