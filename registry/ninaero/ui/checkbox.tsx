"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "cn";

import { CheckIcon, MinusIcon } from "@/lib/icons";

import { useControlSound, HoverSound } from "./sound-feedback";

function Checkbox({
  className,
  onCheckedChange,
  sound = true,
  ...props
}: CheckboxPrimitive.Root.Props & { sound?: boolean }) {
  const { play } = useControlSound(sound);
  return (
    <HoverSound sound={sound}>
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          "ninaero-checkbox group/checkbox peer relative flex size-5 shrink-0 items-center justify-center rounded-[4px] after:absolute after:-inset-x-3 after:-inset-y-2",
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
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
        >
          <CheckIcon className="group-data-indeterminate/checkbox:hidden" />
          <MinusIcon className="hidden group-data-indeterminate/checkbox:block" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </HoverSound>
  );
}

export { Checkbox };
