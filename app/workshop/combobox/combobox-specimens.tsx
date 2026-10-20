"use client";

import { Button } from "@/registry/ninaero/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/registry/ninaero/ui/combobox";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";

const fruit = ["Apple", "Banana", "Cherry", "Dragon fruit", "Mango", "Pear"];
const longFruit = [
  "Apple",
  "Banana",
  "A very long fruit name that wraps inside a narrow menu",
  "Pear",
];

function FruitOptions() {
  return (
    <>
      <ComboboxEmpty>No matching fruit</ComboboxEmpty>
      <ComboboxList>
        {(item: string) => (
          <ComboboxItem key={item} value={item} disabled={item === "Dragon fruit"}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </>
  );
}

function FruitSearch({
  id,
  disabled = false,
  invalid = false,
  readOnly = false,
}: {
  id: string;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
}) {
  return (
    <Field data-disabled={disabled || undefined} data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={id}>
        {disabled
          ? "Disabled fruit"
          : invalid
            ? "Invalid fruit"
            : readOnly
              ? "Read-only fruit"
              : "Fruit"}
      </FieldLabel>
      <Combobox
        items={fruit}
        defaultValue={invalid ? null : "Apple"}
        disabled={disabled}
        readOnly={readOnly}
      >
        <ComboboxInput
          id={id}
          placeholder="Choose a fruit"
          showClear={!readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
        />
        <ComboboxContent>
          <FruitOptions />
        </ComboboxContent>
      </Combobox>
      {invalid && <FieldError id={`${id}-error`}>Choose a fruit.</FieldError>}
    </Field>
  );
}

function MultipleFruit({
  id,
  disabled = false,
  invalid = false,
}: {
  id: string;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const anchor = useComboboxAnchor();
  return (
    <Field data-disabled={disabled || undefined} data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={id}>
        {disabled ? "Disabled selection" : invalid ? "Invalid selection" : "Fruit basket"}
      </FieldLabel>
      <Combobox items={fruit} multiple defaultValue={["Apple", "Cherry"]} disabled={disabled}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id={id}
                  placeholder="Add fruit"
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? `${id}-error` : undefined}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <FruitOptions />
        </ComboboxContent>
      </Combobox>
      {invalid && <FieldError id={`${id}-error`}>Choose another fruit.</FieldError>}
    </Field>
  );
}

export function ComboboxSpecimens() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Shared field treatment</FieldLegend>
        <FieldGroup className="grid items-start sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="combobox-compare-input">Input</FieldLabel>
            <Input id="combobox-compare-input" defaultValue="Apple" />
          </Field>
          <Field>
            <FieldLabel htmlFor="combobox-compare-select">Select</FieldLabel>
            <Select items={fruit.map((value) => ({ label: value, value }))} defaultValue="Apple">
              <SelectTrigger id="combobox-compare-select" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {fruit.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <FruitSearch id="combobox-fruit" />
        </FieldGroup>
      </FieldSet>

      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Field states</FieldLegend>
        <FieldGroup className="grid items-start sm:grid-cols-2">
          <FruitSearch id="combobox-invalid" invalid />
          <FruitSearch id="combobox-disabled" disabled />
          <FruitSearch id="combobox-readonly" readOnly />
          <Field>
            <FieldLabel htmlFor="combobox-long">Long options</FieldLabel>
            <Combobox items={longFruit}>
              <ComboboxInput id="combobox-long" placeholder="Choose a fruit" />
              <ComboboxContent>
                <FruitOptions />
              </ComboboxContent>
            </Combobox>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Multiple selection</FieldLegend>
        <FieldGroup>
          <MultipleFruit id="combobox-multiple" />
          <MultipleFruit id="combobox-multiple-invalid" invalid />
          <MultipleFruit id="combobox-multiple-disabled" disabled />
        </FieldGroup>
      </FieldSet>

      <FieldSet className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Search inside the popup</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="combobox-popup-trigger">Fruit</FieldLabel>
            <Combobox items={fruit} defaultValue="Banana">
              <ComboboxTrigger
                render={
                  <Button
                    variant="outline"
                    className="ninaero-rounded-control w-full justify-between"
                  />
                }
                id="combobox-popup-trigger"
              >
                <ComboboxValue />
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxInput
                  aria-label="Search fruit"
                  placeholder="Search fruit"
                  showTrigger={false}
                />
                <ComboboxGroup>
                  <ComboboxLabel>Fruit</ComboboxLabel>
                  <FruitOptions />
                </ComboboxGroup>
              </ComboboxContent>
            </Combobox>
            <FieldDescription>Dragon fruit is unavailable.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>

      <DirectionProvider direction="rtl">
        <FieldSet dir="rtl" className="button-specimen ninaero-surface-paper bg-(--paper-fill) p-6">
          <FieldLegend>Right-to-left</FieldLegend>
          <FieldGroup>
            <FruitSearch id="combobox-rtl" />
            <MultipleFruit id="combobox-multiple-rtl" />
          </FieldGroup>
        </FieldSet>
      </DirectionProvider>
    </div>
  );
}
