"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

import { HoverSound } from "./sound-feedback";

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  sound = true,
  ...props
}: CollapsiblePrimitive.Trigger.Props & { sound?: boolean }) {
  return (
    <HoverSound sound={sound}>
      <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
    </HoverSound>
  );
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
