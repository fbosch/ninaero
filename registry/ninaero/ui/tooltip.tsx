"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import * as React from "react";

// Base UI 1.9 omits tooltip descriptions. Share the content ID, not interaction state.
function createTooltipDescription() {
  let id: string | undefined;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => id,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setId(next: string | undefined) {
      if (id === next) return;
      id = next;
      listeners.forEach((listener) => listener());
    },
  };
}

type TooltipDescription = ReturnType<typeof createTooltipDescription>;
const TooltipDescriptionContext = React.createContext<TooltipDescription | null>(null);
type TooltipHandle = Pick<
  NonNullable<TooltipPrimitive.Root.Props["handle"]>,
  "open" | "close" | "isOpen"
>;
const handleDescriptions = new WeakMap<TooltipHandle, TooltipDescription>();
const noDescription = () => undefined;
const noSubscription = () => () => {};

function getHandleDescription(handle: TooltipHandle) {
  let description = handleDescriptions.get(handle);
  if (!description) {
    description = createTooltipDescription();
    handleDescriptions.set(handle, description);
  }
  return description;
}

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />;
}

function Tooltip<Payload>({ handle, ...props }: TooltipPrimitive.Root.Props<Payload>) {
  const [localDescription] = React.useState(createTooltipDescription);
  const description = handle ? getHandleDescription(handle) : localDescription;
  return (
    <TooltipDescriptionContext.Provider value={description}>
      <TooltipPrimitive.Root data-slot="tooltip" handle={handle} {...props} />
    </TooltipDescriptionContext.Provider>
  );
}

function TooltipTrigger<Payload>({
  render,
  handle,
  ...props
}: TooltipPrimitive.Trigger.Props<Payload>) {
  const context = React.useContext(TooltipDescriptionContext);
  const description = handle ? getHandleDescription(handle) : context;
  const descriptionId = React.useSyncExternalStore(
    description?.subscribe ?? noSubscription,
    description?.getSnapshot ?? noDescription,
    noDescription,
  );
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      handle={handle}
      {...props}
      render={(elementProps, state) => (
        <TooltipTriggerElement
          elementProps={elementProps}
          state={state}
          render={render}
          descriptionId={descriptionId}
        />
      )}
    />
  );
}

type TriggerRender = Exclude<
  TooltipPrimitive.Trigger.Props["render"],
  React.ReactElement | undefined
>;

function TooltipTriggerElement({
  elementProps,
  state,
  render,
  descriptionId,
}: {
  elementProps: Parameters<TriggerRender>[0];
  state: TooltipPrimitive.Trigger.State;
  render: TooltipPrimitive.Trigger.Props["render"];
  descriptionId: string | undefined;
}) {
  const element = useRender({
    defaultTagName: "button",
    props: { ...elementProps },
    render,
    state: { open: state.open },
    stateAttributesMapping: { open: () => null },
  });
  if (!React.isValidElement<React.AriaAttributes>(element)) return element;
  const ids = new Set(
    [elementProps["aria-describedby"], element.props["aria-describedby"]].flatMap(
      (value) => value?.split(/\s+/).filter(Boolean) ?? [],
    ),
  );
  if (state.open && descriptionId) ids.add(descriptionId);
  return React.cloneElement(element, { "aria-describedby": [...ids].join(" ") || undefined });
}

function TooltipContent({
  className,
  id,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  const description = React.useContext(TooltipDescriptionContext);
  const generatedId = React.useId();
  const popupId = id ?? generatedId;
  React.useLayoutEffect(() => {
    description?.setId(popupId);
    return () => description?.setId(undefined);
  }, [description, popupId]);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          id={popupId}
          role="tooltip"
          className={cn(
            "ninaero-tooltip z-50 inline-flex w-fit items-center gap-1.5 px-4 py-2 text-xs type-caption has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
            className,
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
