import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Theme tokens | Ninaero" };

const swatches = [
  { name: "Background", className: "bg-background" },
  { name: "Card", className: "bg-card" },
  { name: "Popover", className: "bg-popover" },
  { name: "Primary", className: "bg-primary" },
  { name: "Secondary", className: "bg-secondary" },
  { name: "Muted", className: "bg-muted" },
  { name: "Accent", className: "bg-accent" },
  { name: "Destructive", className: "bg-destructive" },
];

export default function TokenWorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl type-display">Tokens</h1>
        <p className="text-muted-foreground">
          Neutral materials, accent roles, and semantic feedback.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {swatches.map((swatch) => (
          <div key={swatch.name} className="space-y-2">
            <div className={`h-20 rounded-lg border ${swatch.className}`} />
            <p className="text-sm text-muted-foreground">{swatch.name}</p>
          </div>
        ))}
      </div>
      <Link href="/docs/theme" className="inline-block text-sm underline underline-offset-4">
        Theme guide
      </Link>
    </div>
  );
}
