import { cn } from "cn";
import type * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "ninaero-textarea flex field-sizing-content min-h-16 w-full min-w-0 px-(--field-padding-inline) py-2 text-base type-body leading-6 disabled:cursor-not-allowed md:text-sm md:leading-5",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
