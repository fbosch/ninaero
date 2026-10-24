import { useId } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/ninaero/ui/combobox";
import { Field, FieldLabel } from "@/registry/ninaero/ui/field";

export function ComboboxPreview() {
  const id = useId();
  return (
    <Field className="w-full max-w-64">
      <FieldLabel htmlFor={id}>Fruit</FieldLabel>
      <Combobox items={["Apple", "Banana", "Cherry"]}>
        <ComboboxInput id={id} placeholder="Choose a fruit" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No matching fruit</ComboboxEmpty>
          <ComboboxList>
            {(fruit: string) => (
              <ComboboxItem key={fruit} value={fruit}>
                {fruit}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
