"use client";

import { useDirection } from "@base-ui/react/direction-provider";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "cn";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  const direction = useDirection();

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-direction={direction}
      data-size={size}
      className={cn(
        "ninaero-switch peer group/switch relative inline-flex shrink-0 items-center rounded-full after:absolute after:-inset-x-3 after:-inset-y-2",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="ninaero-switch-thumb pointer-events-none block shrink-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
