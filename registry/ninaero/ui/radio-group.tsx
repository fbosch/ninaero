"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "cn";

import { useControlSound, HoverSound, SoundGroup } from "./sound-feedback";

function RadioGroup({
  className,
  sound = true,
  onValueChange,
  ...props
}: RadioGroupPrimitive.Props & { sound?: boolean }) {
  const { play } = useControlSound(sound);
  return (
    <SoundGroup sound={sound}>
      <RadioGroupPrimitive
        data-slot="radio-group"
        className={cn("grid w-full gap-2", className)}
        {...props}
        onValueChange={(value, details) => {
          onValueChange?.(value, details);
          if (!details.isCanceled && details.event.type !== "reset") play("tap");
        }}
      />
    </SoundGroup>
  );
}

function RadioGroupItem({
  className,
  sound = true,
  ...props
}: RadioPrimitive.Root.Props & { sound?: boolean }) {
  return (
    <HoverSound sound={sound}>
      <RadioPrimitive.Root
        data-slot="radio-group-item"
        className={cn(
          "ninaero-radio-group-item group/radio-group-item peer relative flex aspect-square size-5 shrink-0 items-center justify-center rounded-full after:absolute after:-inset-x-3 after:-inset-y-2",
          className,
        )}
        {...props}
      >
        <RadioPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="flex items-center justify-center"
        >
          <span className="ninaero-radio-group-dot size-2.5 rounded-full" />
        </RadioPrimitive.Indicator>
      </RadioPrimitive.Root>
    </HoverSound>
  );
}

export { RadioGroup, RadioGroupItem };
