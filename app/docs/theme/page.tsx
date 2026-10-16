import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/docs/code-block";
import { theme } from "@/registry/ninaero/theme.mjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ninaero/ui/card";

export const metadata: Metadata = {
  title: "Theme | Ninaero",
  description: "The shared Ninaero light/dark tokens and how to update them.",
};

const swatches = [
  { title: "Background", className: "bg-background" },
  { title: "Card", className: "bg-card" },
  { title: "Primary", className: "bg-primary" },
  { title: "Secondary", className: "bg-secondary" },
  { title: "Muted", className: "bg-muted" },
  { title: "Accent", className: "bg-accent" },
];

const elevationExamples = [
  { label: "Flat", className: "shadow-flat", usage: "Page content" },
  { label: "Control", className: "shadow-control", usage: "Raised buttons" },
  { label: "Floating", className: "shadow-floating", usage: "Menus and popovers" },
  { label: "Dialog", className: "shadow-dialog", usage: "Modal panels" },
];

export default function ThemeDocsPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground">Theme documentation</p>
        <h1 className="text-4xl type-display">Theme</h1>
        <p className="max-w-2xl type-prose text-muted-foreground">
          Every component uses the light/dark tokens in{" "}
          <code className="text-foreground">registry/ninaero/theme.mjs</code>. The workshop and
          installable registry use this same source.
        </p>
      </header>
      <section aria-labelledby="theme-surfaces-heading" className="space-y-4">
        <h2 id="theme-surfaces-heading" className="text-xl type-heading">
          Shared surfaces
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {swatches.map((swatch) => (
            <div key={swatch.title} className="space-y-2">
              <div aria-hidden="true" className={`h-20 rounded-lg border ${swatch.className}`} />
              <p className="text-sm">{swatch.title}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Use the theme selector in the header to compare light and dark surfaces.
        </p>
      </section>
      <section aria-labelledby="theme-accent-heading" className="space-y-4">
        <h2 id="theme-accent-heading" className="text-xl type-heading">
          Accent presets
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          Choose Cyan, Indigo, Lavender, Slate, Lagoon, Sky, Blossom, or Lime with the Accent
          selector. Accent and color mode are independent. Primary actions, selected controls,
          links, and focus rings follow the palette. Paper, ink, structural borders, and status
          colors stay unchanged. The site remembers your choice when browser storage is available.
        </p>
        <p className="text-sm type-prose text-muted-foreground">
          Installed themes support the same presets without a React provider. Set data-accent on the
          root element and use the dark class for dark mode. Edit preset colors in
          registry/ninaero/accents.mjs, then regenerate the registry.
        </p>
        <CodeBlock
          code={'<html data-accent="lavender" class="dark">'}
          label="Lavender accent in dark mode"
          language="tsx"
        />
        <Link
          href="/workshop/buttons"
          className="inline-block text-sm underline underline-offset-4"
        >
          Compare accent buttons in the workshop
        </Link>
      </section>
      <section aria-labelledby="theme-typography-heading" className="space-y-4">
        <h2 id="theme-typography-heading" className="text-xl type-heading">
          Typography
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          Google Sans Flex keeps its rounded terminals across the theme. Pair a font size with a
          type-* role to set weight, line height, and letter spacing. Headings use tighter spacing;
          body text, controls, and captions keep normal spacing.
        </p>
        <CodeBlock
          code={
            '<h2 className="text-xl type-heading">Account settings</h2>\n<p className="text-sm type-body">Manage your profile and preferences.</p>'
          }
          label="Typography roles"
          language="tsx"
        />
        <p className="text-sm type-prose text-muted-foreground">
          Compact controls keep a 16px line height. Dialog titles and ruled prose keep a 24px line
          height. Role utilities leave font sizes unchanged, including responsive input sizing.
        </p>
        <Link href="/docs/typography" className="inline-block text-sm underline underline-offset-4">
          View the typography specimen
        </Link>
      </section>
      <section aria-labelledby="theme-elevation-heading" className="space-y-4">
        <h2 id="theme-elevation-heading" className="text-xl type-heading">
          Elevation
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          Choose a shadow by the element&apos;s distance from the paper beneath it. Elevation does
          not change stacking order. Use z-index separately for overlays.
        </p>
        <div
          role="group"
          aria-label="Elevation examples"
          className="ninaero-surface-paper grid grid-cols-2 gap-6 pb-8 lg:grid-cols-4"
        >
          {elevationExamples.map((elevation) => (
            <Card key={elevation.label} size="sm" className={elevation.className}>
              <CardHeader>
                <CardTitle>{elevation.label}</CardTitle>
                <CardDescription>{elevation.usage}</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-xs break-all">{elevation.className}</code>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm type-prose text-muted-foreground">
          Groups made entirely of raised buttons share one control shadow; their buttons keep their
          pressed states. The header uses the paper shadow-color context so the cast blends with its
          neutral background.
        </p>
        <CodeBlock
          code={'<Card className="shadow-floating">...</Card>'}
          label="Semantic elevation utility"
          language="tsx"
        />
      </section>
      <section aria-labelledby="theme-edit-heading" className="space-y-4">
        <h2 id="theme-edit-heading" className="text-xl type-heading">
          Update the theme
        </h2>
        <ol className="list-decimal space-y-3 pl-5 text-sm type-prose text-muted-foreground">
          <li>
            Edit the tokens and typography in{" "}
            <code className="text-foreground">registry/ninaero/theme.mjs</code>.
          </li>
          <li>Regenerate the CSS, registry, and documentation with the command below.</li>
          <li>
            Review the updated theme across the component documentation pages before publishing.
          </li>
        </ol>
        <CodeBlock
          code="pnpm registry:build"
          label="Regenerate theme and registry"
          language="bash"
        />
        <p className="text-sm text-muted-foreground">
          Do not edit <code className="text-foreground">app/globals.css</code> or{" "}
          <code className="text-foreground">registry.json</code> directly. They are generated.
        </p>
      </section>
      <section aria-labelledby="theme-token-heading" className="space-y-4">
        <h2 id="theme-token-heading" className="text-xl type-heading">
          Light and dark tokens
        </h2>
        <CodeBlock
          code={JSON.stringify({ light: theme.light, dark: theme.dark }, null, 2)}
          label="Theme token source"
          language="json"
        />
        <a href="/r/theme.json" className="inline-block text-sm underline underline-offset-4">
          Theme registry JSON
        </a>
      </section>
    </article>
  );
}
