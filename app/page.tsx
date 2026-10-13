import Link from "next/link";
import { ButtonPreview } from "@/components/examples/button-preview";
import { DialogPreview } from "@/components/examples/dialog-preview";
import { ThemeSwitcher } from "@/components/theme-switcher";
import catalog from "@/registry/ninaero/catalog.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ninaero/ui/card";
import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";

const catalogComponents = catalog.items.filter(
  (item) => item.type === "registry:ui",
);

const swatches = [
  { name: "Background", className: "bg-background" },
  { name: "Card", className: "bg-card" },
  { name: "Popover", className: "bg-popover" },
  { name: "Primary", className: "bg-primary" },
  { name: "Secondary", className: "bg-secondary" },
  { name: "Muted", className: "bg-muted" },
  { name: "Accent", className: "bg-accent" },
  { name: "Destructive", className: "bg-destructive" },
];

export default function Home() {
  return (
    <main
      id="main"
      className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-10 sm:px-8"
    >
      <header className="flex flex-wrap items-start justify-between gap-6 border-b pb-8">
        <div className="max-w-xl space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Theme workshop
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Ninaero</h1>
          <p className="text-muted-foreground">
            Button is the first themed component. Compare its squircle corners
            and accent palettes alongside neutral paper and ink surfaces.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            className="text-sm underline underline-offset-4"
            href="/components"
          >
            Components
          </Link>
          <Link className="text-sm underline underline-offset-4" href="/docs">
            Docs
          </Link>
          <ThemeSwitcher />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card id="button-workshop" className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <h2>Buttons</h2>
            </CardTitle>
            <CardDescription>
              Squircle curves, shallow depth, and clear interaction states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonPreview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Inputs</h2>
            </CardTitle>
            <CardDescription>
              Editable, disabled, and invalid-state specimens.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="editable-input">Editable input</Label>
              <Input id="editable-input" placeholder="Try typing here" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled-input">Disabled input</Label>
              <Input id="disabled-input" disabled defaultValue="Unavailable" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invalid-input">Invalid input</Label>
              <Input
                id="invalid-input"
                aria-invalid="true"
                aria-describedby="invalid-hint"
                defaultValue="Invalid-state example"
              />
              <p id="invalid-hint" className="text-xs text-muted-foreground">
                This is a visual specimen, not live validation.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Dialog</h2>
            </CardTitle>
            <CardDescription>
              Inspect overlays, popup surfaces, and keyboard focus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DialogPreview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Registry</h2>
            </CardTitle>
            <CardDescription>
              The shared theme and all {catalogComponents.length} components are
              installable through shadcn.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 text-sm">
            <a className="underline underline-offset-4" href="/r/ninaero.json">
              Registry preset
            </a>
            <a className="underline underline-offset-4" href="/r/theme.json">
              Theme tokens
            </a>
            <a className="underline underline-offset-4" href="/r/button.json">
              Button source
            </a>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="catalog-heading" className="space-y-4">
        <h2 id="catalog-heading" className="text-lg font-semibold">
          Component catalogue
        </h2>
        <p className="text-sm text-muted-foreground">
          {catalogComponents.length} installed components. These links open
          installable registry JSON, not interactive previews.
        </p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
          {catalogComponents.map((component) => (
            <li key={component.name}>
              <a
                className="text-sm underline underline-offset-4"
                href={`/r/${component.name}.json`}
              >
                {component.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tokens-heading" className="space-y-4">
        <h2 id="tokens-heading" className="text-lg font-semibold">
          Semantic tokens
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((swatch) => (
            <div key={swatch.name} className="space-y-2">
              <div className={`h-20 rounded-xl border ${swatch.className}`} />
              <p className="text-sm text-muted-foreground">{swatch.name}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Edit{" "}
          <code className="text-foreground">registry/ninaero/theme.mjs</code>,
          then run <code className="text-foreground">pnpm registry:build</code>{" "}
          to update the preview and registry.
        </p>
      </section>
    </main>
  );
}
