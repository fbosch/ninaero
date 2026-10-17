"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/ninaero/ui/sidebar";

import { workshopGroups } from "./workshop-sections";

export default function WorkshopNavigation() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = workshopGroups
    .map(({ title, items }) => ({
      title,
      items: items.filter(
        (item) =>
          !normalizedQuery ||
          title.toLowerCase().includes(normalizedQuery) ||
          item.title.toLowerCase().includes(normalizedQuery),
      ),
    }))
    .filter(({ items }) => items.length > 0);

  return (
    <Sidebar
      collapsible="none"
      className="h-auto w-full rounded-lg border lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:w-64"
    >
      <SidebarHeader>
        <p className="px-2 text-sm font-semibold">Workshop</p>
        <SidebarInput
          type="search"
          aria-label="Search workshop"
          placeholder="Search workshop"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </SidebarHeader>
      <SidebarContent className="max-h-[40vh] lg:max-h-none">
        <nav aria-label="Workshop navigation">
          {filteredGroups.length > 0 ? (
            filteredGroups.map(({ title, items }) => (
              <SidebarGroup key={title}>
                <SidebarGroupLabel>{title}</SidebarGroupLabel>
                <SidebarMenu>
                  {items.map(({ href, title: itemTitle }) => {
                    const isCurrent =
                      pathname === href ||
                      (href !== "/workshop" && pathname.startsWith(`${href}/`));

                    return (
                      <SidebarMenuItem key={href}>
                        <SidebarMenuButton
                          isActive={isCurrent}
                          render={
                            <Link
                              href={href}
                              aria-current={
                                pathname === href ? "page" : isCurrent ? "location" : undefined
                              }
                            />
                          }
                        >
                          <span>{itemTitle}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            ))
          ) : (
            <SidebarGroup>
              <p className="px-2 py-1 text-sm text-muted-foreground">No workshop pages match.</p>
            </SidebarGroup>
          )}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
}
