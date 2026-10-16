"use client";

import { cn } from "cn";
import { useId, useState, type CSSProperties } from "react";

import { Button } from "@/registry/ninaero/ui/button";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/ninaero/ui/code-block";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/registry/ninaero/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ninaero/ui/select";
import { Slider } from "@/registry/ninaero/ui/slider";

// Keep utility classes literal for Tailwind; vary their numeric input through a CSS variable.
const patterns = [
  {
    value: "ruled",
    label: "Ruled",
    utility: "ninaero-paper-ruled",
    previewClass: "ninaero-paper-ruled-(number:--workshop-pattern-step)",
    spacing: 24,
    description: "Spacing between horizontal rules.",
  },
  {
    value: "dotted",
    label: "Dotted",
    utility: "ninaero-paper-dotted",
    previewClass: "ninaero-paper-dotted-(number:--workshop-pattern-step)",
    spacing: 16,
    description: "Spacing between dots in both directions.",
  },
  {
    value: "grid",
    label: "Grid",
    utility: "ninaero-paper-grid",
    previewClass: "ninaero-paper-grid-(number:--workshop-pattern-step)",
    spacing: 24,
    description: "Width and height of each grid cell.",
  },
  {
    value: "notebook",
    label: "Notebook",
    utility: "ninaero-paper-notebook",
    previewClass: "ninaero-paper-notebook-(number:--workshop-pattern-step)",
    spacing: 6,
    description: "Fine-line spacing. Each square cell spans 20 intervals.",
  },
  {
    value: "dither",
    label: "Diamond dither",
    utility: "ninaero-dither",
    previewClass: "ninaero-dither-(number:--workshop-pattern-step)",
    spacing: 8,
    description: "Tile size of the transparent diamond mesh.",
  },
  {
    value: "checker",
    label: "Checker",
    utility: "ninaero-checker",
    previewClass: "ninaero-checker-(number:--workshop-pattern-step)",
    spacing: 12,
    description: "Width and height of each square. Alternating squares are transparent.",
  },
] as const;

const backgrounds = [
  { value: "paper", label: "Paper", className: "bg-(--paper-fill)" },
  { value: "page", label: "Page", className: "bg-background" },
  { value: "muted", label: "Muted", className: "bg-muted" },
  { value: "accent", label: "Accent", className: "bg-primary" },
  { value: "image", label: "Raster image", className: "bg-muted" },
] as const;

const inks = [
  { value: "default", label: "Theme default", className: "" },
  {
    value: "foreground",
    label: "Foreground (20%)",
    className: "ninaero-pattern-ink-foreground/20",
  },
  { value: "accent", label: "Accent (25%)", className: "ninaero-pattern-ink-primary/25" },
  { value: "slate", label: "Slate (40%)", className: "ninaero-pattern-ink-slate-500/40" },
  { value: "hex", label: "#5c7185 (35%)", className: "ninaero-pattern-ink-[#5c7185]/35" },
] as const;

const rasterSource = "https://images.pexels.com/photos/23883200/pexels-photo-23883200.jpeg";
const rasterImage = `${rasterSource}?auto=compress&cs=tinysrgb&w=1600`;
const rasterStyle = { backgroundImage: `url("${rasterImage}")` };

const patternItems = patterns.map(({ value, label }) => ({ value, label }));
const backgroundItems = backgrounds.map(({ value, label }) => ({ value, label }));
const inkItems = inks.map(({ value, label }) => ({ value, label }));
const initialPattern = patterns[3];

type Pattern = (typeof patterns)[number];
type Background = (typeof backgrounds)[number];
type Ink = (typeof inks)[number];

