"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

import { Button } from "@/registry/ninaero/ui/button";
import { Input } from "@/registry/ninaero/ui/input";
import { Textarea } from "@/registry/ninaero/ui/textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: This groups one input with adornments, not a separate fieldset.
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "ninaero-input-group group/input-group relative flex h-(--field-height) w-full min-w-0 items-center has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-start]]:[&>input]:pt-0 has-[>[data-align=block-end]]:[&>input]:pb-0 has-[>[data-align=block-start]]:[&>textarea]:pt-0 has-[>[data-align=block-end]]:[&>textarea]:pb-0 has-[>[data-align=inline-end]]:[&>input]:pr-2 has-[>[data-align=inline-start]]:[&>input]:pl-2 has-[>[data-align=inline-end]]:[&>textarea]:pr-2 has-[>[data-align=inline-start]]:[&>textarea]:pl-2",
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 text-sm leading-5 font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-(--field-padding-inline)",
        "inline-end": "order-last pr-(--field-padding-inline)",
        "block-start": "order-first w-full justify-start px-(--field-padding-inline) py-2",
        "block-end": "order-last w-full justify-start px-(--field-padding-inline) py-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: Adornments may contain action buttons and are not a form fieldset.
    // biome-ignore lint/a11y/useKeyWithClickEvents: Adornment clicks focus the input; keyboard users reach that input directly.
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLElement>('[data-slot="input-group-control"]')
          ?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva("shadow-none", {
  variants: {
    size: {
      xs: "",
      sm: "",
      "icon-xs": "p-0",
      "icon-sm": "p-0",
    },
  },
  defaultVariants: {
    size: "xs",
  },
});

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) {
  return (
    <Button
      type={type}
      size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn("h-auto min-h-0 flex-1 self-stretch", className)}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <Textarea data-slot="input-group-control" className={cn("flex-1", className)} {...props} />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
