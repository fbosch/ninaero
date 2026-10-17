import type { Metadata } from "next";

import { CheckboxSpecimens } from "./checkbox-specimens";

export const metadata: Metadata = { title: "Checkbox workshop | Ninaero" };

export default function CheckboxWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Checkboxes</h1>
        <p className="text-muted-foreground">
          Recessed paper controls with accent-glass selection.
        </p>
        <p className="text-sm text-muted-foreground">
          These selections are examples and are not saved.
        </p>
      </header>
      <CheckboxSpecimens />
    </div>
  );
}
