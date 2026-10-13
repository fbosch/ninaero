import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccentProvider } from "@/components/accent-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { accentBootstrap } from "@/lib/accent-preference.mjs";
import { defaultAccent } from "@/registry/ninaero/accents.mjs";
import { TooltipProvider } from "@/registry/ninaero/ui/tooltip";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  title: "Ninaero",
  description: "A shadcn/ui theme workshop built with Next.js and Base UI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-accent={defaultAccent} suppressHydrationWarning>
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
              {children}
            </TooltipProvider>
          </AccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
