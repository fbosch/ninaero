import type { Metadata } from "next";

import { ButtonPreview } from "@/components/examples/button-preview";

export const metadata: Metadata = { title: "Button workshop | Ninaero" };

export default function ButtonWorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Buttons</h1>
        <p className="text-muted-foreground">Compare materials, accents, and interaction states.</p>
      </header>
      <ButtonPreview />
    </div>
  );
}
