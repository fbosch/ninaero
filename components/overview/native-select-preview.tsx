import { useId } from "react";

import { Label } from "@/registry/ninaero/ui/label";
import { NativeSelect, NativeSelectOption } from "@/registry/ninaero/ui/native-select";

export function NativeSelectPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Size</Label>
      <NativeSelect id={id} defaultValue="medium">
        <NativeSelectOption value="small">Small</NativeSelectOption>
        <NativeSelectOption value="medium">Medium</NativeSelectOption>
        <NativeSelectOption value="large">Large</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
