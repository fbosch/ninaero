"use client";

import type { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "cn";
import {
  AnimatePresence,
  LayoutGroup,
  cancelFrame,
  frame,
  motion,
  useReducedMotion,
  useMotionValue,
  type Transition,
} from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useEffectEvent, useId, useRef, useState } from "react";

import { componentTitle, overviewItems } from "@/lib/component-overview";
import { documentationGuides, findDocumentation } from "@/lib/documentation-search.mjs";
import { SearchIcon } from "@/lib/icons";
import { useIsMobile } from "@/registry/ninaero/hooks/use-mobile";
import { Button } from "@/registry/ninaero/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/registry/ninaero/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ninaero/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/registry/ninaero/ui/input-group";
import { Kbd, KbdGroup } from "@/registry/ninaero/ui/kbd";
import { useControlSound } from "@/registry/ninaero/ui/sound-feedback";

import { useHomeMotion } from "./home-background/home-motion-settings";
import { createModalMotionGate } from "./home-background/home-motion.mjs";
import { isSearchShortcut } from "./site-search-loader.mjs";

import styles from "./site-search.module.css";

const openingSpring: Transition = {
  type: "spring",
  // Match the rise cue's 124ms pitch glide and 260ms dry envelope.
  stiffness: 1013.25,
  damping: 39.36,
  mass: 0.65,
  restDelta: 0.5,
  restSpeed: 10,
};
const closingSpring: Transition = {
  type: "spring",
  stiffness: 1100,
  damping: 46,
  mass: 0.45,
  restDelta: 0.5,
  restSpeed: 10,
};
const immediate: Transition = { duration: 0 };

const componentEntries = overviewItems.map((item) => ({
  title: componentTitle(item.name),
  description: item.description,
  href: `/docs/${item.name}`,
  keywords: [item.name],
}));

// Motion needs resolved lengths to mix and scale-correct the theme's corner radii.
function readThemeCorner(element: HTMLElement, token: string) {
  const previous = element.style.borderRadius;
  element.style.borderRadius = `var(${token})`;
  const radius = getComputedStyle(element).borderTopLeftRadius;
  element.style.borderRadius = previous;
  return radius;
}

function visibleTrigger(mobile: HTMLButtonElement | null, desktop: HTMLButtonElement | null) {
  return mobile && mobile.getBoundingClientRect().width > 0 ? mobile : desktop;
}

