import type { Metadata } from "next";

import { PopoverSpecimens } from "./popover-specimens";

export const metadata: Metadata = { title: "Popover workshop | Ninaero" };

export default function PopoverWorkshopPage() {
  return (
    <div className="flex flex-col gap-8 [overflow-wrap:anywhere]">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Popovers</h1>
        <p className="text-muted-foreground">
          Rounded floating panels with shallow shading and a soft opening bounce.
        </p>
        <p className="text-sm text-muted-foreground">
          Open a panel with Enter, Space, or a pointer. Tab moves through its controls. Escape or an
          outside press dismisses it. Example values are not saved.
        </p>
      </header>
      <PopoverSpecimens />
    </div>
  );
}
