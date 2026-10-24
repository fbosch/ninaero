import { useId, useState } from "react";

import type { PreviewProps } from "@/lib/component-overview";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/registry/ninaero/ui/input-otp";
import { Label } from "@/registry/ninaero/ui/label";

export function InputOTPPreview({ interactive }: PreviewProps) {
  const id = useId();
  const [value, setValue] = useState("");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Example code</Label>
      <InputOTP
        maxLength={4}
        id={id}
        pattern="^[0-9]+$"
        value={value}
        onChange={setValue}
        aria-label="Example code"
      >
        <InputOTPGroup>
          {[0, 1, 2, 3].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {interactive && (
        <output className="block text-xs text-muted-foreground">
          {value.length === 4 ? "Code entered (not verified)" : "Enter four digits"}
        </output>
      )}
    </div>
  );
}
