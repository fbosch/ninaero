import type { Metadata } from "next";

import { CalendarSpecimens } from "./calendar-specimens";

export const metadata: Metadata = { title: "Calendar workshop | Ninaero" };

export default function CalendarWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Calendar</h1>
        <p className="text-muted-foreground">
          Date selection, joined ranges, unavailable dates, and month navigation.
        </p>
        <p className="text-sm text-muted-foreground">
          These selections are examples. Nothing is saved.
        </p>
      </header>
      <CalendarSpecimens />
    </div>
  );
}
