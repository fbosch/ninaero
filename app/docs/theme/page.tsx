import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/docs/code-block";
import { theme } from "@/registry/ninaero/theme.mjs";

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

export default function ThemeDocsPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground">
          Theme documentation
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Theme</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Every component uses the light/dark tokens in{" "}
          <code className="text-foreground">registry/ninaero/theme.mjs</code>.
          The workshop and installable registry use this same source.
        </p>
      </header>
      <section aria-labelledby="theme-surfaces-heading" className="space-y-4">
        <h2 id="theme-surfaces-heading" className="text-xl font-semibold">
          Shared surfaces
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {swatches.map((swatch) => (
            <div key={swatch.title} className="space-y-2">
              <div
                aria-hidden="true"
                className={`h-20 rounded-lg border ${swatch.className}`}
              />
              <p className="text-sm">{swatch.title}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Use the theme selector in the header to compare light and dark
          surfaces.
        </p>
      </section>
      <section aria-labelledby="theme-edit-heading" className="space-y-4">
        <h2 id="theme-edit-heading" className="text-xl font-semibold">
          Update the theme
        </h2>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Edit the tokens and typography in{" "}
            <code className="text-foreground">registry/ninaero/theme.mjs</code>.
          </li>
          <li>
            Regenerate the CSS, registry, and documentation with the command
            below.
          </li>
          <li>
            Compare the updated states in the{" "}
            <Link
              href="/components"
              className="text-foreground underline underline-offset-4"
            >
              component overview
            </Link>{" "}
            before publishing.
          </li>
        </ol>
        <CodeBlock
          code="pnpm registry:build"
          label="Regenerate theme and registry"
        />
        <p className="text-sm text-muted-foreground">
          Do not edit <code className="text-foreground">app/globals.css</code>{" "}
          or <code className="text-foreground">registry.json</code> directly.
          They are generated.
        </p>
      </section>
      <section aria-labelledby="theme-token-heading" className="space-y-4">
        <h2 id="theme-token-heading" className="text-xl font-semibold">
          Light and dark tokens
        </h2>
        <CodeBlock
          code={JSON.stringify(
            { light: theme.light, dark: theme.dark },
            null,
            2,
          )}
          label="Theme token source"
        />
        <a
          href="/r/theme.json"
          className="inline-block text-sm underline underline-offset-4"
        >
          Theme registry JSON
        </a>
      </section>
    </article>
  );
}
