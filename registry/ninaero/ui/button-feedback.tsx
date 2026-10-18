"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";

import { useControlSound, HoverSound } from "./sound-feedback";

// Keep the feedback hook behind a client boundary so buttonVariants remains usable on the server.
export function SoundButton({
  onClick,
  sound,
  ...props
}: ButtonPrimitive.Props & { sound: boolean }) {
  const { play } = useControlSound(sound);
  return (
    <HoverSound sound={sound}>
      <ButtonPrimitive
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (
            sound &&
            !props.disabled &&
            !event.defaultPrevented &&
            !event.baseUIHandlerPrevented
          ) {
            play("tap");
          }
        }}
      />
    </HoverSound>
  );
}
