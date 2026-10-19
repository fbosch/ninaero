"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { componentTitle, overviewItems } from "@/lib/component-overview";
import { documentationGuides, findDocumentation } from "@/lib/documentation-search.mjs";
import { SearchIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
import { Kbd, KbdGroup } from "@/registry/ninaero/ui/kbd";

const componentEntries = overviewItems.map((item) => ({
  title: componentTitle(item.name),
  description: item.description,
  href: `/docs/${item.name}`,
  keywords: [item.name],
}));

export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const openSearch = useCallback(() => {
    if (!open && document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
    setOpen(true);
  }, [open]);
  const groups = [
    { title: "Guides", entries: findDocumentation(documentationGuides, query) },
    { title: "Components", entries: findDocumentation(componentEntries, query) },
  ];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        event.altKey ||
        event.shiftKey ||
        !(event.ctrlKey || event.metaKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return;
      }
      event.preventDefault();
      openSearch();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setQuery("");
  }

  function navigate(href: string) {
    returnFocusRef.current = null;
    changeOpen(false);
    router.push(href);
  }

  return (
    <div className="flex shrink-0">
      <Button
        variant="secondary"
        size="icon-sm"
        className="md:hidden"
        aria-label="Search documentation"
        aria-keyshortcuts="Control+K Meta+K"
        onClick={openSearch}
      >
        <SearchIcon />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="hidden gap-4 md:inline-flex"
        aria-keyshortcuts="Control+K Meta+K"
        onClick={openSearch}
      >
        <span className="flex items-center gap-2">
          <SearchIcon data-icon="inline-start" />
          Search
        </span>
        <KbdGroup aria-hidden="true">
          <Kbd>Ctrl/⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent
          finalFocus={() => returnFocusRef.current ?? false}
          showCloseButton={false}
          className="top-16 flex max-h-[calc(100dvh-5rem)] translate-y-0 flex-col p-3 sm:top-24 sm:p-6 sm:max-h-[calc(100dvh-7rem)] sm:max-w-lg"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search documentation</DialogTitle>
            <DialogDescription>Find component documentation and guides.</DialogDescription>
          </DialogHeader>
          <Command
            className="h-auto min-h-0 gap-2 overflow-visible bg-transparent p-0"
            shouldFilter={false}
          >
            <div className="shrink-0">
              <CommandInput
                aria-label="Search documentation"
                placeholder="Search docs…"
                value={query}
                onValueChange={setQuery}
                maxLength={200}
                autoFocus
              />
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
                          <span className="text-xs text-muted-foreground">{entry.description}</span>
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
      </Dialog>
    </div>
  );
}
