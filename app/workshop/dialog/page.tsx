import type { Metadata } from "next";

import { DialogFormPreview, DialogPreview } from "@/components/examples/dialog-preview";

export const metadata: Metadata = { title: "Dialog workshop | Ninaero" };

export default function DialogWorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Dialog</h1>
        <p className="text-muted-foreground">
          Compare a centered prompt with a left-aligned form. Changes stay in this preview.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <section aria-labelledby="dialog-prompt-heading" className="space-y-4">
          <div className="space-y-1">
            <h2 id="dialog-prompt-heading" className="text-lg font-medium">
              Confirmation prompt
            </h2>
            <p className="text-sm text-muted-foreground">Centered content and broad actions.</p>
          </div>
          <DialogPreview />
        </section>
        <section aria-labelledby="dialog-form-heading" className="space-y-4">
          <div className="space-y-1">
            <h2 id="dialog-form-heading" className="text-lg font-medium">
              Form dialog
            </h2>
            <p className="text-sm text-muted-foreground">Compact fields and a clear action row.</p>
          </div>
          <DialogFormPreview />
        </section>
      </div>
    </div>
  );
}
