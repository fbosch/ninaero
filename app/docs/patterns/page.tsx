import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/docs/code-block";
import { patternGuidance } from "@/lib/pattern-guidance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ninaero/ui/card";

export const metadata: Metadata = {
  title: "Patterns | Ninaero",
  description:
    "Configurable paper patterns, checkerboards, diamond dithering, and optional site-wide overlays.",
};

const backgroundPatterns = [
  {
    title: "Ruled",
    guidance: patternGuidance.ruled,
    note: "Match line height, padding, and paragraph gaps to the rule interval.",
    defaultSpacing: "24px",
    samples: [
      { className: "ninaero-paper-ruled-16", spacing: "16px" },
      { className: "ninaero-paper-ruled-24", spacing: "24px" },
      { className: "ninaero-paper-ruled-32", spacing: "32px" },
    ],
    example: `<p className="ninaero-paper-ruled-24 ninaero-pattern-ink-foreground/10 bg-background p-[24px] text-base leading-[24px]">
	A journal entry aligned to 24px rules.
</p>`,
  },
  {
    title: "Dotted",
    guidance: patternGuidance.dotted,
    note: "Dots do not provide snapping. Keep them aligned with your canvas coordinates.",
    defaultSpacing: "16px",
    samples: [
      { className: "ninaero-paper-dotted-8", spacing: "8px" },
      { className: "ninaero-paper-dotted-16", spacing: "16px" },
      { className: "ninaero-paper-dotted-24", spacing: "24px" },
    ],
    example: `<div className="h-64 ninaero-paper-dotted-16 bg-background">
	{/* Your drawing layer goes here. */}
</div>`,
  },
  {
    title: "Grid",
    guidance: patternGuidance.grid,
    note: "Keep the grid aligned with pan, zoom, and snapping.",
    defaultSpacing: "24px",
    samples: [
      { className: "ninaero-paper-grid-12", spacing: "12px" },
      { className: "ninaero-paper-grid-24", spacing: "24px" },
      { className: "ninaero-paper-grid-40", spacing: "40px" },
    ],
    example: `<div className="h-64 ninaero-paper-grid-24 bg-background">
	{/* Your diagram goes here. */}
</div>`,
  },
  {
    title: "Notebook",
    guidance: patternGuidance.notebook,
    note: "Decorative only. Keep text and controls on opaque backgrounds.",
    defaultSpacing: "6px",
    samples: [
      { className: "ninaero-paper-notebook-4", spacing: "4px" },
      { className: "ninaero-paper-notebook-6", spacing: "6px" },
      { className: "ninaero-paper-notebook-8", spacing: "8px" },
    ],
    example: `<header className="relative overflow-hidden rounded-lg bg-muted p-6">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 ninaero-paper-notebook-6 ninaero-pattern-ink-foreground/10 bg-transparent"
  />
  <h2 className="relative inline-block rounded-md bg-background px-3 py-2 font-medium">
    Learning journal
  </h2>
</header>`,
  },
  {
    title: "Checker",
    guidance: patternGuidance.checker,
    note: "Place checks behind media. Opaque pixels hide the checks.",
    defaultSpacing: "12px squares",
    samples: [
      { className: "ninaero-checker-8", spacing: "8px squares" },
      { className: "ninaero-checker-12", spacing: "12px squares" },
      { className: "ninaero-checker-24", spacing: "24px squares" },
    ],
    example: `function AssetPreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-64 rounded-lg ninaero-checker-8 ninaero-pattern-ink-foreground/15 bg-muted p-6">
      <img src={src} alt={alt} className="h-full w-full object-contain" />
    </div>
  );
}`,
  },
  {
    title: "Wide checker",
    guidance: patternGuidance["checker-wide"],
    note: "Use as decoration, not a layout grid or state indicator.",
    defaultSpacing: "24 × 12px checks",
    samples: [
      { className: "ninaero-checker-wide-8", spacing: "16 × 8px checks" },
      { className: "ninaero-checker-wide-12", spacing: "24 × 12px checks" },
      { className: "ninaero-checker-wide-24", spacing: "48 × 24px checks" },
    ],
    example:
      '<div aria-hidden="true" className="h-20 rounded-lg ninaero-checker-wide-12 ninaero-pattern-ink-foreground/12 bg-muted" />',
  },
];

