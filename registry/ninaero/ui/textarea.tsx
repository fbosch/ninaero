import { cn } from "cn";
import type * as React from "react";

import { HoverSound } from "./sound-feedback";

function Textarea({
  className,
  sound = true,
  ...props
}: React.ComponentProps<"textarea"> & { sound?: boolean }) {
  return (
    <HoverSound sound={sound}>
      <textarea
        data-slot="textarea"
        className={cn(
          "ninaero-textarea flex field-sizing-content min-h-16 w-full min-w-0 px-(--field-padding-inline) py-2 text-base type-body leading-6 disabled:cursor-not-allowed md:text-sm md:leading-5",
          className,
        )}
        {...props}
      />
    </HoverSound>
  );
}

export { Textarea };
