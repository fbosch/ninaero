import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "cn";

import { ChevronDownIcon } from "@/lib/icons";

import { HoverSound } from "./sound-feedback";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("ninaero-accordion-item not-last:border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  sound = true,
  ...props
}: AccordionPrimitive.Trigger.Props & { sound?: boolean }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <HoverSound sound={sound}>
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            "ninaero-accordion-trigger group/accordion-trigger relative flex min-h-12 flex-1 items-start justify-between gap-3 rounded-lg border border-transparent px-4 py-3 text-start text-sm type-label outline-none **:data-[slot=accordion-trigger-icon]:size-4",
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDownIcon
            data-slot="accordion-trigger-icon"
            aria-hidden="true"
            className="ninaero-accordion-icon pointer-events-none mt-0.5 ms-auto shrink-0"
          />
        </AccordionPrimitive.Trigger>
      </HoverSound>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="ninaero-accordion-content overflow-hidden text-sm type-body"
      {...props}
    >
      <div
        className={cn(
          "px-4 pt-1 pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
