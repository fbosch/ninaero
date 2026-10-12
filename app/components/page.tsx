import type { Metadata } from "next";
import Link from "next/link";
import { ComponentOverview } from "@/components/overview/component-overview";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { overviewItems } from "@/lib/component-overview";

export const metadata: Metadata = {
  title: "Components | Ninaero",
  description:
    "Browse the complete Ninaero component catalogue with themed previews and registry sources.",
};

export default function ComponentsPage() {
  return (
    <main id="main" className="mx-auto max-w-7xl space-y-10 px-5 py-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-6 text-sm"
        >
          <Link href="/" className="font-semibold tracking-tight">
            Ninaero
          </Link>
          <Link
            href="/docs"
            className="text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
          <Link href="/components" aria-current="page" className="font-medium">
            Components
          </Link>
          <a
            href="/r/ninaero.json"
            className="text-muted-foreground hover:text-foreground"
          >
            Registry preset
          </a>
        </nav>
        <ThemeSwitcher />
      </header>
      <div className="max-w-2xl space-y-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Component catalogue
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Components
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          All {overviewItems.length} installed components, using the same
          Ninaero theme. Open a preview to try an example, or inspect its
          installable registry JSON.
        </p>
      </div>
      <ComponentOverview />
    </main>
  );
}
