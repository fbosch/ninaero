import type { Metadata } from "next";
import Link from "next/link";

import { workshopSpecimens } from "./workshop-sections";

export const metadata: Metadata = {
  title: "Workshop | Ninaero",
  description: "Focused checks for component states, accents, and theme tokens.",
};

export default function WorkshopPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl type-display">Workshop</h1>
        <p className="text-muted-foreground">One specimen at a time.</p>
      </header>
      <ul className="divide-y border-y">
        {workshopSpecimens.map(({ href, title, description }) => (
          <li key={href}>
            <Link href={href} className="block space-y-1 py-5 hover:bg-muted/30">
              <h2 className="type-title">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
