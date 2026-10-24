import { useId } from "react";

import { Label } from "@/registry/ninaero/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";

export function SelectPreview() {
  const id = useId();
  return (
    <div className="w-full max-w-64 space-y-2">
      <Label id={id}>Theme preference</Label>
      <Select defaultValue="system">
        <SelectTrigger className="w-full" aria-labelledby={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
