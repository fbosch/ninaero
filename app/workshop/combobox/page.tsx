import type { Metadata } from "next";

import { ComboboxSpecimens } from "./combobox-specimens";

export const metadata: Metadata = { title: "Combobox workshop | Ninaero" };

export default function ComboboxWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Combobox</h1>
        <p className="text-muted-foreground">
          Searchable selection, removable chips, and floating lists.
        </p>
        <p className="text-sm text-muted-foreground">
          These selections are examples. Nothing is saved.
        </p>
      </header>
      <ComboboxSpecimens />
    </div>
  );
}
