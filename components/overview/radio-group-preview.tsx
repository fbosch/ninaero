import { useId } from "react";

import { Label } from "@/registry/ninaero/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/ninaero/ui/radio-group";

export function RadioGroupPreview() {
  const id = useId();
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium" id={id}>
        Density
      </span>
      <RadioGroup defaultValue="comfortable" aria-labelledby={id}>
        {["Compact", "Comfortable", "Spacious"].map((choice) => {
          const value = choice.toLowerCase();
          return (
            <div className="flex items-center gap-2" key={choice}>
              <RadioGroupItem value={value} id={`${id}-${value}`} />
              <Label htmlFor={`${id}-${value}`}>{choice}</Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
