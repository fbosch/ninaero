import type { ReactNode } from "react";

import { DocsSidebar } from "./docs-sidebar";

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="flex flex-col items-stretch gap-8 py-8 lg:flex-row lg:items-start lg:gap-10">
        <aside className="shrink-0 lg:sticky lg:top-6 lg:max-h-[calc(100svh-3rem)] lg:w-56 lg:overflow-auto lg:pr-2">
          <DocsSidebar />
        </aside>
        <main id="main" className="min-w-0 flex-1 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
