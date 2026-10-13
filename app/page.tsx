import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { CodeBlock } from "@/components/docs/code-block";
import { HeroAccentPicker } from "@/components/examples/hero-accent-picker";
import { SettingsPreview } from "@/components/examples/settings-preview";
import { presetInstallCommand } from "@/lib/component-documentation";
import { Button } from "@/registry/ninaero/ui/button";

export default function Home() {
  return (
    <main id="main" className="ninaero-paper-dotted bg-background min-h-[calc(100svh-4.5rem)]">
      <div className="mx-auto max-w-6xl space-y-12 px-5 py-8 sm:px-8 lg:py-12">
        <section className="home-hero relative isolate space-y-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            <header className="min-w-0 space-y-6">
              <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                An optimistic, nostalgic theme{" "}
                <span className="block text-muted-foreground">for modern web interfaces.</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" nativeButton={false} render={<Link href="/docs" />}>
                  Get started <ArrowRightIcon data-icon="inline-end" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/examples" />}
                >
                  View examples
                </Button>
              </div>
              <HeroAccentPicker />
            </header>
            <section aria-label="Settings example" className="home-preview-shell min-w-0">
              <div className="flex items-center justify-end px-5 py-3 text-xs text-muted-foreground">
                <Link
                  href="/examples/settings"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Open example <ArrowRightIcon className="size-3" aria-hidden="true" />
                </Link>
              </div>
              <div className="p-4 sm:p-5">
                <SettingsPreview />
              </div>
            </section>
          </div>
          <div className="grid items-center gap-5 pt-6 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
            <div className="space-y-1">
              <h2 className="text-sm font-medium">Install Ninaero</h2>
            </div>
            <CodeBlock code={presetInstallCommand} language="bash" label="Complete preset" />
          </div>
        </section>
        <p className="squircle-support-note text-xs text-muted-foreground">
          This browser does not support CSS squircle corners. Buttons use ordinary rounded corners
          here.
        </p>
      </div>
    </main>
  );
}
