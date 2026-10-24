import { useId } from "react";

import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";

export function InputPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Email</Label>
      <Input id={id} type="email" placeholder="name@example.com" />
      <Input disabled aria-label="Disabled input" placeholder="Disabled" />
    </div>
  );
}
