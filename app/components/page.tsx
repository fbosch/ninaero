import type { Metadata } from "next";

import { ComponentOverview } from "@/components/overview/component-overview";
import { overviewItems } from "@/lib/component-overview";

export const metadata: Metadata = {
  title: "Components | Ninaero",
  description:
    "Browse the complete Ninaero component catalogue with themed previews and registry sources.",
};

export default function ComponentsPage() {
  return (
    <main id="main" className="mx-auto max-w-7xl space-y-10 px-5 py-8 sm:px-8">
      <div className="max-w-2xl space-y-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Component catalogue
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Components</h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          All {overviewItems.length} installed components, using the same Ninaero theme. Open a
          preview to try an example, or inspect its installable registry JSON.
        </p>
      </div>
      <ComponentOverview />
    </main>
  );
}
