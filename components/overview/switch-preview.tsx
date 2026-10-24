import { useId } from "react";

import { Label } from "@/registry/ninaero/ui/label";
import { Switch } from "@/registry/ninaero/ui/switch";

export function SwitchPreview() {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} defaultChecked />
      <Label htmlFor={id}>Show hints</Label>
    </div>
  );
}
