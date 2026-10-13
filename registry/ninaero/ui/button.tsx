import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "ninaero-button group/button inline-flex shrink-0 items-center justify-center bg-clip-padding text-sm leading-5 font-medium whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "ninaero-button--primary",
        outline: "ninaero-button--outline",
        secondary: "ninaero-button--secondary",
        ghost: "ninaero-button--ghost",
        destructive: "ninaero-button--destructive",
        link: "ninaero-button--link",
      },
      size: {
        default: "h-8 gap-2 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 [--button-corner:0.75rem] px-2 text-xs leading-4 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 [--button-corner:0.875rem] px-2 text-[0.8rem] leading-4 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 [--button-corner:1.125rem] px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 [--button-corner:0.75rem] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 [--button-corner:0.875rem]",
        "icon-lg": "size-9 [--button-corner:1.125rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
