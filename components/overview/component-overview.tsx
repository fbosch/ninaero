"use client";

import { ArrowUpRightIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";

import {
  type ComponentName,
  componentGroups,
  componentTitle,
  matchesComponent,
  overviewItems,
} from "@/lib/component-overview";
import { Button } from "@/registry/ninaero/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ninaero/ui/dialog";
import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";

import { ComponentPreview } from "./component-preview";

export function ComponentOverview() {
  const searchId = useId();
  const searchInput = useRef<HTMLInputElement>(null);
  const previewTrigger = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ComponentName | null>(null);
  const visibleGroups = componentGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matchesComponent(item, query)),
    }))
    .filter((group) => group.items.length > 0);
  const count = visibleGroups.reduce((total, group) => total + group.items.length, 0);
  const selectedItem = overviewItems.find((item) => item.name === selected);

  return (
    <div className="flex items-start gap-10">
      <aside className="sticky top-6 hidden w-52 shrink-0 lg:block">
        <nav aria-label="Component groups" className="space-y-1 text-sm">
          <a
            href="#theme"
            className="flex min-h-10 items-center justify-between rounded-md px-3 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            Theme <span className="text-muted-foreground">1</span>
          </a>
          {visibleGroups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="flex min-h-10 items-center justify-between gap-3 rounded-md px-3 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              {group.title}
              <span className="text-muted-foreground">{group.items.length}</span>
            </a>
          ))}
        </nav>
        <p className="mt-6 px-3 text-xs leading-relaxed text-muted-foreground">
          Shared tokens. Real components. Open a preview to try an example.
        </p>
      </aside>

      <div className="min-w-0 flex-1 space-y-14">
        <div className="space-y-3">
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor={searchId}>Search components</Label>
              <div className="relative">
                <SearchIcon
                  className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id={searchId}
                  ref={searchInput}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Name or description"
                  className="h-10 pl-9"
                  aria-describedby="component-results"
                />
              </div>
            </div>
            {query ? (
              <Button
                variant="outline"
                className="h-10"
                onClick={() => {
                  setQuery("");
                  searchInput.current?.focus();
                }}
              >
                Clear search
              </Button>
            ) : null}
          </div>
          <output
            id="component-results"
            htmlFor={searchId}
            aria-live="polite"
            className="block text-xs text-muted-foreground"
          >
            {count} of {overviewItems.length} components
          </output>
          <nav
            aria-label="Jump to a component group"
            className="flex flex-wrap gap-x-4 gap-y-2 text-sm lg:hidden"
          >
            <a href="#theme" className="underline underline-offset-4">
              Theme
            </a>
            {visibleGroups.map((group) => (
              <a key={group.id} href={`#${group.id}`} className="underline underline-offset-4">
                {group.title}
              </a>
            ))}
          </nav>
        </div>

        <section
          id="theme"
          aria-labelledby="theme-overview-heading"
          className="scroll-mt-6 space-y-5"
        >
          <div className="flex items-baseline gap-3">
            <h2 id="theme-overview-heading" className="text-xl font-semibold tracking-tight">
              Theme
            </h2>
            <span className="text-sm text-muted-foreground">1 item</span>
          </div>
          <article className="overview-card max-w-md space-y-3">
            <div className="overview-thumbnail ninaero-paper-grid" aria-hidden="true">
              <div className="w-full space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {["bg-background", "bg-card", "bg-primary", "bg-secondary", "bg-accent"].map(
                    (color) => (
                      <div key={color} className={`h-14 rounded-lg border ${color}`} />
                    ),
                  )}
                </div>
                <p className="text-sm font-medium">Light and dark, from one token source.</p>
              </div>
            </div>
            <h3 className="font-medium">Ninaero theme</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Neutral surfaces, semantic colors, and shared light/dark tokens.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="/#tokens-heading" className="underline underline-offset-4">
                Theme workshop
              </a>
              <a href="/r/theme.json" className="underline underline-offset-4">
                Registry JSON
              </a>
            </div>
          </article>
        </section>

        {visibleGroups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-heading`}
            className="scroll-mt-6 space-y-6"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 id={`${group.id}-heading`} className="text-xl font-semibold tracking-tight">
                  {group.title}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {group.items.length} {group.items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item) => (
                <article
                  key={item.name}
                  data-overview-item={item.name}
                  aria-labelledby={`${item.name}-title`}
                  className="overview-card flex min-w-0 flex-col gap-3"
                >
                  <div
                    className="overview-thumbnail ninaero-paper-grid"
                    data-component={item.name}
                    inert
                    aria-hidden="true"
                  >
                    <div className="overview-thumbnail-content">
                      <ComponentPreview name={item.name} />
                    </div>
                  </div>
                  <h3 id={`${item.name}-title`} className="font-medium">
                    <Link
                      href={`/docs/${item.name}`}
                      className="hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {componentTitle(item.name)}
                    </Link>
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(event) => {
                        previewTrigger.current = event.currentTarget;
                        setSelected(item.name);
                      }}
                      aria-label={`Preview ${componentTitle(item.name)}`}
                    >
                      Preview
                    </Button>
                    <Link
                      href={`/docs/${item.name}`}
                      aria-label={`Docs for ${componentTitle(item.name)}`}
                      className="inline-flex min-h-9 items-center text-xs underline underline-offset-4"
                    >
                      Docs
                    </Link>
                    <a
                      href={`/r/${item.name}.json`}
                      aria-label={`Registry JSON for ${componentTitle(item.name)}`}
                      className="inline-flex min-h-9 items-center gap-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      Registry JSON <ArrowUpRightIcon className="size-3" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {count === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h2 className="font-medium">No components match this search</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another name or clear the search.
            </p>
          </div>
        ) : null}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          finalFocus={previewTrigger}
          className="max-h-[85svh] overflow-auto sm:max-w-2xl"
        >
          <DialogHeader>
            <DialogTitle>{selected ? componentTitle(selected) : "Component preview"}</DialogTitle>
            <DialogDescription>{selectedItem?.description}</DialogDescription>
          </DialogHeader>
          <div className="overview-live py-6">
            {selected ? <ComponentPreview key={selected} name={selected} interactive /> : null}
          </div>
          {selected ? (
            <a href={`/r/${selected}.json`} className="text-sm underline underline-offset-4">
              Registry JSON for {componentTitle(selected)}
            </a>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
