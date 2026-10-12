"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import {
  componentGroups,
  componentTitle,
  matchesComponent,
} from "@/lib/component-overview";
import { Button } from "@/registry/ninaero/ui/button";
import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";

export function DocsSidebar() {
  const pathname = usePathname();
  const searchId = useId();
  const menuId = `${searchId}-navigation`;
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const groups = componentGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matchesComponent(item, query)),
    }))
    .filter((group) => group.items.length > 0);
  const count = groups.reduce((total, group) => total + group.items.length, 0);

  function linkClass(href: string) {
    return `block rounded-md px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring ${pathname === href ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;
  }

  return (
    <>
      <Button
        variant="outline"
        className="mb-4 w-full justify-between lg:hidden"
        aria-expanded={expanded}
        aria-controls={menuId}
        onClick={() => setExpanded((value) => !value)}
      >
        Browse documentation
      </Button>
      <nav
        id={menuId}
        aria-label="Documentation"
        className={`space-y-6 ${expanded ? "block" : "hidden"} lg:block`}
      >
        <div className="space-y-1">
          <Link
            href="/docs"
            aria-current={pathname === "/docs" ? "page" : undefined}
            className={linkClass("/docs")}
          >
            Getting started
          </Link>
          <Link
            href="/docs/theme"
            aria-current={pathname === "/docs/theme" ? "page" : undefined}
            className={linkClass("/docs/theme")}
          >
            Theme
          </Link>
          <Link href="/components" className={linkClass("/components")}>
            Component overview
          </Link>
        </div>
        <div className="space-y-2 px-3">
          <Label htmlFor={searchId}>Find a component</Label>
          <Input
            id={searchId}
            type="search"
            placeholder="Name or description"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-describedby={`${searchId}-count`}
          />
          <output
            id={`${searchId}-count`}
            htmlFor={searchId}
            aria-live="polite"
            className="block text-xs text-muted-foreground"
          >
            {count} components
          </output>
        </div>
        {groups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`docs-${group.id}`}
            className="space-y-2"
          >
            <h2 id={`docs-${group.id}`} className="px-3 text-xs font-semibold">
              {group.title}
            </h2>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const href = `/docs/${item.name}`;
                return (
                  <li key={item.name}>
                    <Link
                      data-doc-link={item.name}
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      className={linkClass(href)}
                    >
                      {componentTitle(item.name)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {count === 0 ? (
          <p className="px-3 text-sm text-muted-foreground">
            No components match this search.
          </p>
        ) : null}
      </nav>
    </>
  );
}
