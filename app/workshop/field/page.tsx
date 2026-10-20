import type { Metadata } from "next";

import { FieldSpecimens } from "./field-specimens";

export const metadata: Metadata = { title: "Field workshop | Ninaero" };

export default function FieldWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Fields</h1>
        <p className="text-muted-foreground">
          Labels, descriptions, and errors arranged around library controls.
        </p>
        <p className="text-sm text-muted-foreground">
          These forms are examples. Nothing is submitted or saved.
        </p>
      </header>
      <FieldSpecimens />
    </div>
  );
}
