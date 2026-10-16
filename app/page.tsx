import Link from "next/link";

import { CodeBlock } from "@/components/docs/code-block";
import { HomeBackground } from "@/components/home-background";
import { presetInstallCommand } from "@/lib/component-documentation";
import { ArrowRightIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";

export default function Home() {
  return (
    <main
      id="main"
      className="home-page relative isolate bg-background min-h-[calc(100svh-4.5rem)]"
    >
      <div
        aria-hidden="true"
        className="home-paper ninaero-paper-dotted ninaero-pattern-ink-foreground/20 dark:ninaero-pattern-ink-foreground/8"
      />
      <div className="mx-auto max-w-6xl space-y-12 px-5 py-8 sm:px-8 lg:py-12">
        <section className="home-hero relative space-y-8">
          <div className="max-w-4xl">
            <header className="min-w-0 space-y-6">
              <h1 className="text-balance text-5xl type-display sm:text-6xl">
                <span className="ninaero-display-ink block">An optimistic & nostalgic theme</span>{" "}
                <span className="home-tagline block">for a comfier world wide web.</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="xl"
                  className="min-w-40"
                  nativeButton={false}
                  render={<Link href="/docs" />}
                >
                  Get started <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            </header>
          </div>
          <section aria-labelledby="install-heading" className="flex max-w-3xl flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="install-heading" className="text-sm type-title tracking-normal">
                Install Ninaero
              </h2>
              <p className="text-sm text-muted-foreground">
                Add the theme and components to your project.
              </p>
            </div>
            <CodeBlock code={presetInstallCommand} language="bash" label="Complete preset" />
            <Button
              variant="link"
              size="sm"
              className="self-start"
              nativeButton={false}
              render={<Link href="/docs#docs-quick-start" />}
            >
              Installation guide <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </section>
        </section>
        <p className="squircle-support-note text-xs text-muted-foreground">
          This browser does not support CSS squircle corners. Buttons use ordinary rounded corners
          here.
        </p>
      </div>
      <HomeBackground />
    </main>
  );
}
