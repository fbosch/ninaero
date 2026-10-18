import type { CSSProperties } from "react";

import { Button } from "@/registry/ninaero/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/ninaero/ui/sidebar";

export default function ShadowCheckPage() {
  return (
    <SidebarProvider
      className="relative min-h-96 [&_[data-slot=sidebar-container]]:absolute [&_[data-slot=sidebar-container]]:h-full"
      style={
        {
          "--sidebar": "color-mix(in oklab, var(--primary) 12%, var(--muted))",
        } as CSSProperties
      }
    >
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent className="gap-4 p-4">
          <p>Sidebar</p>
          <Button variant="secondary">Sidebar action</Button>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="items-start gap-4 p-6">
        <SidebarTrigger />
        <h1>Shadow contexts</h1>
        <Button variant="secondary">Panel action</Button>
      </SidebarInset>
    </SidebarProvider>
  );
}
