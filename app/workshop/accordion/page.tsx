import type { Metadata } from "next";

import { AccordionSpecimens } from "./accordion-specimens";

export const metadata: Metadata = { title: "Accordion workshop | Ninaero" };

export default function AccordionWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Accordion</h1>
        <p className="text-muted-foreground">
          Flat disclosure rows with neutral dividers and a rotating chevron.
        </p>
        <p className="text-sm text-muted-foreground">
          Settings are local to these examples and reset when you leave this page.
        </p>
      </header>
      <AccordionSpecimens />
    </div>
  );
}
