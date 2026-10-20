"use client";

import { useState } from "react";

import type { PreviewProps } from "@/lib/component-overview";
import { Calendar } from "@/registry/ninaero/ui/calendar";

export default function CalendarPreview({ interactive }: PreviewProps) {
  const [selected, setSelected] = useState<Date | undefined>(new Date(2026, 4, 14));
  return (
    <div className="flex flex-col gap-2">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={interactive ? setSelected : undefined}
        defaultMonth={new Date(2026, 4, 1)}
        className="mx-auto"
      />
      {interactive && (
        <p className="text-center text-xs text-muted-foreground" aria-live="polite">
          {selected ? `Selected: ${selected.toLocaleDateString()}` : "Choose a date"}
        </p>
      )}
    </div>
  );
}
