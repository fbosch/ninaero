import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/registry/ninaero/ui/sidebar";

import WorkshopNavigation from "./workshop-navigation";

export default function WorkshopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-[20px] py-8 sm:px-[32px]">
      <SidebarProvider className="min-h-0 flex-col gap-6 lg:flex-row lg:gap-8">
        <WorkshopNavigation />
        <SidebarInset id="main" className="min-w-0 gap-8 bg-transparent">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
