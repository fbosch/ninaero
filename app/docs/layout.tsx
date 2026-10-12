import Link from "next/link";
import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b py-6">
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-6 text-sm"
        >
          <Link href="/" className="font-semibold tracking-tight">
            Ninaero
          </Link>
          <Link href="/docs" aria-current="location" className="font-medium">
            Docs
          </Link>
          <Link
            href="/components"
            className="text-muted-foreground hover:text-foreground"
          >
            Components
          </Link>
        </nav>
        <ThemeSwitcher />
      </header>
      <div className="flex flex-col items-stretch gap-8 py-8 lg:flex-row lg:items-start lg:gap-12">
        <aside className="shrink-0 lg:sticky lg:top-6 lg:max-h-[calc(100svh-3rem)] lg:w-60 lg:overflow-auto lg:pr-2">
          <DocsSidebar />
        </aside>
        <main id="main" className="min-w-0 flex-1 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
