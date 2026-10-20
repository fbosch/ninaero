"use client";

import { cn } from "cn";
import * as React from "react";
import {
  type DayButton,
  DayPicker,
  type DropdownProps,
  getDefaultClassNames,
  type Locale,
} from "react-day-picker";

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "outline",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "ninaero-calendar group/calendar bg-background p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-min max-w-full", defaultClassNames.root),
        months: cn("relative flex flex-col gap-6 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "pointer-events-none absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          "ninaero-calendar-nav pointer-events-auto size-(--cell-size) p-0 select-none",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          "ninaero-calendar-nav pointer-events-auto size-(--cell-size) p-0 select-none",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex min-h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex flex-wrap items-center justify-center gap-2",
          defaultClassNames.dropdowns,
        ),
        caption_label: cn("text-sm type-label select-none", defaultClassNames.caption_label),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 text-xs type-label text-muted-foreground select-none",
          defaultClassNames.weekday,
        ),
        week: cn("ninaero-calendar-week mt-1 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "ninaero-calendar-week-number text-xs type-body text-muted-foreground select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "ninaero-calendar-day group/day relative size-(--cell-size) p-0 text-center select-none",
          defaultClassNames.day,
        ),
        range_start: cn("ninaero-calendar-range-start", defaultClassNames.range_start),
        range_middle: cn("ninaero-calendar-range-middle", defaultClassNames.range_middle),
        range_end: cn("ninaero-calendar-range-end", defaultClassNames.range_end),
        today: cn("ninaero-calendar-today", defaultClassNames.today),
        outside: defaultClassNames.outside,
        disabled: defaultClassNames.disabled,
        hidden: cn("invisible", defaultClassNames.hidden),
        footer: cn("mt-3 text-sm type-body text-muted-foreground", defaultClassNames.footer),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
          }
          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
          }
          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        PreviousMonthButton: (props) => (
          <Button
            variant={buttonVariant}
            size="icon"
            {...props}
            disabled={props.disabled || props["aria-disabled"] === true}
          />
        ),
        NextMonthButton: (props) => (
          <Button
            variant={buttonVariant}
            size="icon"
            {...props}
            disabled={props.disabled || props["aria-disabled"] === true}
          />
        ),
        Dropdown: CalendarDropdown,
        DayButton: (props) => <CalendarDayButton locale={locale} {...props} />,
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDropdown({
  options,
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
  className,
  style,
}: DropdownProps) {
  return (
    <Select
      value={String(value)}
      disabled={disabled}
      onValueChange={(value) => {
        // DayPicker's month/year handlers read target.value instead of accepting a value directly.
        onChange?.({ target: { value: String(value) } } as React.ChangeEvent<HTMLSelectElement>);
      }}
    >
      <SelectTrigger size="sm" aria-label={ariaLabel} className={className} style={style}>
        <SelectValue>
          {options?.find((option) => String(option.value) === String(value))?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem key={option.value} value={String(option.value)} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "ninaero-calendar-day-button relative flex size-(--cell-size) flex-col gap-1 p-0 text-sm type-body leading-none group-data-[focused=true]/day:z-10 [&>span]:text-xs",
        defaultClassNames.day_button,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
