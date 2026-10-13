"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/ninaero/ui/popover";

const destinations = [
  ["/examples", "Examples"],
  ["/components", "Components"],
  ["/docs", "Docs"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b px-5 py-5 sm:px-8">
      <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-5 text-sm">
        <Link href="/" className="font-semibold tracking-tight">
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
      <Popover>
        <PopoverTrigger className="rounded-sm text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
          Appearance
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)] p-4">
          <ThemeSwitcher />
        </PopoverContent>
      </Popover>
    </header>
  );
}
