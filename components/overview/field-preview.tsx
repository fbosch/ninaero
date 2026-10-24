import { useId } from "react";

import { Field, FieldDescription, FieldLabel } from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";

export function FieldPreview() {
  const id = useId();
  return (
    <Field className="w-full max-w-64">
      <FieldLabel htmlFor={id}>Display name</FieldLabel>
      <Input id={id} placeholder="Your name" />
      <FieldDescription>Only shown in this example.</FieldDescription>
    </Field>
  );
}
