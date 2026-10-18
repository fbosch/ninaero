"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { useControlSound, HoverSound, SoundGroup } from "./sound-feedback";

function Tabs({
  className,
  orientation = "horizontal",
  sound = true,
  onValueChange,
  ...props
}: TabsPrimitive.Root.Props & { sound?: boolean }) {
  const { play } = useControlSound(sound);
  return (
    <SoundGroup sound={sound}>
      <TabsPrimitive.Root
        data-slot="tabs"
        orientation={orientation}
        className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
        {...props}
        onValueChange={(value, details) => {
          onValueChange?.(value, details);
          if (!details.isCanceled && details.reason === "none" && details.event.type !== "reset") {
            play("tap");
          }
        }}
      />
    </SoundGroup>
  );
}

const tabsListVariants = cva(
  "ninaero-tabs-list group/tabs-list inline-flex w-fit items-center justify-center gap-1 group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "p-[3px]",
        line: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  sound = true,
  ...props
}: TabsPrimitive.Tab.Props & { sound?: boolean }) {
  return (
    <HoverSound sound={sound}>
      <TabsPrimitive.Tab
        data-slot="tabs-trigger"
        className={cn(
          "ninaero-tabs-trigger relative inline-flex h-full flex-1 items-center justify-center gap-2 px-3 text-sm type-label whitespace-nowrap group-data-vertical/tabs:h-6 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    </HoverSound>
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("ninaero-tabs-content flex-1 text-sm", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