const ditherSamples = [
  { className: "ninaero-dither-4", spacing: "4px" },
  { className: "ninaero-dither-8", spacing: "8px" },
  { className: "ninaero-dither-12", spacing: "12px" },
];

const colorSamples = [
  {
    label: "Semantic accent",
    className: "ninaero-paper-notebook-6 ninaero-pattern-ink-primary/25",
  },
  {
    label: "Palette color",
    className: "ninaero-paper-grid-16 ninaero-pattern-ink-slate-500/30",
  },
  {
    label: "Arbitrary color",
    className: "ninaero-dither-8 ninaero-pattern-ink-[#5c7185]/35",
  },
];

const responsiveExample =
  '<div aria-hidden="true" className="ninaero-paper-grid-12 h-40 md:ninaero-paper-grid-32" />';

export default function PatternsPage() {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium text-muted-foreground">Theme documentation</p>
        <h1 className="text-4xl type-display">Patterns</h1>
        <p className="max-w-2xl type-prose text-muted-foreground">
          Use paper patterns on individual elements, or add a{" "}
          <Link href="#site-wide-overlays" className="text-foreground underline underline-offset-4">
            site-wide overlay
          </Link>{" "}
          across the viewport.
        </p>
      </header>

      <section aria-labelledby="pattern-sizing-heading" className="flex flex-col gap-4">
        <h2 id="pattern-sizing-heading" className="text-xl type-heading">
          Set the interval
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          For element-level patterns, numeric suffixes set CSS pixels, not Tailwind spacing steps.
          For example, <code className="text-foreground">ninaero-paper-grid-8</code> draws an 8px
          grid without a separate base class. Decimals such as 12.5 work, with a 1px minimum. Omit
          the suffix for the defaults below. Dot sizes and stroke widths stay fixed.
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm type-prose text-muted-foreground">
          <li>
            Notebook: 20 fine-line intervals per square cell. The 6px default gives 120px cells.
          </li>
          <li>Checker: the suffix sets the square size.</li>
          <li>Wide checker: the suffix sets height. Width is twice the height.</li>
        </ul>
      </section>

      <section aria-labelledby="paper-patterns-heading" className="flex flex-col gap-4">
        <h2 id="paper-patterns-heading" className="text-xl type-heading">
          Patterns
        </h2>
        <div className="flex flex-col gap-6">
          {backgroundPatterns.map((pattern) => (
            <Card key={pattern.title} size="sm">
              <CardHeader>
                <CardTitle>{pattern.title}</CardTitle>
                <CardDescription>{pattern.guidance.suggestedUse}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">Default: {pattern.defaultSpacing}.</p>
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
                <p className="text-sm type-prose text-muted-foreground">{pattern.note}</p>
                <CodeBlock
                  code={pattern.example}
                  label={`${pattern.title} usage recipe`}
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
          Tailwind variants work on sizing and ink classes. Keep class names complete so Tailwind
          can detect them.
        </p>
        <div
          aria-hidden="true"
          className="ninaero-paper-grid-12 h-40 rounded-md border md:ninaero-paper-grid-32"
        />
        <CodeBlock code={responsiveExample} label="Responsive grid interval" language="tsx" />
      </section>

      <section aria-labelledby="pattern-colors-heading" className="flex flex-col gap-4">
        <h2 id="pattern-colors-heading" className="text-xl type-heading">
          Set the ink color
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          For element-level patterns, <code className="text-foreground">ninaero-pattern-ink-*</code>{" "}
          accepts semantic, palette, and arbitrary colors. Add{" "}
          <code className="text-foreground">/25</code> for 25% opacity. Ink affects only pattern
          marks. Set the fill with <code className="text-foreground">bg-*</code>.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {colorSamples.map((sample) => (
            <figure key={sample.className} className="flex min-w-0 flex-col gap-2">
              <div
                aria-hidden="true"
                className={`h-48 rounded-md border bg-muted ${sample.className}`}
              />
              <figcaption className="flex flex-col gap-1 text-sm">
                <span>{sample.label}</span>
                <code className="text-xs break-all text-muted-foreground">{sample.className}</code>
              </figcaption>
            </figure>
          ))}
        </div>
        <CodeBlock
          code={
            '<div aria-hidden="true" className="ninaero-paper-notebook-6 ninaero-pattern-ink-primary/25 h-48 bg-muted" />'
          }
          label="Notebook with translucent accent ink"
          language="tsx"
        />
        <p className="text-sm type-prose text-muted-foreground">
          Without an ink class, defaults stay neutral in both modes. Notebook and dither reserve{" "}
          <code className="text-foreground">::before</code> for the texture.
        </p>
      </section>

      <section aria-labelledby="dither-heading" className="flex flex-col gap-4">
        <h2 id="dither-heading" className="text-xl type-heading">
          Diamond dither overlay
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          {patternGuidance.dither.suggestedUse}
        </p>
        <p className="text-sm type-prose text-muted-foreground">
          The transparent texture defaults to an 8px tile.
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
          code={`<div aria-hidden="true" className="relative h-48 overflow-hidden rounded-lg bg-muted">
  <div className="absolute inset-x-0 bottom-0 h-1/2 ninaero-dither-8 ninaero-pattern-ink-foreground/20" />
</div>`}
          label="Dither shading"
          language="tsx"
        />
        <p className="text-sm type-prose text-muted-foreground">
          A static texture, not an image filter.
        </p>
      </section>

      <section aria-labelledby="site-wide-overlays" className="flex flex-col gap-4">
        <h2 id="site-wide-overlays" className="text-xl type-heading">
          Site-wide overlays
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          Overlays are off by default in installed themes and on this site. Use the Overlay menu in
          the header to preview each texture or choose Off. The demo retains your choice across
          navigation and resets to Off on reload.
        </p>
        <p className="text-sm type-prose text-muted-foreground">
          Add the base class to body in your root layout. It paints a static texture across the
          viewport, including menus and dialogs.
        </p>
        <CodeBlock
          code={'<body className="ninaero-overlay-dither">\n  {children}\n</body>'}
          label="Checker overlay"
          language="tsx"
        />
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm type-prose text-muted-foreground">
          <li>
            <code className="text-foreground">ninaero-overlay-dither</code> enables Checker with a
            2px tile.
          </li>
          <li>
            Add <code className="text-foreground">ninaero-overlay-dots</code> for Ordered dots on a
            4px tile.
          </li>
          <li>
            Add <code className="text-foreground">ninaero-overlay-lines</code> for Diagonal lines on
            a 4px tile.
          </li>
        </ul>
        <p className="text-sm type-prose text-muted-foreground">
          Both modifiers need the base class. Overlay ink follows the neutral foreground at 4%
          opacity, with <code className="text-foreground">multiply</code> blending in light mode and{" "}
          <code className="text-foreground">screen</code> blending in dark mode.
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm type-prose text-muted-foreground">
          <li>
            <code className="text-foreground">--ninaero-overlay-opacity</code> sets opacity from 0
            to 1. The default is 0.04.
          </li>
          <li>
            <code className="text-foreground">--ninaero-overlay-size</code> sets the tile width and
            height with a CSS length.
          </li>
          <li>
            Set <code className="text-foreground">--ninaero-overlay-blend-mode</code> to{" "}
            <code className="text-foreground">normal</code> to compare without color blending.
          </li>
        </ul>
        <CodeBlock
          code={
            '<body className="ninaero-overlay-dither [--ninaero-overlay-opacity:0.02] [--ninaero-overlay-size:4px] [--ninaero-overlay-blend-mode:normal]">\n  {children}\n</body>'
          }
          label="Overlay tuning"
          language="tsx"
        />
        <p className="text-sm type-prose text-muted-foreground">
          Keep overlays faint and check text, focus rings, disabled controls, and error states after
          tuning them. These are static textures, not image filters.
        </p>
        <p className="text-sm type-prose text-muted-foreground">
          The layer ignores pointer input and adds no keyboard stops. It reserves{" "}
          <code className="text-foreground">body::after</code>, so keep that pseudo-element free and
          avoid transforms on body. Print and forced-colors mode hide the overlay. Remove the base
          class to disable it.
        </p>
      </section>

      <section aria-labelledby="paper-guidance-heading" className="flex flex-col gap-4">
        <h2 id="paper-guidance-heading" className="text-xl type-heading">
          Readability and accessibility
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm type-prose text-muted-foreground">
          <li>
            For element-level patterns, use one pattern per region. Keep dense content and controls
            on opaque backgrounds.
          </li>
          <li>
            Apply <code className="text-foreground">aria-hidden</code> only to decorative layers,
            not containers with meaningful content.
          </li>
          <li>Forced-colors mode removes textures. Content must remain clear without them.</li>
        </ul>
      </section>
    </article>
  );
}
