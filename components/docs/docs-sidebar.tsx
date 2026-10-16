"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

import {
  componentTitle,
  extraItems,
  matchesComponent,
  upstreamItems,
} from "@/lib/component-overview";
import { Button } from "@/registry/ninaero/ui/button";
import { Field, FieldLabel } from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";

export function DocsSidebar() {
  const pathname = usePathname();
  const searchId = useId();
  const menuId = `${searchId}-navigation`;
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const items = upstreamItems.filter((item) => matchesComponent(item, query));
  const extras = extraItems.filter((item) => matchesComponent(item, query));
  const count = items.length + extras.length;

  function linkClass(href: string) {
    return `block rounded-md px-3 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-ring ${pathname === href ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;
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
        className={`flex-col gap-6 ${expanded ? "flex" : "hidden"} lg:flex`}
      >
        <div>
          {[
            { href: "/docs", label: "Introduction" },
            { href: "/docs/theme", label: "Theming" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={linkClass(href)}
            >
              {label}
            </Link>
          ))}
        </div>
        <Field className="px-3">
          <FieldLabel htmlFor={searchId}>Find a component</FieldLabel>
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
            className="text-xs text-muted-foreground"
          >
            {`${count} ${count === 1 ? "component" : "components"}`}
          </output>
        </Field>
        {[
          { id: "components", title: "Components", entries: items },
          { id: "extras", title: "Additional components", entries: extras },
        ]
          .filter((group) => group.entries.length > 0)
          .map((group) => (
            <section key={group.id} aria-labelledby={`docs-${group.id}`}>
              <h2 id={`docs-${group.id}`} className="mb-2 px-3 text-xs font-semibold">
                {group.title}
              </h2>
              <ul className="flex flex-col gap-0.5">
                {group.entries.map((item) => {
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
          <p className="px-3 text-sm text-muted-foreground">No components match this search.</p>
        ) : null}
      </nav>
    </>
  );
}
