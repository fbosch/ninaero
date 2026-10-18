import Link from "next/link";

import { HighlightedCode } from "@/components/docs/highlighted-code";
import { InstallCommand } from "@/components/docs/install-command";
import { HomeBackground } from "@/components/home-background";
import { docsRegistryUrl } from "@/lib/component-documentation";
import { ArrowRightIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import { registryCommand } from "@/scripts/lib/registry-command.mjs";

import styles from "@/components/home-background/home-background.module.css";

export default function Home() {
  const installCommands = ["npm", "pnpm", "yarn", "bun"].map((packageManager) => {
    const code = registryCommand("init", "ninaero", docsRegistryUrl, packageManager);
    return { packageManager, code, content: <HighlightedCode code={code} language="bash" /> };
  });
  return (
    <main
      id="main"
      className={`home-page relative isolate flex-1 bg-background ninaero-overlay-dither ${styles.scene}`}
    >
      <div
        aria-hidden="true"
        className="home-paper ninaero-paper-dotted mix-blend-multiply dark:mix-blend-screen ninaero-pattern-ink-foreground/12 dark:ninaero-pattern-ink-foreground/8"
      />
      <div className="home-content mx-auto flex w-full max-w-6xl flex-col gap-12 px-[20px] py-8 sm:px-[32px] lg:pt-[clamp(4rem,18vh,11rem)] lg:pb-28">
        <section className="home-hero relative flex flex-col gap-8 sm:gap-12 lg:ml-0 lg:mr-auto lg:w-full lg:max-w-4xl">
          <header className="flex min-w-0 max-w-4xl flex-col gap-4">
            <h1 className="text-balance text-5xl type-display sm:text-6xl">
              <span className="ninaero-display-ink block">An optimistic & nostalgic theme</span>{" "}
              <span className="home-tagline block">for a comfy modern web</span>
            </h1>
            <p className={`max-w-xl text-lg ${styles.description}`}>
              A shadcn/ui theme and component registry.
            </p>
          </header>
          <section aria-labelledby="install-heading" className="flex max-w-3xl flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 id="install-heading" className="text-sm type-title tracking-normal">
                Install Ninaero
              </h2>
              <p className={`text-sm ${styles.description}`}>
                Start a new project with the complete preset.
              </p>
            </div>
            <InstallCommand commands={installCommands} />
            <Button
              size="xl"
              className="min-w-40 self-start"
              nativeButton={false}
              render={<Link href="/docs#docs-quick-start" />}
            >
              Get started <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </section>
        </section>
        <p className={`squircle-support-note text-xs ${styles.description}`}>
          This browser does not support CSS squircle corners. Buttons use ordinary rounded corners
          here.
        </p>
      </div>
      <HomeBackground />
    </main>
  );
}
