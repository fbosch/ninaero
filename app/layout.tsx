import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import { AccentProvider } from "@/components/accent-provider";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { accentBootstrap } from "@/lib/accent-preference.mjs";
import { defaultAccent } from "@/registry/ninaero/accents.mjs";
import { TooltipProvider } from "@/registry/ninaero/ui/tooltip";

import "./globals.css";
import "./site.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ninaero",
  description: "A paper-led shadcn/ui theme with examples and component documentation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={nunitoSans.variable}
      data-accent={defaultAccent}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Bootstrap contains only trusted constants and allowlists stored values. */}
        <script dangerouslySetInnerHTML={{ __html: accentBootstrap }} />
      </head>
      <body>
        <ThemeProvider>
          <AccentProvider>
            <TooltipProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:p-3"
              >
                Skip to content
              </a>
              <SiteHeader />
              {children}
              <footer className="mx-auto max-w-7xl px-5 py-8 text-sm text-muted-foreground sm:px-8">
                <Link href="/workshop" className="hover:text-foreground">
                  Workshop
                </Link>
              </footer>
            </TooltipProvider>
          </AccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