export function SiteSearchDialog({
  initialReturnFocus,
}: {
  initialReturnFocus: HTMLElement | null;
}) {
  const router = useRouter();
  const layoutGroupId = useId();
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion() === true;
  const { play } = useControlSound();
  const { ambientPause } = useHomeMotion();
  const [modalMotion] = useState(() => createModalMotionGate(ambientPause));
  const mobileCorner = useMotionValue("var(--button-corner)");
  const desktopCorner = useMotionValue("var(--button-corner)");
  const dialogCorner = useMotionValue("var(--dialog-corner)");
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [morphComplete, setMorphComplete] = useState(false);
  const [query, setQuery] = useState("");
  const openRef = useRef(false);
  const openingSoundPlayed = useRef(false);
  const actionsRef = useRef<DialogPrimitive.Root.Actions | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null);
  const desktopTriggerRef = useRef<HTMLButtonElement | null>(null);
  const popupElementRef = useRef<HTMLDivElement | null>(null);
  const originRect = useRef<DOMRect | null>(null);
  const surfaceId = isMobile ? "mobile-surface" : "desktop-surface";
  const enterTransition = reduceMotion ? immediate : openingSpring;
  const leaveTransition = reduceMotion ? immediate : closingSpring;
  const hideTrigger = open && (reduceMotion || morphComplete);
  const playOpeningSound = useCallback(() => {
    if (!openRef.current || openingSoundPlayed.current) return;
    openingSoundPlayed.current = true;
    if (document.visibilityState === "visible") play("rise");
  }, [play]);
  // Layout's start callback precedes its first projected paint.
  const checkOpeningFrame = useCallback(
    function checkFrame(): void {
      const popup = popupElementRef.current;
      if (!openRef.current || openingSoundPlayed.current || !popup) {
        cancelFrame(checkFrame);
        return;
      }
      const rect = popup.getBoundingClientRect();
      const origin = originRect.current;
      if (!origin || rect.width > origin.width + 0.5 || rect.height > origin.height + 0.5) {
        cancelFrame(checkFrame);
        playOpeningSound();
      }
    },
    [playOpeningSound],
  );
  const popupRef = useCallback(
    (element: HTMLDivElement | null) => {
      popupElementRef.current = element;
      if (element) dialogCorner.set(readThemeCorner(element, "--dialog-corner"));
      if (element && reduceMotion) playOpeningSound();
    },
    [dialogCorner, playOpeningSound, reduceMotion],
  );
  const openSearch = useCallback(() => {
    if (openRef.current) return;
    if (!present && document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
    openRef.current = true;
    // Stop ambient renderers now; mount the morph on the next frame.
    modalMotion.open(() => {
      openingSoundPlayed.current = false;
      setMorphComplete(false);
      const trigger = visibleTrigger(mobileTriggerRef.current, desktopTriggerRef.current);
      originRect.current = trigger?.getBoundingClientRect() ?? null;
      if (trigger) {
        const corner = trigger === mobileTriggerRef.current ? mobileCorner : desktopCorner;
        corner.set(readThemeCorner(trigger, "--button-corner"));
      }
      setPresent(true);
      setOpen(true);
    }, reduceMotion || present);
  }, [modalMotion, mobileCorner, desktopCorner, present, reduceMotion]);
  const groups = [
    { title: "Guides", entries: findDocumentation(documentationGuides, query) },
    { title: "Components", entries: findDocumentation(componentEntries, query) },
  ];

  useEffect(() => () => cancelFrame(checkOpeningFrame), [checkOpeningFrame]);
  useEffect(() => () => modalMotion.finish(), [modalMotion]);

  const openInitialSearch = useEffectEvent(() => {
    openSearch();
    // The lightweight trigger was replaced; return to its mounted counterpart.
    returnFocusRef.current = initialReturnFocus?.isConnected
      ? initialReturnFocus
      : visibleTrigger(mobileTriggerRef.current, desktopTriggerRef.current);
  });
  useEffect(() => {
    openInitialSearch();
    return () => {
      openRef.current = false;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        !event.defaultPrevented &&
        openRef.current &&
        (modalMotion.isPending() || !popupElementRef.current)
      ) {
        event.preventDefault();
        modalMotion.finish();
        openRef.current = false;
        setOpen(false);
        setPresent(false);
        return;
      }
      if (!isSearchShortcut(event)) return;
      event.preventDefault();
      openSearch();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalMotion, openSearch]);

  function changeOpen(nextOpen: boolean, details: DialogPrimitive.Root.ChangeEventDetails) {
    // Motion must finish the shared-layout return before Base UI ends the closing phase.
    if (!nextOpen) {
      setMorphComplete(false);
      details.preventUnmountOnClose();
      if (!present) modalMotion.finish();
      cancelFrame(checkOpeningFrame);
    }
    openRef.current = nextOpen;
    setOpen(nextOpen);
    if (nextOpen) {
      modalMotion.open(() => {}, true);
      setPresent(true);
    }
  }

  function navigate(href: string) {
    returnFocusRef.current = null;
    actionsRef.current?.close();
    router.push(href);
  }

  return (
    <LayoutGroup id={layoutGroupId}>
      <div className="flex shrink-0">
        <Button
          variant="secondary"
          size="icon-sm"
          ref={mobileTriggerRef}
          className={cn("md:hidden", styles.triggerSurface, hideTrigger && styles.hiddenTrigger)}
          sound={false}
          aria-label="Search documentation"
          aria-keyshortcuts="Control+K Meta+K"
          onClick={openSearch}
          render={
            <motion.button
              layoutId="mobile-surface"
              layoutDependency={open}
              transition={{ layout: leaveTransition }}
              style={{ borderRadius: mobileCorner }}
            />
          }
        >
          <motion.span
            layout="position"
            className="inline-flex"
            transition={{ layout: leaveTransition }}
          >
            <SearchIcon />
          </motion.span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          ref={desktopTriggerRef}
          className={cn(
            "hidden gap-4 md:inline-flex",
            styles.triggerSurface,
            hideTrigger && styles.hiddenTrigger,
          )}
          sound={false}
          aria-keyshortcuts="Control+K Meta+K"
          onClick={openSearch}
          render={
            <motion.button
              layoutId="desktop-surface"
              layoutDependency={open}
              transition={{ layout: leaveTransition }}
              style={{ borderRadius: desktopCorner }}
            />
          }
        >
          <span className="flex items-center gap-2">
            <motion.span
              layout="position"
              className="inline-flex"
              transition={{ layout: leaveTransition }}
            >
              <SearchIcon data-icon="inline-start" />
            </motion.span>
            <motion.span layout="position" transition={{ layout: leaveTransition }}>
              Search
            </motion.span>
          </span>
          <KbdGroup aria-hidden="true">
            <Kbd>Ctrl/⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        <Dialog
          open={open}
          actionsRef={actionsRef}
          onOpenChange={changeOpen}
          onOpenChangeComplete={(nextOpen) => {
            if (!nextOpen && !openRef.current) {
              modalMotion.finish();
              setPresent(false);
              setQuery("");
            }
          }}
        >
          <AnimatePresence
            initial={false}
            onExitComplete={() => {
              if (!openRef.current) actionsRef.current?.unmount();
            }}
          >
            {open && (
              <DialogContent
                ref={popupRef}
                key="search-dialog"
                initialFocus={inputRef}
                finalFocus={() => returnFocusRef.current ?? false}
                showCloseButton={false}
                className={cn(
                  "top-16 flex max-h-[calc(100dvh-5rem)] flex-col p-3 sm:top-24 sm:p-6 sm:max-h-[calc(100dvh-7rem)]",
                  styles.popup,
                )}
                render={
                  <motion.div
                    layoutId={surfaceId}
                    layoutDependency="popup"
                    onLayoutAnimationStart={() => frame.postRender(checkOpeningFrame, true)}
                    onLayoutAnimationComplete={() => {
                      if (openRef.current) setMorphComplete(true);
                    }}
                    initial={false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      layout: enterTransition,
                      opacity: { duration: reduceMotion ? 0 : 0.14 },
                    }}
                    style={{ borderRadius: dialogCorner, translate: "none" }}
                  />
                }
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>Search documentation</DialogTitle>
                  <DialogDescription>Find component documentation and guides.</DialogDescription>
                </DialogHeader>
                <Command
                  className="h-auto min-h-0 flex-1 gap-2 overflow-visible bg-transparent p-0"
                  shouldFilter={false}
                >
                  <div className="shrink-0 p-1 pb-0">
                    <InputGroup>
                      <CommandPrimitive.Input
                        asChild
                        ref={inputRef}
                        aria-label="Search documentation"
                        placeholder="Search docs…"
                        value={query}
                        onValueChange={setQuery}
                        maxLength={200}
                      >
                        <InputGroupInput />
                      </CommandPrimitive.Input>
                      <InputGroupAddon>
                        <SearchIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                  <CommandList className="min-h-0 flex-1 scroll-py-1 py-1 sm:scroll-py-3 sm:py-3 [mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%_-_12px),transparent)] forced-colors:[mask-image:none]">
                    <CommandEmpty>No documentation matches your search.</CommandEmpty>
                    {groups
                      .filter((group) => group.entries.length > 0)
                      .map((group) => (
                        <CommandGroup key={group.title} heading={group.title}>
                          {group.entries.map((entry) => (
                            <CommandItem
                              key={entry.href}
                              value={entry.href}
                              onSelect={() => navigate(entry.href)}
                            >
                              <span className="flex min-w-0 flex-col gap-1">
                                <span>{entry.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {entry.description}
                                </span>
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                  </CommandList>
                  <div className="flex shrink-0 justify-end p-1">
                    <DialogClose render={<Button variant="ghost" size="sm" />}>Close</DialogClose>
                  </div>
                </Command>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>
      </div>
    </LayoutGroup>
  );
}
