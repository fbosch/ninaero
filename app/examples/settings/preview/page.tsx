import type { Metadata } from "next";

import { SettingsPreview } from "@/components/examples/settings-preview";

export const metadata: Metadata = { title: "Settings preview | Ninaero" };

export default function SettingsPreviewPage() {
  return (
    <main id="main" className="flex justify-center px-5 py-12 sm:px-8">
      <SettingsPreview />
    </main>
  );
}
