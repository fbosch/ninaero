import Link from "next/link";
import type { ReactNode } from "react";

const sections = [
  ["/workshop", "Workshop"],
  ["/workshop/buttons", "Buttons"],
  ["/workshop/inputs", "Inputs"],
  ["/workshop/dialog", "Dialog"],
  ["/workshop/tokens", "Tokens"],
] as const;

export default function WorkshopLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="mx-auto max-w-5xl space-y-8 px-5 py-10 sm:px-8">
      <nav
        aria-label="Workshop navigation"
        className="flex flex-wrap gap-5 border-b pb-5 text-sm text-muted-foreground"
      >
        {sections.map(([href, label]) => (
          <Link key={href} href={href} className="hover:text-foreground">
            {label}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
