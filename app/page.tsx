import Link from "next/link";

import { CodeBlock } from "@/components/docs/code-block";
import { HeroAccentPicker } from "@/components/examples/hero-accent-picker";
import { presetInstallCommand } from "@/lib/component-documentation";
import { ArrowRightIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";

export default function Home() {
  return (
    <main id="main" className="ninaero-paper-dotted bg-background min-h-[calc(100svh-4.5rem)]">
      <div className="mx-auto max-w-6xl space-y-12 px-5 py-8 sm:px-8 lg:py-12">
        <section className="home-hero relative isolate space-y-8">
          <div className="max-w-3xl">
            <header className="min-w-0 space-y-6">
              <h1 className="text-balance text-5xl type-display sm:text-6xl">
                An optimistic, nostalgic theme{" "}
                <span className="block text-muted-foreground">for a friendlier web.</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" nativeButton={false} render={<Link href="/docs" />}>
                  Get started <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
              <HeroAccentPicker />
            </header>
          </div>
          <div className="grid items-center gap-5 pt-6 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
            <div className="space-y-1">
              <h2 className="text-sm type-title tracking-normal">Install Ninaero</h2>
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
