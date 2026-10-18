"use client";

import { useDirection } from "@base-ui/react/direction-provider";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "cn";

import { useControlSound, HoverSound } from "./sound-feedback";

function Switch({
  className,
  size = "default",
  onCheckedChange,
  sound = true,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
  sound?: boolean;
}) {
  const direction = useDirection();
  const { play } = useControlSound(sound);

  return (
    <HoverSound sound={sound}>
      <SwitchPrimitive.Root
        data-slot="switch"
        data-direction={direction}
        data-size={size}
        className={cn(
          "ninaero-switch peer group/switch relative inline-flex shrink-0 items-center rounded-full after:absolute after:-inset-x-3 after:-inset-y-2",
          className,
        )}
        {...props}
        onCheckedChange={(checked, details) => {
          onCheckedChange?.(checked, details);
          if (sound && !details.isCanceled && details.event.type !== "reset") {
            play(checked ? "on" : "off");
          }
        }}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className="ninaero-switch-thumb pointer-events-none block shrink-0"
        />
      </SwitchPrimitive.Root>
    </HoverSound>
  );
}

export { Switch };
