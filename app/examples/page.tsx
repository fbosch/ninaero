import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Examples | Ninaero",
  description: "Composed interfaces built with Ninaero components.",
};

export default function ExamplesPage() {
  return (
    <main id="main" className="mx-auto max-w-4xl space-y-10 px-5 py-12 sm:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Examples</h1>
        <p className="text-muted-foreground">Components working together.</p>
      </header>
      <ul className="divide-y border-y">
        <li>
          <Link href="/examples/settings" className="block space-y-2 py-6 hover:bg-muted/30">
            <h2 className="font-medium">Settings</h2>
            <p className="text-sm text-muted-foreground">
              A compact profile form with tabs and inline help.
            </p>
          </Link>
        </li>
      </ul>
    </main>
  );
}
