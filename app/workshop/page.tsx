import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workshop | Ninaero",
  description: "Focused checks for component states, accents, and theme tokens.",
};

const specimens = [
  ["buttons", "Buttons", "Variants, sizes, press feedback, and accent comparisons."],
  ["inputs", "Inputs", "Editable, disabled, and invalid states."],
  ["dialog", "Dialog", "Overlay surfaces and keyboard focus."],
  ["tabs", "Tabs", "Neutral selection, keyboard focus, and action hierarchy."],
  ["slider", "Sliders", "Single values, ranges, drag feedback, and keyboard focus."],
  ["patterns", "Patterns", "Paper textures, checkerboards, spacing, ink colors, and fills."],
  ["tokens", "Tokens", "Shared semantic colors."],
] as const;

export default function WorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl type-display">Workshop</h1>
        <p className="text-muted-foreground">One specimen at a time.</p>
      </header>
      <ul className="divide-y border-y">
        {specimens.map(([slug, title, description]) => (
          <li key={slug}>
            <Link href={`/workshop/${slug}`} className="block space-y-1 py-5 hover:bg-muted/30">
              <h2 className="type-title">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
