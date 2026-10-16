"use client";

import { format } from "date-fns";
import { useId, useState } from "react";

import { Button } from "@/registry/ninaero/ui/button";
import { Calendar } from "@/registry/ninaero/ui/calendar";
import { Field, FieldDescription, FieldLabel } from "@/registry/ninaero/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ninaero/ui/popover";

export default function DatePickerPreview() {
  const triggerId = useId();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-sm">
      <Field>
        <FieldLabel htmlFor={triggerId}>Release date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                id={triggerId}
                type="button"
                variant="outline"
                className="ninaero-rounded-control w-full justify-start text-left font-normal"
              />
            }
          >
            {selectedDate ? format(selectedDate, "PPP") : "Choose a date"}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <PopoverTitle className="sr-only">Choose a release date</PopoverTitle>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
        <FieldDescription>Select a day to close the calendar.</FieldDescription>
      </Field>
      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
        {selectedDate ? `Selected date: ${format(selectedDate, "PPP")}` : "No date selected"}
      </p>
    </div>
  );
}