export function PatternPlayground() {
  const id = useId();
  const [pattern, setPattern] = useState<Pattern>(initialPattern);
  const [background, setBackground] = useState<Background>(backgrounds[0]);
  const [spacing, setSpacing] = useState<number>(initialPattern.spacing);
  const [ink, setInk] = useState<Ink>(inks[0]);
  const style: CSSProperties & { "--workshop-pattern-step": number } = {
    "--workshop-pattern-step": spacing,
    backgroundColor: "transparent",
  };
  const patternClass = cn(`${pattern.utility}-${spacing}`, ink.className);
  const code =
    background.value === "image"
      ? `<div aria-hidden="true" className="relative h-80 overflow-hidden rounded-lg bg-muted">
  <div
    className="absolute inset-0 bg-cover bg-center opacity-60 dark:opacity-40 forced-colors:hidden"
    style={{ backgroundImage: 'url("${rasterImage}")' }}
  />
  <div className="absolute inset-0 ${patternClass} bg-transparent" />
</div>`
      : `<div\n  aria-hidden="true"\n  className="h-80 ${patternClass} ${background.className}"\n/>`;

  return (
    <div className="flex flex-col gap-8">
      <FieldGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Field>
          <FieldLabel htmlFor={`${id}-pattern`}>Pattern</FieldLabel>
          <Select
            items={patternItems}
            value={pattern.value}
            onValueChange={(value) => {
              const next = patterns.find((option) => option.value === value);
              if (next) {
                setPattern(next);
                setSpacing(next.spacing);
              }
            }}
          >
            <SelectTrigger id={`${id}-pattern`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {patterns.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-ink`}>Ink color</FieldLabel>
          <Select
            items={inkItems}
            value={ink.value}
            onValueChange={(value) => {
              const next = inks.find((option) => option.value === value);
              if (next) setInk(next);
            }}
          >
            <SelectTrigger id={`${id}-ink`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {inks.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-fill`}>Background fill</FieldLabel>
          <Select
            items={backgroundItems}
            value={background.value}
            onValueChange={(value) => {
              const next = backgrounds.find((option) => option.value === value);
              if (next) setBackground(next);
            }}
          >
            <SelectTrigger
              id={`${id}-fill`}
              className="w-full"
              aria-describedby={
                background.value === "image" ? `${id}-image-description` : undefined
              }
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {backgrounds.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {background.value === "image" ? (
            <FieldDescription id={`${id}-image-description`}>
              Muted version of the <a href={rasterSource}>source photo</a>.
            </FieldDescription>
          ) : null}
        </Field>
        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel id={`${id}-spacing-label`}>Spacing</FieldLabel>
            <output className="text-sm tabular-nums">{spacing}px</output>
          </div>
          <Slider
            className="min-h-9"
            min={1}
            max={48}
            step={0.5}
            value={[spacing]}
            onValueChange={(next) => setSpacing(Array.isArray(next) ? next[0] : next)}
            aria-labelledby={`${id}-spacing-label`}
            aria-describedby={`${id}-spacing-description`}
          />
          <FieldDescription id={`${id}-spacing-description`}>
            {pattern.description}
          </FieldDescription>
        </Field>
      </FieldGroup>
      <figure className="flex flex-col gap-3">
        <figcaption className="flex items-center justify-between gap-4">
          <span className="type-title">Preview</span>
          <Button variant="outline" size="sm" onClick={() => setSpacing(pattern.spacing)}>
            Reset spacing
          </Button>
        </figcaption>
        <div
          aria-hidden="true"
          className={`relative h-80 overflow-hidden rounded-lg border ${background.className}`}
        >
          {background.value === "image" ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 dark:opacity-40 forced-colors:hidden"
              style={rasterStyle}
            />
          ) : null}
          <div
            className={cn("absolute inset-0", pattern.previewClass, ink.className)}
            style={style}
          />
        </div>
      </figure>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>Current pattern</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{code}</CodeBlockContent>
      </CodeBlock>
      <p className="text-sm type-prose text-muted-foreground">
        Keep textures in decorative regions. Ruled prose needs a matching line height; forms,
        tables, and controls need a plain fill. Decorative textures disappear in forced-colors mode.
      </p>
    </div>
  );
}
