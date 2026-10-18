"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";

import { useControlSound, HoverSound } from "./sound-feedback";
import { getSoundPitch } from "./sound-runtime";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaLabel,
  getAriaValueText,
  variant = "default",
  sound = true,
  onValueChange,
  onValueCommitted,
  ...props
}: SliderPrimitive.Root.Props &
  Pick<SliderPrimitive.Thumb.Props, "getAriaLabel" | "getAriaValueText"> & {
    sound?: boolean;
    variant?: "default" | "simple";
  }) {
  const { play } = useControlSound(sound);
  const currentValue = value ?? defaultValue ?? min;
  const values = Array.isArray(currentValue) ? currentValue : [currentValue];

  return (
    <HoverSound sound={sound}>
      <SliderPrimitive.Root
        className={cn("ninaero-slider data-horizontal:w-full data-vertical:h-full", className)}
        data-slot="slider"
        data-variant={variant}
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        thumbAlignment="edge"
        {...props}
        onValueChange={(next, details) => {
          onValueChange?.(next, details);
          const changed = typeof next === "number" ? next : next[details.activeThumbIndex];
          if (!details.isCanceled && details.reason !== "none" && changed !== undefined) {
            play("tick", { pitch: getSoundPitch(changed, min, max), volume: 0.25 });
          }
        }}
        onValueCommitted={(next, details) => {
          onValueCommitted?.(next, details);
          if (details.reason !== "none") play("tap", { volume: 0.65 });
        }}
      >
        <SliderPrimitive.Control className="ninaero-slider-control relative flex w-full touch-none items-center select-none data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
          <SliderPrimitive.Track
            data-slot="slider-track"
            className={cn(
              "ninaero-slider-track relative grow overflow-hidden rounded-full select-none data-horizontal:w-full data-vertical:h-full",
              variant === "simple"
                ? "data-horizontal:h-1 data-vertical:w-1"
                : "data-horizontal:h-2.5 data-vertical:w-2.5",
            )}
          >
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className="ninaero-slider-range select-none data-horizontal:h-full data-vertical:w-full"
            />
          </SliderPrimitive.Track>
          {values.map((_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              // biome-ignore lint/suspicious/noArrayIndexKey: Thumb identity is positional; value-based keys would remount controls while dragging.
              key={index}
              index={index}
              aria-label={props["aria-label"]}
              aria-labelledby={getAriaLabel ? undefined : props["aria-labelledby"]}
              aria-describedby={props["aria-describedby"]}
              aria-invalid={props["aria-invalid"]}
              getAriaLabel={getAriaLabel}
              getAriaValueText={getAriaValueText}
              className={cn(
                "ninaero-slider-thumb relative block shrink-0 rounded-full border select-none after:absolute after:-inset-3",
                variant === "simple"
                  ? "size-3"
                  : "h-5 w-8 before:absolute before:top-1/2 before:left-1/2 before:h-1.5 before:w-2.5 before:-translate-1/2",
              )}
            />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    </HoverSound>
  );
}

export { Slider };
