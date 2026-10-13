import type { Metadata } from "next";

import { DialogPreview } from "@/components/examples/dialog-preview";

export const metadata: Metadata = { title: "Dialog workshop | Ninaero" };

export default function DialogWorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Dialog</h1>
        <p className="text-muted-foreground">Inspect popup surfaces and keyboard focus.</p>
      </header>
      <DialogPreview />
    </div>
  );
}
