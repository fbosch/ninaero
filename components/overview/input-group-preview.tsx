import { useId } from "react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/registry/ninaero/ui/input-group";
import { Label } from "@/registry/ninaero/ui/label";

export function InputGroupPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Website</Label>
      <InputGroup>
        <InputGroupInput id={id} placeholder="example.com" />
        <InputGroupAddon>https://</InputGroupAddon>
      </InputGroup>
    </div>
  );
}
