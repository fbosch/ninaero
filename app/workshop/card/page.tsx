import type { Metadata } from "next";

import { CardSpecimens } from "./card-specimens";

export const metadata: Metadata = { title: "Card workshop | Ninaero" };

export default function CardWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Cards</h1>
        <p className="text-muted-foreground">Paper panels with quiet framing and flat elevation.</p>
        <p className="text-sm text-muted-foreground">
          These cards are examples. Their actions do nothing.
        </p>
      </header>
      <CardSpecimens />
    </div>
  );
}
