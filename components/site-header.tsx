"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAccent } from "@/components/accent-provider";
import { AppearanceSelectors } from "@/components/appearance-selectors";
import { FrutigerDolloMark } from "@/components/frutiger-dollo-mark";
import { SiteSearch } from "@/components/site-search";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { renderFrutigerDolloSvg } from "@/lib/frutiger-dollo-mark";
import { accentPresets } from "@/registry/ninaero/accents.mjs";
import { FieldLegend, FieldSet } from "@/registry/ninaero/ui/field";
import { HoverSound } from "@/registry/ninaero/ui/sound-feedback";

import dolloStyles from "./frutiger-dollo-mark.module.css";

const destinations = [["/docs", "Docs"]] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { accent } = useAccent();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) return;

    const colorMode = resolvedTheme === "dark" ? "dark" : "light";
    const palette = accentPresets[accent][colorMode];
    favicon.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      renderFrutigerDolloSvg(palette, 32),
    )}`;
  }, [accent, resolvedTheme]);

  return (
    <header
      className={`site-header ninaero-overlay-dither${
        pathname === "/" ? " site-header--home" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-[20px] py-5 sm:px-[32px] lg:grid lg:grid-cols-3">
        <nav
          aria-label="Main navigation"
          className="flex min-w-0 max-w-full flex-wrap items-center gap-5 text-sm"
        >
          <HoverSound>
            <Link
              href="/"
              aria-label="Ninaero"
              className={`type-title inline-flex items-center gap-2 ${dolloStyles.wordmark}`}
            >
              <FrutigerDolloMark className="shrink-0" />
              <span className="site-wordmark">
                <span className={dolloStyles.initial}>
                  N
                  <span className={dolloStyles.refraction} aria-hidden="true">
                    N
                  </span>
                </span>
                inaero
              </span>
            </Link>
          </HoverSound>
          {destinations.map(([href, label]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <HoverSound key={href}>
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? "page" : active ? "location" : undefined}
                  className={active ? "font-medium" : "text-muted-foreground hover:text-foreground"}
                >
                  {label}
                </Link>
              </HoverSound>
            );
          })}
        </nav>
        <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 lg:contents">
          <div className="lg:col-start-2 lg:row-start-1 lg:justify-self-center">
            <SiteSearch />
          </div>
          <FieldSet className="ninaero-surface-paper min-w-0 max-w-full flex-row flex-wrap items-start justify-end gap-2 lg:col-start-3 lg:row-start-1 lg:justify-self-end">
            <FieldLegend className="sr-only">Appearance</FieldLegend>
            <AppearanceSelectors />
            <ThemeSwitcher />
          </FieldSet>
        </div>
      </div>
    </header>
  );
}
