"use client";

import { useRender } from "@base-ui/react/use-render";
import {
  createContext,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

import { useSound, type SoundCue, type SoundOptions } from "./sound-provider";
import { createHoverSoundGate, getSoundPitch } from "./sound-runtime";

const SoundScope = createContext(true);

export function SoundGroup({ sound, children }: { sound: boolean; children: ReactNode }) {
  const inherited = useContext(SoundScope);
  return <SoundScope.Provider value={sound && inherited}>{children}</SoundScope.Provider>;
}

export function useControlSound(sound = true) {
  const inherited = useContext(SoundScope);
  const { enabled, play } = useSound();
  const active = sound && inherited && enabled;
  const feedback = useCallback(
    (cue: SoundCue, options?: SoundOptions) => {
      if (active) play(cue, options);
    },
    [active, play],
  );
  return { enabled: active, play: feedback };
}

const hoverEvents = new WeakSet<Event>();
const hoverSounds = createHoverSoundGate();
const optionSelector = '[role="option"], [role^="menuitem"]';
const managedOptions =
  '[data-slot="command-item"], [data-slot="select-item"], [data-slot="dropdown-menu-item"], [data-slot="dropdown-menu-checkbox-item"], [data-slot="dropdown-menu-radio-item"]';
const disabledTargets =
  ':disabled, [aria-disabled="true"], [data-disabled=""], [data-disabled="true"], [data-ninaero-sound="off"]';
const textEntryTargets =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, [role="textbox"], [role="searchbox"], [role="spinbutton"]';
const hoverTargets =
  'a[href], button, input, select, summary, label[for], label:has(input), [tabindex]:not([tabindex="-1"]), [role="button"], [role="checkbox"], [role="radio"], [role="switch"], [role="tab"], [role="combobox"], [role="slider"], [role="separator"][tabindex], [data-slot="slider"], [data-slot="scroll-area-scrollbar"]';

function isTextEntry(target: HTMLElement) {
  return (
    target.matches(textEntryTargets) ||
    target.isContentEditable ||
    (target instanceof HTMLLabelElement && !!target.control?.matches(textEntryTargets))
  );
}

function hoverFeedback(
  event: ReactPointerEvent<HTMLElement>,
): { cue: SoundCue; options: SoundOptions } | undefined {
  if (
    event.defaultPrevented ||
    ("baseUIHandlerPrevented" in event && event.baseUIHandlerPrevented) ||
    (event.pointerType !== "mouse" && event.pointerType !== "pen")
  )
    return;
  const target = event.currentTarget;
  if (
    target.closest(disabledTargets) ||
    isTextEntry(target) ||
    (event.target instanceof HTMLElement && isTextEntry(event.target))
  )
    return;
  if (target.matches(optionSelector)) {
    if (!target.matches(managedOptions)) return { cue: "tick", options: itemSoundOptions(target) };
    return;
  }
  if (target.matches(hoverTargets)) return { cue: "hover", options: {} };
}

export function HoverSound({
  children,
  sound = true,
}: {
  children: ReactElement;
  sound?: boolean;
}) {
  const { enabled, play } = useControlSound(sound);
  const element = useRef<HTMLElement | null>(null);
  const setElement = useCallback((target: HTMLElement | null) => {
    if (element.current && element.current !== target) hoverSounds.dispose(element.current);
    element.current = target;
  }, []);

  return useRender({
    render: children,
    ref: setElement,
    props: {
      "data-ninaero-sound": enabled ? undefined : "off",
      onPointerEnter(event: ReactPointerEvent<HTMLElement>) {
        if (!enabled || hoverEvents.has(event.nativeEvent)) return;
        const feedback = hoverFeedback(event);
        if (!feedback) return;
        // Composed controls can decorate the same DOM node more than once.
        hoverEvents.add(event.nativeEvent);
        hoverSounds.enter(event.currentTarget, () => {
          play(feedback.cue, feedback.options);
          return true;
        });
      },
      onPointerLeave(event: ReactPointerEvent<HTMLElement>) {
        hoverSounds.leave(event.currentTarget);
      },
      onPointerCancel(event: ReactPointerEvent<HTMLElement>) {
        hoverSounds.leave(event.currentTarget);
      },
    },
  });
}

export function itemSoundOptions(element: HTMLElement | null): SoundOptions {
  const list = element?.closest('[role="menu"], [role="listbox"]');
  const items = Array.from(
    list?.querySelectorAll<HTMLElement>(
      '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"]',
    ) ?? [],
  ).filter((item) => !item.closest("[hidden]"));
  const index = element ? items.indexOf(element) : -1;
  return {
    pitch:
      index < 0 || items.length < 2
        ? 0
        : getSoundPitch(items.length - 1 - index, 0, items.length - 1),
  };
}

export function HighlightSound<State extends { highlighted: boolean; disabled?: boolean }>({
  state,
  elementProps,
  render,
  sound = true,
}: {
  state: State;
  elementProps: useRender.ElementProps<"div">;
  render?: useRender.RenderProp<State>;
  sound?: boolean;
}) {
  const element = useRef<HTMLDivElement>(null);
  const previous = useRef(state.highlighted);
  const { play } = useControlSound(sound);

  useEffect(() => {
    const entered = state.highlighted && !previous.current;
    previous.current = state.highlighted;
    if (entered && !state.disabled) play("tick", itemSoundOptions(element.current));
  }, [state.highlighted, state.disabled, play]);

  const { ref, ...props } = elementProps;
  return useRender({
    defaultTagName: "div",
    ref: [element, ref ?? null],
    props,
    render: typeof render === "function" ? (renderProps) => render(renderProps, state) : render,
  });
}
