import Link from "next/link";
import type { CSSProperties } from "react";

import { FolderIcon, HomeIcon } from "@/lib/icons";
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
                <SidebarMenuButton render={<Link href="/">Theme workshop</Link>}>
                  <HomeIcon />
                  <span>Theme workshop</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive render={<Link href="/docs">Components</Link>}>
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
