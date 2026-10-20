"use client";

import { useId, useState } from "react";

import { Button } from "@/registry/ninaero/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ninaero/ui/card";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import { Field, FieldLabel } from "@/registry/ninaero/ui/field";
import { Input } from "@/registry/ninaero/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";
import { Switch } from "@/registry/ninaero/ui/switch";

const coverDrawing = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#9dd9ee"/><stop offset="1" stop-color="#c9e094"/></linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>',
)}`;
// Keep utility classes literal for Tailwind. Paper patterns paint --paper-fill, so clear it to
// let the image show through; every pattern then reads as a transparent overlay.
const overlayPatterns = [
  { value: "ruled", label: "Ruled stripes", className: "ninaero-paper-ruled-6" },
  { value: "dotted", label: "Dotted", className: "ninaero-paper-dotted-8" },
  { value: "grid", label: "Grid", className: "ninaero-paper-grid-16" },
  { value: "notebook", label: "Notebook", className: "ninaero-paper-notebook-4" },
  { value: "dither", label: "Diamond dither", className: "ninaero-dither-6" },
  { value: "checker", label: "Checker", className: "ninaero-checker-8" },
  { value: "checker-wide", label: "Wide checker", className: "ninaero-checker-wide-6" },
  // The header overlay's textures, as ordinary patterns.
  { value: "fine-checker", label: "Fine checker", className: "ninaero-checker-2" },
  { value: "ordered-dots", label: "Ordered dots", className: "ninaero-ordered-dots" },
  { value: "diagonal-lines", label: "Diagonal lines", className: "ninaero-diagonal-lines" },
  { value: "flipnote", label: "Flipnote dither", className: "ninaero-flipnote" },
] as const;

const overlayItems = overlayPatterns.map(({ value, label }) => ({ value, label }));

function PatternOverlayCard() {
  const id = useId();
  const [pattern, setPattern] = useState<(typeof overlayPatterns)[number]>(overlayPatterns[0]);
  return (
    <Card className="pt-0">
      <div className="relative overflow-hidden rounded-t-[calc(var(--radius-xl)-1px)]">
        {/* oxlint-disable-next-line next/no-img-element -- Demonstrates a pattern over a native image. */}
        <img
          src={coverDrawing}
          alt="Blue and green gradient standing in for a drawing"
          className="aspect-video w-full object-cover"
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${pattern.className} ninaero-pattern-ink-white/40 [--paper-fill:transparent]`}
        />
      </div>
      <CardHeader>
        <CardTitle>Pattern over an image</CardTitle>
        <CardDescription>
          The overlay covers only the image, never text or controls.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor={`${id}-overlay`}>Overlay pattern</FieldLabel>
          <Select
            items={overlayItems}
            value={pattern.value}
            onValueChange={(value) => {
              const next = overlayPatterns.find((option) => option.value === value);
              if (next) setPattern(next);
            }}
          >
            <SelectTrigger id={`${id}-overlay`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {overlayPatterns.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
    </Card>
  );
}
function NotebookCard({ size }: { size?: "default" | "sm" }) {
  return (
    <Card size={size}>
      <CardHeader>
        <CardTitle>Morning tidepool</CardTitle>
        <CardDescription>Sketchbook · edited 2 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Twelve pages of rock pools, anemones, and one very patient crab.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size={size === "sm" ? "sm" : "default"}>Open</Button>
        <Button size={size === "sm" ? "sm" : "default"} variant="secondary">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CardSpecimens() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg type-heading">Sizes on paper</h2>
        <div className="button-specimen ninaero-surface-paper grid gap-6 bg-(--paper-fill) p-6 md:grid-cols-2">
          <NotebookCard />
          <NotebookCard size="sm" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg type-heading">Header action and form content</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sharing</CardTitle>
              <CardDescription>Choose who can open this notebook.</CardDescription>
              <CardAction>
                <Button size="sm" variant="outline">
                  Copy link
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="card-invite">Invite by email</FieldLabel>
                <Input id="card-invite" type="email" placeholder="name@example.com" />
              </Field>
              <Field orientation="horizontal">
                <Switch id="card-public" />
                <FieldLabel htmlFor="card-public">Anyone with the link can view</FieldLabel>
              </Field>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button>Send invite</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Content only</CardTitle>
              <CardDescription>
                A card without a footer keeps its full bottom inset.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Long text wraps inside the panel without clipping, including unbroken strings like
                tidepool-anemone-crab-notebook-archive-2026.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg type-heading">Full-bleed image</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            {/* oxlint-disable-next-line next/no-img-element -- Demonstrates Card's native first-child image rounding. */}
            <img
              src={coverDrawing}
              alt="Blue and green gradient standing in for a drawing"
              className="aspect-video w-full object-cover"
            />
            <CardHeader>
              <CardTitle>Cover drawing</CardTitle>
              <CardDescription>The image meets the card edge.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Corners stay rounded where the image meets the frame.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg type-heading">Allowed patterns</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ruled prose</CardTitle>
              <CardDescription>Rules follow the paragraph's line height.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="ninaero-paper-ruled ninaero-pattern-ink-foreground/10 rounded-lg border px-4 py-(--ninaero-paper-step) text-base leading-(--ninaero-paper-step) [--paper-fill:var(--card)]">
                The tide went out before breakfast and left a row of shallow pools along the rocks.
                Each one held something different: a crab, three anemones, and a single bright
                shell.
              </p>
            </CardContent>
          </Card>
          <Card className="pt-0">
            <div
              aria-hidden="true"
              className="ninaero-paper-notebook-6 ninaero-pattern-ink-foreground/10 aspect-[3/1] rounded-t-[calc(var(--radius-xl)-1px)] [--paper-fill:var(--muted)]"
            />
            <CardHeader>
              <CardTitle>Decorative media area</CardTitle>
              <CardDescription>The pattern stays clear of text and controls.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary">Open notebook</Button>
            </CardFooter>
          </Card>
          <PatternOverlayCard />
        </div>
      </section>

      <DirectionProvider direction="rtl">
        <section dir="rtl" className="flex flex-col gap-4">
          <h2 className="text-lg type-heading">Right-to-left</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <NotebookCard />
          </div>
        </section>
      </DirectionProvider>
    </div>
  );
}
