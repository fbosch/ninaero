"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AccentSwitcher } from "@/components/accent-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";

const destinations = [["/docs", "Docs"]] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-5 text-sm">
          <Link href="/" className="type-title">
            Ninaero
          </Link>
          {destinations.map(([href, label]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : active ? "location" : undefined}
                className={active ? "font-medium" : "text-muted-foreground hover:text-foreground"}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div
          role="group"
          aria-label="Appearance"
          className="ninaero-surface-paper flex shrink-0 items-start gap-2"
        >
          <AccentSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
