import Link from "next/link";

import { SettingsPreview } from "@/components/examples/settings-preview";

export default function Home() {
  return (
    <main
      id="main"
      className="mx-auto grid max-w-5xl items-start gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2"
    >
      <header className="space-y-6 lg:py-8">
        <h1 className="text-4xl font-semibold tracking-tight">Ninaero</h1>
        <p className="max-w-sm text-lg text-muted-foreground">
          Paper-led components for shadcn/ui.
        </p>
        <div className="flex flex-wrap gap-5 text-sm">
          <Link href="/examples" className="underline underline-offset-4">
            View examples
          </Link>
          <Link href="/docs" className="text-muted-foreground hover:text-foreground">
            Get started
          </Link>
        </div>
      </header>
      <section aria-label="Settings example" className="space-y-4">
        <SettingsPreview />
        <Link
          href="/examples/settings"
          className="inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          Open example
        </Link>
      </section>
    </main>
  );
}
