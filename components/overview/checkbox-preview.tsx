import { useId } from "react";

import { Checkbox } from "@/registry/ninaero/ui/checkbox";
import { Label } from "@/registry/ninaero/ui/label";

export function CheckboxPreview() {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} defaultChecked />
      <Label htmlFor={id}>Include notes</Label>
    </div>
  );
}
