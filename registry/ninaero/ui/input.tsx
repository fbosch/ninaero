import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";
import type * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "ninaero-input h-(--field-height) w-full min-w-0 px-(--field-padding-inline) py-1 text-base leading-5 file:mr-2 file:inline-flex file:h-5 file:items-center file:border-0 file:bg-transparent file:px-2 file:py-0 file:text-sm file:leading-5 file:font-medium file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
