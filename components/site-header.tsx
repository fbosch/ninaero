"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppearanceSelectors } from "@/components/appearance-selectors";
import { SiteSearch } from "@/components/site-search";
import { ThemeSwitcher } from "@/components/theme-switcher";

const destinations = [["/docs", "Docs"]] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-5 sm:px-8 lg:grid lg:grid-cols-3">
        <nav
          aria-label="Main navigation"
          className="flex shrink-0 flex-wrap items-center gap-5 text-sm"
        >
          <Link href="/" className="type-title inline-flex items-center gap-2">
            <span aria-hidden="true" className="text-xl leading-none">
              🐠
            </span>
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
        <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 lg:contents">
          <div className="lg:col-start-2 lg:row-start-1 lg:justify-self-center">
            <SiteSearch />
          </div>
          <div
            role="group"
            aria-label="Appearance"
            className="ninaero-surface-paper flex max-w-full flex-wrap items-start justify-end gap-2 lg:col-start-3 lg:row-start-1 lg:justify-self-end"
          >
            <AppearanceSelectors />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
