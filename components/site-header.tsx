"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type CSSProperties, type ReactNode } from "react";

import { useAccent } from "@/components/accent-provider";
import { AppearanceSelectors } from "@/components/appearance-selectors";
import { FrutigerDolloMark } from "@/components/frutiger-dollo-mark";
import { SiteSearch } from "@/components/site-search";
import { renderFrutigerDolloSvg } from "@/lib/frutiger-dollo-mark";
import { accentPresets } from "@/registry/ninaero/accents.mjs";
import { HoverSound } from "@/registry/ninaero/ui/sound-feedback";

import dolloStyles from "./frutiger-dollo-mark.module.css";

const destinations = [["/docs", "Docs"]] as const;

export function SiteHeader({ children }: { children?: ReactNode }) {
  const pathname = usePathname();
  const { accent } = useAccent();
  const logoStyle = {
    "--button-primary-fill": accentPresets[accent].dark["button-primary-fill"],
  } as CSSProperties;

  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) return;

    const palette = accentPresets[accent].dark;
    favicon.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      renderFrutigerDolloSvg(palette, 32),
    )}`;
  }, [accent]);

  return (
    <header
      className={`site-header ninaero-overlay-dither${
        pathname === "/" ? " site-header--home" : ""
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3 px-[20px] py-5 sm:flex sm:flex-wrap sm:justify-between sm:gap-x-4 sm:px-[32px] lg:grid lg:grid-cols-3">
        <nav
          aria-label="Main navigation"
          className="flex min-w-0 max-w-full flex-wrap items-center gap-4 text-sm sm:gap-5"
        >
          <HoverSound>
            <Link
              href="/"
              aria-label="Ninaero"
              style={logoStyle}
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
          <HoverSound>
            <Link
              href="https://github.com/fbosch/ninaero"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <svg
                aria-hidden="true"
                className="size-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.729.082-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.305.762-1.605-2.665-.304-5.466-1.334-5.466-5.931 0-1.31.467-2.381 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.119 3.176.77.84 1.233 1.911 1.233 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </Link>
          </HoverSound>
        </nav>
        <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 lg:contents">
          <div className="lg:col-start-2 lg:row-start-1 lg:justify-self-center">
            <SiteSearch />
          </div>
          <AppearanceSelectors />
        </div>
      </div>
      {children}
    </header>
  );
}
