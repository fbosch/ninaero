"use client";

import type { ComponentType } from "react";
import { useState } from "react";

import type { NavigationName, PreviewProps } from "@/lib/component-overview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/ninaero/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/ninaero/ui/breadcrumb";
import { Button } from "@/registry/ninaero/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/ninaero/ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/registry/ninaero/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/ninaero/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/registry/ninaero/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/registry/ninaero/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ninaero/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ninaero/ui/tabs";

function AccordionPreview() {
  return (
    <div className="w-full max-w-72">
      <Accordion defaultValue={["details"]}>
        <AccordionItem value="details">
          <AccordionTrigger>What is included?</AccordionTrigger>
          <AccordionContent>Buttons, menus, and other interface components.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="usage">
          <AccordionTrigger>Where can I use them?</AccordionTrigger>
          <AccordionContent>In your own interface.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function BreadcrumbPreview() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Navigation</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CollapsiblePreview() {
  return (
    <Collapsible className="w-full max-w-72 rounded-lg border p-3">
      <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
        Show details
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
        Additional details appear here.
      </CollapsibleContent>
    </Collapsible>
  );
}

function ContextMenuPreview() {
  const [choice, setChoice] = useState("No action selected");
  return (
    <div className="w-full max-w-72 space-y-2">
      <ContextMenu>
        <ContextMenuTrigger
          className="block rounded-lg border border-dashed p-4 text-center text-sm"
          tabIndex={0}
        >
          Right-click here or press Shift+F10
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setChoice("Copy selected")}>Copy sample</ContextMenuItem>
          <ContextMenuItem onClick={() => setChoice("Inspect selected")}>
            Inspect sample
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {choice}
      </p>
    </div>
  );
}

function DropdownMenuPreview() {
  const [choice, setChoice] = useState("No view selected");
  return (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>Choose view</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setChoice("Grid view selected")}>
            Grid view
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setChoice("List view selected")}>
            List view
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {choice}
      </p>
    </div>
  );
}

function MenubarPreview() {
  const [choice, setChoice] = useState("No option selected");
  return (
    <div className="space-y-2">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setChoice("Grid selected")}>Grid</MenubarItem>
            <MenubarItem onClick={() => setChoice("List selected")}>List</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setChoice("Help selected")}>About this example</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {choice}
      </p>
    </div>
  );
}

function NavigationMenuPreview() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-56 gap-1">
              <NavigationMenuLink href="/docs">All components</NavigationMenuLink>
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">Components</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function PaginationPreview() {
  const [page, setPage] = useState(1);
  return (
    <div className="space-y-2 text-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="/docs"
              aria-disabled={page === 1}
              onClick={(event) => {
                event.preventDefault();
                setPage((current) => Math.max(1, current - 1));
              }}
            />
          </PaginationItem>
          {[1, 2, 3].map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href="/docs"
                isActive={page === number}
                aria-label={`Page ${number}`}
                onClick={(event) => {
                  event.preventDefault();
                  setPage(number);
                }}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="/docs"
              aria-disabled={page === 3}
              onClick={(event) => {
                event.preventDefault();
                setPage((current) => Math.min(3, current + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        Showing sample page {page} of 3
      </p>
    </div>
  );
}

function TabsPreview() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-72">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-2">
        Overview panel
      </TabsContent>
      <TabsContent value="details" className="p-2">
        Details panel
      </TabsContent>
    </Tabs>
  );
}

export const navigationPreviews = {
  accordion: AccordionPreview,
  breadcrumb: BreadcrumbPreview,
  collapsible: CollapsiblePreview,
  "context-menu": ContextMenuPreview,
  "dropdown-menu": DropdownMenuPreview,
  menubar: MenubarPreview,
  "navigation-menu": NavigationMenuPreview,
  pagination: PaginationPreview,
  tabs: TabsPreview,
} satisfies Record<NavigationName, ComponentType<PreviewProps>>;
