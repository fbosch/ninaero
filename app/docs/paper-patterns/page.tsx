import type { Metadata } from "next";

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
  title: "Background details | Ninaero",
  description:
    "Configurable paper patterns, checkerboards, and diamond dithering with Tailwind spacing and ink colors.",
};

const backgroundPatterns = [
  {
    title: "Ruled",
    guidance: patternGuidance.ruled,
    placement:
      "Apply the pattern to rendered prose. Keep line height and padding aligned to the rules.",
    defaultSpacing: "24px",
    samples: [
      { className: "ninaero-paper-ruled-16", spacing: "16px" },
      { className: "ninaero-paper-ruled-24", spacing: "24px" },
      { className: "ninaero-paper-ruled-32", spacing: "32px" },
    ],
    example: `<p className="ninaero-paper-ruled-24 ninaero-pattern-ink-foreground/10 bg-background p-[24px] text-base leading-[24px]">
  A journal entry with a fixed 24px line height.
  Wrapped lines stay aligned with the ruling.
</p>`,
  },
  {
    title: "Dotted",
    guidance: patternGuidance.dotted,
    placement: "Place a decorative layer behind your whiteboard or sketchpad content.",
    defaultSpacing: "16px",
    samples: [
      { className: "ninaero-paper-dotted-8", spacing: "8px" },
      { className: "ninaero-paper-dotted-16", spacing: "16px" },
      { className: "ninaero-paper-dotted-24", spacing: "24px" },
    ],
    example: `import type { ReactNode } from "react";

function SketchSurface({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-64 overflow-hidden rounded-lg bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ninaero-paper-dotted-16 ninaero-pattern-ink-foreground/12 bg-transparent"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}`,
  },
  {
    title: "Grid",
    guidance: patternGuidance.grid,
    placement: "Use as a backdrop behind the drawing layer or opaque diagram nodes.",
    defaultSpacing: "24px",
    samples: [
      { className: "ninaero-paper-grid-12", spacing: "12px" },
      { className: "ninaero-paper-grid-24", spacing: "24px" },
      { className: "ninaero-paper-grid-40", spacing: "40px" },
    ],
    example: `import type { ReactNode } from "react";

function DiagramSurface({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-64 overflow-hidden rounded-lg bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ninaero-paper-grid-24 ninaero-pattern-ink-foreground/8 bg-transparent"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}`,
  },
  {
    title: "Notebook",
    guidance: patternGuidance.notebook,
    placement: "Use behind cover artwork, with any title on a separate opaque background.",
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
    placement:
      "Apply to the preview container so transparent image pixels reveal the checks beneath.",
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
    placement: "Use in a decorative band beside or above content, not behind reading text.",
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

export default function BackgroundDetailsPage() {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium text-muted-foreground">Theme documentation</p>
        <h1 className="text-4xl type-display">Background details</h1>
        <p className="max-w-2xl type-prose text-muted-foreground">
          Ninaero includes seven opt-in textures for page backgrounds and preview areas. Use one
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
        <p className="text-sm type-prose text-muted-foreground">
          Checker sizes set the width and height of one square. The default is 12px, giving a 24px
          repeating tile with two ink squares and two transparent squares. Use a background utility
          to set the fill beneath the checks.
        </p>
        <p className="text-sm type-prose text-muted-foreground">
          Wide checker keeps a 2:1 width-to-height ratio. Its suffix sets the height:{" "}
          <code className="text-foreground">ninaero-checker-wide-12</code> draws 24 × 12px checks,
          with a 48 × 24px repeating tile.
        </p>
      </section>

      <section aria-labelledby="paper-patterns-heading" className="flex flex-col gap-4">
        <h2 id="paper-patterns-heading" className="text-xl type-heading">
          Usage recipes and sizes
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          Start with an optional recipe for your application, then adjust the size, ink opacity, and
          fill. These examples provide visual backgrounds, not editor or layout behavior.
        </p>
        <div className="flex flex-col gap-6">
          {backgroundPatterns.map((pattern) => (
            <Card key={pattern.title} size="sm">
              <CardHeader>
                <CardTitle>{pattern.title}</CardTitle>
                <CardDescription>{pattern.guidance.suggestedUse}</CardDescription>
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
                <p className="text-sm type-prose text-muted-foreground">{pattern.placement}</p>
                <CodeBlock
                  code={pattern.example}
                  label={`${pattern.title} usage recipe`}
                  language="tsx"
                />
                <p className="text-sm type-prose text-muted-foreground">
                  {pattern.guidance.caution}
                </p>
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

      <section aria-labelledby="pattern-colors-heading" className="flex flex-col gap-4">
        <h2 id="pattern-colors-heading" className="text-xl type-heading">
          Set the ink color
        </h2>
        <p className="text-sm type-prose text-muted-foreground">
          Combine any pattern with <code className="text-foreground">ninaero-pattern-ink-*</code>.
          Use semantic colors such as primary, Tailwind palette colors such as slate-500, or an
          arbitrary color in brackets. Add an opacity modifier such as /25 for 25% ink. Responsive
          and dark variants work too. Set the fill separately with bg-* utilities.
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
          Omitting the ink class keeps the neutral light and dark defaults. Notebook&apos;s fine
          rules remain lighter than its dividers. Ink classes do not change the fill or text color.
          Notebook and dither use the container&apos;s ::before pseudo-element for their SVG mask;
          leave it available for the texture.
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
          This SVG mesh has a transparent background and neutral default ink, so it keeps the
          surface&apos;s existing color. Use <code className="text-foreground">ninaero-dither</code>{" "}
          for an 8px tile, or add a numeric suffix to change the tile size. The examples below keep
          the same muted fill.
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
          label="Illustration shading with a localized dither layer"
          language="tsx"
        />
        <p className="text-sm type-prose text-muted-foreground">{patternGuidance.dither.caution}</p>
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
            Canvas patterns do not provide snapping or track pan and zoom. Keep their spacing and
            position synchronized with your application&apos;s drawing coordinates.
          </li>
          <li>
            Put transparency checks behind media, not over it. Use aria-hidden only on decorative
            layers, never on containers with meaningful text, images, or controls.
          </li>
          <li>
            Defaults stay grayscale across accent presets; ink classes opt into color. Forced-colors
            mode removes the textures, so content must remain clear without them.
          </li>
        </ul>
      </section>
    </article>
  );
}
