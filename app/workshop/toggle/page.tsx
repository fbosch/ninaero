import type { Metadata } from "next";

import { ToggleSpecimens } from "./toggle-specimens";

export const metadata: Metadata = { title: "Toggle workshop | Ninaero" };

export default function ToggleWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Toggles</h1>
        <p className="text-muted-foreground">
          Neutral faces with recessed selection and soft press feedback.
        </p>
        <p className="text-sm text-muted-foreground">
          These selections are examples and are not saved.
        </p>
      </header>
      <ToggleSpecimens />
    </div>
  );
}
