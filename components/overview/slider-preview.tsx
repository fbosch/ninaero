import { useId, useState } from "react";

import type { PreviewProps } from "@/lib/component-overview";
import { Label } from "@/registry/ninaero/ui/label";
import { Slider } from "@/registry/ninaero/ui/slider";

export function SliderPreview({ interactive }: PreviewProps) {
  const id = useId();
  const [value, setValue] = useState(40);
  return (
    <div className="w-full max-w-64 space-y-3">
      <Label id={id}>Volume: {value}%</Label>
      <Slider
        aria-labelledby={id}
        value={value}
        onValueChange={(next) => setValue(Array.isArray(next) ? next[0] : next)}
      />
      {interactive && <p className="text-xs text-muted-foreground">Example setting only</p>}
    </div>
  );
}
