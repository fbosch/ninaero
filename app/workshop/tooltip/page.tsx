import type { Metadata } from "next";

import { TooltipSpecimens } from "./tooltip-specimens";

export const metadata: Metadata = { title: "Tooltip workshop | Ninaero" };

export default function TooltipWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Tooltips</h1>
        <p className="text-muted-foreground">
          Inverted neutral faces, fine rims, and soft floating shadows.
        </p>
        <p className="text-sm text-muted-foreground">
          Hover a control or reach it with Tab. Escape dismisses its tooltip. These controls are
          examples and do not perform actions.
        </p>
      </header>
      <TooltipSpecimens />
    </div>
  );
}
