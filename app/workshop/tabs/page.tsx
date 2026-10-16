import type { Metadata } from "next";

import { Button } from "@/registry/ninaero/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ninaero/ui/tabs";
export const metadata: Metadata = { title: "Tabs workshop | Ninaero" };
function TabSpecimen({
  variant = "default",
  orientation = "horizontal",
  label,
}: {
  variant?: "default" | "line";
  orientation?: "horizontal" | "vertical";
  label: string;
}) {
  return (
    <Tabs defaultValue="profile" orientation={orientation}>
      <TabsList variant={variant} aria-label={label}>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security" disabled>
          Security
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="p-3">
        Profile panel
      </TabsContent>
      <TabsContent value="notifications" className="p-3">
        Notification panel
      </TabsContent>
      <TabsContent value="security" className="p-3">
        Security panel
      </TabsContent>
    </Tabs>
  );
}

export default function TabsWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Tabs</h1>
        <p className="text-muted-foreground">Compare tab selection with the primary action.</p>
        <p className="text-sm text-muted-foreground">
          Use arrow keys to move focus and Enter or Space to select a tab. Security is unavailable.
        </p>
      </header>
      <section aria-labelledby="segmented-tabs" className="flex flex-col gap-3">
        <h2 id="segmented-tabs" className="text-xl type-heading">
          Segmented
        </h2>
        <div className="ninaero-surface-paper flex flex-col items-start gap-6 rounded-xl border bg-card p-6">
          <TabSpecimen label="Segmented sections" />
          <Button>Primary action</Button>
        </div>
      </section>
      <section aria-labelledby="line-tabs" className="flex flex-col gap-3">
        <h2 id="line-tabs" className="text-xl type-heading">
          Underline
        </h2>
        <div className="rounded-xl border bg-card p-6">
          <TabSpecimen variant="line" label="Underlined sections" />
        </div>
      </section>
      <section aria-labelledby="vertical-tabs" className="flex flex-col gap-3">
        <h2 id="vertical-tabs" className="text-xl type-heading">
          Vertical
        </h2>
        <div className="grid gap-8 rounded-xl border bg-card p-6 md:grid-cols-2">
          <TabSpecimen orientation="vertical" label="Vertical segmented sections" />
          <TabSpecimen variant="line" orientation="vertical" label="Vertical underlined sections" />
        </div>
      </section>
    </div>
  );
}
