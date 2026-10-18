import type { Metadata } from "next";

import { CodeBlockSpecimens } from "./code-block-specimens";

export const metadata: Metadata = { title: "Code Block workshop | Ninaero" };

export default function CodeBlockWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Code Block</h1>
        <p className="text-muted-foreground">
          Compare highlighted code, diffs, long output, and error states in light and dark modes.
        </p>
      </header>
      <CodeBlockSpecimens />
    </div>
  );
}
