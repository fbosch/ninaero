"use client";

import { useState } from "react";
import type { PreviewProps } from "@/lib/component-overview";
import { Calendar } from "@/registry/ninaero/ui/calendar";

export default function CalendarPreview({ interactive }: PreviewProps) {
  const [selected, setSelected] = useState<Date>();
  return (
    <div className="space-y-2">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={interactive ? setSelected : undefined}
        defaultMonth={new Date(2025, 4, 1)}
        className="mx-auto"
      />
      {interactive && (
        <p
          className="text-center text-xs text-muted-foreground"
          aria-live="polite"
        >
          {selected
            ? `Selected: ${selected.toLocaleDateString()}`
            : "Choose a date"}
        </p>
      )}
    </div>
  );
}
