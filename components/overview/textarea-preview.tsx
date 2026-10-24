import { useId } from "react";

import { Label } from "@/registry/ninaero/ui/label";
import { Textarea } from "@/registry/ninaero/ui/textarea";

export function TextareaPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label htmlFor={id}>Notes</Label>
      <Textarea id={id} placeholder="Add a note" rows={3} />
    </div>
  );
}
