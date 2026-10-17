import type { Metadata } from "next";

import { SwitchSpecimens } from "./switch-specimens";

export const metadata: Metadata = { title: "Switch workshop | Ninaero" };

export default function SwitchWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Switches</h1>
        <p className="text-muted-foreground">Recessed tracks and neutral paper thumbs.</p>
        <p className="text-sm text-muted-foreground">
          These settings are examples and are not saved.
        </p>
      </header>
      <SwitchSpecimens />
    </div>
  );
}
