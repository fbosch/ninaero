import type { Metadata } from "next";

import { CodeBlock } from "@/components/docs/code-block";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ninaero/ui/card";

export const metadata: Metadata = {
  title: "Background details | Ninaero",
  description: "How to use Ninaero's ruled, dotted, grid, and notebook background treatments.",
};

const paperPatterns = [
  {
    title: "Ruled",
    className: "ninaero-paper-ruled",
    description: "Use behind continuous prose with a matching 24px line height.",
    example: '<p className="ninaero-paper-ruled leading-6">Line-aligned prose.</p>',
  },
  {
    title: "Dotted",
    className: "ninaero-paper-dotted",
    description: "Use on page backgrounds, such as the homepage.",
    example: '<main className="ninaero-paper-dotted bg-background">...</main>',
  },
  {
    title: "Grid",
    className: "ninaero-paper-grid",
    description: "Use behind catalogue thumbnails and component previews.",
    example: '<div className="ninaero-paper-grid">...</div>',
  },
  {
    title: "Notebook",
    className: "ninaero-paper-notebook",
    description: "Dense ruling with section dividers, vertical guides, and marked intersections.",
    example: '<div aria-hidden="true" className="ninaero-paper-notebook" />',
  },
];

export default function PaperDetailsPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground">Theme documentation</p>
        <h1 className="text-4xl type-display">Background details</h1>
        <p className="max-w-2xl type-prose text-muted-foreground">
          Ninaero includes four opt-in CSS textures for page backgrounds and preview areas. Use one
          pattern per region, and keep the page's neutral fill beneath it.
        </p>
      </header>

      <section aria-labelledby="paper-patterns-heading" className="space-y-4">
        <h2 id="paper-patterns-heading" className="text-xl type-heading">
          Available patterns
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {paperPatterns.map((pattern) => (
            <Card key={pattern.title} size="sm">
              <CardHeader>
                <CardTitle>{pattern.title}</CardTitle>
                <CardDescription>{pattern.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div aria-hidden="true" className={`h-24 rounded-md border ${pattern.className}`} />
                <CodeBlock
                  code={pattern.example}
                  label={`${pattern.title} pattern example`}
                  language="tsx"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="paper-guidance-heading" className="space-y-4">
        <h2 id="paper-guidance-heading" className="text-xl type-heading">
          Use the textures selectively
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm type-prose text-muted-foreground">
          <li>
            Use the ruled pattern behind paragraphs only. Match its 24px rule interval with a 24px
            line height so each line of text stays aligned.
          </li>
          <li>
            Keep forms, controls, tables, and code blocks on plain, opaque backgrounds. Do not layer
            dots, ruling, or a grid over one another.
          </li>
          <li>
            The background fill and pattern ink stay grayscale across accent presets. Forced-colors
            mode removes the textures, so content must remain clear without them.
          </li>
        </ul>
      </section>
    </article>
  );
}
