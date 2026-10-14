"use client";

import type { CSSProperties } from "react";

import { FolderIcon, HomeIcon } from "@/lib/icons";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/ninaero/ui/message-scroller";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ninaero/ui/resizable";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/ninaero/ui/sidebar";

export function ResizablePreview() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-36 w-full rounded-lg border">
      <ResizablePanel defaultSize="40%" minSize="20%">
        <div className="flex h-full items-center justify-center text-sm">Panel one</div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize example panels" />
      <ResizablePanel defaultSize="60%" minSize="20%">
        <div className="flex h-full items-center justify-center text-sm">Panel two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function SidebarPreview() {
  return (
    <SidebarProvider
      className="min-h-0 justify-center"
      style={{ "--sidebar-width": "14rem" } as CSSProperties}
    >
      <Sidebar collapsible="none" className="rounded-lg border">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workshop</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<a href="/">Theme workshop</a>}>
                  <HomeIcon />
                  <span>Theme workshop</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive render={<a href="/components">Components</a>}>
                  <FolderIcon />
                  <span>Components</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

const messages = [
  "Choose a surface.",
  "Compare the borders.",
  "Try the dark theme.",
  "Check the text contrast.",
  "Inspect the focus ring.",
  "The preview is ready.",
];

export function MessageScrollerPreview() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-40 w-full rounded-lg border">
        <MessageScrollerViewport className="p-3">
          <MessageScrollerContent className="gap-3">
            {messages.map((message) => (
              <MessageScrollerItem key={message}>
                <p className="rounded-lg bg-muted px-3 py-2 text-sm">{message}</p>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
