import { useId } from "react";

import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";

export function LabelPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Project name</Label>
      <Input id={id} placeholder="Enter a name" />
    </div>
  );
}
