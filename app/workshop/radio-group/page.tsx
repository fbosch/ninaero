import type { Metadata } from "next";

import { RadioGroupSpecimens } from "./radio-group-specimens";

export const metadata: Metadata = { title: "Radio Group workshop | Ninaero" };

export default function RadioGroupWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Radio Group</h1>
        <p className="text-muted-foreground">
          Circular paper recesses with accent-glass selection.
        </p>
        <p className="text-sm text-muted-foreground">
          These selections are examples and are not saved.
        </p>
      </header>
      <RadioGroupSpecimens />
    </div>
  );
}
