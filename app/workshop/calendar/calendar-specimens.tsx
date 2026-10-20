"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { arSA, da } from "react-day-picker/locale";

import { Calendar } from "@/registry/ninaero/ui/calendar";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/ninaero/ui/field";

const month = new Date(2026, 4, 1);
const today = new Date(2026, 4, 14);
const initialRange: DateRange = { from: new Date(2026, 4, 8), to: new Date(2026, 5, 9) };
const unavailable = [{ dayOfWeek: [0, 6] }, new Date(2026, 4, 20)];
const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export function CalendarSpecimens() {
  const [date, setDate] = useState<Date | undefined>(today);
  const [availableDate, setAvailableDate] = useState<Date | undefined>(today);
  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  const [dates, setDates] = useState<Date[] | undefined>([
    new Date(2026, 4, 11),
    new Date(2026, 4, 14),
    new Date(2026, 4, 22),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-wrap items-start gap-8" aria-label="Selection modes">
        <Field className="w-fit">
          <FieldLabel id="calendar-single-label">Choose a date</FieldLabel>
          <Calendar
            mode="single"
            defaultMonth={month}
            today={today}
            selected={date}
            onSelect={setDate}
            aria-labelledby="calendar-single-label"
            footer={date ? `Selected: ${dateFormat.format(date)}` : "No date selected"}
          />
          <FieldDescription>Use the arrow keys to move between dates.</FieldDescription>
        </Field>
        <Field className="w-fit">
          <FieldLabel id="calendar-multiple-label">Choose several dates</FieldLabel>
          <Calendar
            mode="multiple"
            defaultMonth={month}
            today={today}
            selected={dates}
            onSelect={setDates}
            aria-labelledby="calendar-multiple-label"
            footer={`Selected dates: ${dates?.length ?? 0}`}
          />
        </Field>
      </section>

      <section className="flex flex-col items-start gap-4" aria-labelledby="calendar-range-heading">
        <h2 id="calendar-range-heading" className="text-xl type-heading">
          Date range
        </h2>
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={month}
          today={today}
          selected={range}
          onSelect={setRange}
          aria-labelledby="calendar-range-heading"
          footer={
            range?.from
              ? range.to
                ? `${dateFormat.format(range.from)} – ${dateFormat.format(range.to)}`
                : `Starts ${dateFormat.format(range.from)}; choose an end date`
              : "Choose a start date"
          }
        />
      </section>

      <section className="flex flex-wrap items-start gap-8" aria-label="Calendar states">
        <Field className="w-fit">
          <FieldLabel id="calendar-unavailable-label">Available dates</FieldLabel>
          <Calendar
            mode="single"
            defaultMonth={month}
            today={today}
            selected={availableDate}
            onSelect={setAvailableDate}
            disabled={unavailable}
            aria-labelledby="calendar-unavailable-label"
          />
          <FieldDescription>Weekends and May 20 are unavailable.</FieldDescription>
        </Field>
        <Field className="w-fit" data-disabled>
          <FieldLabel id="calendar-disabled-label">Disabled calendar</FieldLabel>
          <Calendar
            mode="single"
            defaultMonth={month}
            today={today}
            selected={today}
            disabled
            disableNavigation
            aria-labelledby="calendar-disabled-label"
          />
        </Field>
        <Field className="w-fit" data-invalid>
          <FieldLabel id="calendar-invalid-label">Required date</FieldLabel>
          <Calendar
            mode="single"
            defaultMonth={month}
            today={today}
            aria-invalid
            aria-labelledby="calendar-invalid-label"
            aria-describedby="calendar-invalid-error"
          />
          <FieldError id="calendar-invalid-error">Choose a date.</FieldError>
        </Field>
      </section>

      <section
        className="flex flex-wrap items-start gap-8"
        aria-label="Calendar navigation and range edges"
      >
        <Field className="w-fit">
          <FieldLabel id="calendar-dropdown-label">Month and year</FieldLabel>
          <Calendar
            mode="single"
            captionLayout="dropdown"
            locale={da}
            showWeekNumber
            weekStartsOn={1}
            startMonth={new Date(2025, 0)}
            endMonth={new Date(2027, 11)}
            defaultMonth={month}
            today={today}
            aria-labelledby="calendar-dropdown-label"
          />
        </Field>
        <Field className="w-fit">
          <FieldLabel id="calendar-same-day-label">Single-day range</FieldLabel>
          <Calendar
            mode="range"
            defaultMonth={month}
            today={today}
            selected={{ from: today, to: today }}
            aria-labelledby="calendar-same-day-label"
          />
        </Field>
        <DirectionProvider direction="rtl">
          <Field className="w-fit" dir="rtl">
            <FieldLabel id="calendar-rtl-label">نطاق التاريخ</FieldLabel>
            <Calendar
              mode="range"
              dir="rtl"
              locale={arSA}
              defaultMonth={month}
              today={today}
              selected={initialRange}
              aria-labelledby="calendar-rtl-label"
            />
          </Field>
        </DirectionProvider>
      </section>
    </div>
  );
}
