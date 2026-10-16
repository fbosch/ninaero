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
  description:
    "Configurable ruled, dotted, grid, and notebook backgrounds with Tailwind utilities.",
};

const backgroundPatterns = [
  {
    title: "Ruled",
    description: "Use behind continuous prose. Match the line height to the rule interval.",
    defaultSpacing: "24px",
    samples: [
      { className: "ninaero-paper-ruled-16", spacing: "16px" },
      { className: "ninaero-paper-ruled-24", spacing: "24px" },
      { className: "ninaero-paper-ruled-32", spacing: "32px" },
    ],
    example: '<p className="ninaero-paper-ruled-24 leading-6">Line-aligned prose.</p>',
  },
  {
    title: "Dotted",
    description: "Use on page backgrounds, such as the homepage.",
    defaultSpacing: "16px",
    samples: [
      { className: "ninaero-paper-dotted-8", spacing: "8px" },
      { className: "ninaero-paper-dotted-16", spacing: "16px" },
      { className: "ninaero-paper-dotted-24", spacing: "24px" },
    ],
    example: '<main className="ninaero-paper-dotted-16 bg-background">...</main>',
  },
  {
    title: "Grid",
    description: "Use behind catalogue thumbnails and component previews.",
    defaultSpacing: "24px",
    samples: [
      { className: "ninaero-paper-grid-12", spacing: "12px" },
      { className: "ninaero-paper-grid-24", spacing: "24px" },
      { className: "ninaero-paper-grid-40", spacing: "40px" },
    ],
    example: '<div aria-hidden="true" className="ninaero-paper-grid-24 h-48" />',
  },
  {
    title: "Notebook",
    description: "A repeating SVG tile with fine rules, square cells, and marked intersections.",
    defaultSpacing: "6px",
    samples: [
      { className: "ninaero-paper-notebook-4", spacing: "4px" },
      { className: "ninaero-paper-notebook-6", spacing: "6px" },
      { className: "ninaero-paper-notebook-8", spacing: "8px" },
    ],
    example: '<div aria-hidden="true" className="ninaero-paper-notebook-8 h-60" />',
  },
];

const ditherSamples = [
  { className: "ninaero-dither-4", spacing: "4px" },
  { className: "ninaero-dither-8", spacing: "8px" },
  { className: "ninaero-dither-12", spacing: "12px" },
];

const responsiveExample =
  '<div aria-hidden="true" className="ninaero-paper-grid-12 h-40 md:ninaero-paper-grid-32" />';

export default function BackgroundDetailsPage() {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium text-muted-foreground">Theme documentation</p>
        <h1 className="text-4xl type-display">Background details</h1>
        <p className="max-w-2xl type-prose text-muted-foreground">
          Ninaero includes five opt-in textures for page backgrounds and preview areas. Use one
          pattern per region, and keep the page&apos;s existing fill beneath it.
        </p>
      </header>

      <section aria-labelledby="pattern-sizing-heading" className="flex flex-col gap-4">
        <h2 id="pattern-sizing-heading" className="text-xl type-heading">
          Set the interval
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          Add a numeric suffix to set the interval in CSS pixels. For example,{" "}
          <code className="text-foreground">ninaero-paper-grid-8</code> draws an 8px grid. These are
          pixel values, not Tailwind spacing steps. Each class applies the complete texture; no base
          class is needed alongside it.
        </p>
        <p className="text-sm type-prose text-muted-foreground">
          Decimal values work too, such as{" "}
          <code className="text-foreground">ninaero-paper-dotted-12.5</code>. Intervals have a 1px
          minimum. Omitting the suffix uses the default listed below. Dot sizes and stroke widths
          stay fixed when the interval changes.
        </p>
        <p className="text-sm type-prose text-muted-foreground">
          Notebook uses a repeating SVG tile. Its suffix sets the fine-line interval, with 20
          intervals per square cell. The 6px default gives 120px cells, with the fine lines aligned
          across every cell boundary.
        </p>
      </section>

      <section aria-labelledby="paper-patterns-heading" className="flex flex-col gap-4">
        <h2 id="paper-patterns-heading" className="text-xl type-heading">
          Compare sizes
        </h2>
        <div className="flex flex-col gap-6">
          {backgroundPatterns.map((pattern) => (
            <Card key={pattern.title} size="sm">
              <CardHeader>
                <CardTitle>{pattern.title}</CardTitle>
                <CardDescription>{pattern.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Default without a suffix: {pattern.defaultSpacing}.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {pattern.samples.map((sample) => (
                    <figure key={sample.className} className="flex min-w-0 flex-col gap-2">
                      <div
                        aria-hidden="true"
                        className={`h-60 rounded-md border ${sample.className}`}
                      />
                      <figcaption className="flex flex-col gap-1 text-sm">
                        <span>{sample.spacing}</span>
                        <code className="text-xs break-all text-muted-foreground">
                          {sample.className}
                        </code>
                      </figcaption>
                    </figure>
                  ))}
                </div>
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

      <section aria-labelledby="pattern-variants-heading" className="flex flex-col gap-4">
        <h2 id="pattern-variants-heading" className="text-xl type-heading">
          Change sizes at breakpoints
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          Pattern utilities support Tailwind variants. Resize the page to see this grid switch from
          12px to 32px at the md breakpoint.
        </p>
        <div
          aria-hidden="true"
          className="ninaero-paper-grid-12 h-40 rounded-md border md:ninaero-paper-grid-32"
        />
        <CodeBlock code={responsiveExample} label="Responsive grid interval" language="tsx" />
        <p className="text-sm type-prose text-muted-foreground">
          Keep complete class names in your source so Tailwind can detect them. When choosing sizes
          in JavaScript, select from full class strings instead of building a class name from parts.
        </p>
      </section>

      <section aria-labelledby="dither-heading" className="flex flex-col gap-4">
        <h2 id="dither-heading" className="text-xl type-heading">
          Diamond dither overlay
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          This SVG mesh has a transparent background and neutral ink, so it keeps the surface&apos;s
          existing color. Use <code className="text-foreground">ninaero-dither</code> for an 8px
          tile, or add a numeric suffix to change the tile size. The examples below keep the same
          muted fill.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {ditherSamples.map((sample) => (
            <figure key={sample.className} className="flex min-w-0 flex-col gap-2">
              <div
                aria-hidden="true"
                className={`h-40 rounded-md border bg-muted ${sample.className}`}
              />
              <figcaption className="flex flex-col gap-1 text-sm">
                <span>{sample.spacing} tile</span>
                <code className="text-xs break-all text-muted-foreground">{sample.className}</code>
              </figcaption>
            </figure>
          ))}
        </div>
        <CodeBlock
          code={'<div aria-hidden="true" className="ninaero-dither-8 h-40 bg-muted" />'}
          label="Transparent dither over a muted surface"
          language="tsx"
        />
        <p className="text-sm type-prose text-muted-foreground">
          Keep this texture in decorative areas. Avoid dense text and controls, and use it instead
          of another paper pattern rather than layering textures.
        </p>
      </section>

      <section aria-labelledby="paper-guidance-heading" className="flex flex-col gap-4">
        <h2 id="paper-guidance-heading" className="text-xl type-heading">
          Use the textures selectively
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm type-prose text-muted-foreground">
          <li>
            Use the ruled pattern behind paragraphs only. Match its interval with the text&apos;s
            line height and check alignment after wrapping or resizing text.
          </li>
          <li>
            Keep forms, controls, tables, and code blocks on plain, opaque backgrounds. Use Notebook
            as a decorative backdrop, not behind text. Do not layer different patterns over one
            another.
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
