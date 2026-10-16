import type { Metadata } from "next";

import { PatternPlayground } from "./pattern-playground";

export const metadata: Metadata = { title: "Pattern workshop | Ninaero" };

export default function PatternWorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl type-display">Patterns</h1>
        <p className="text-muted-foreground">
          Adjust the texture, spacing, and fill. Use the header to compare theme modes and accents.
        </p>
      </header>
      <PatternPlayground />
    </div>
  );
}
