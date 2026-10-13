"use client";

import { type FormEvent, useId, useState } from "react";

import { Button } from "@/registry/ninaero/ui/button";
import { Input } from "@/registry/ninaero/ui/input";
import { Label } from "@/registry/ninaero/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ninaero/ui/popover";
import { Switch } from "@/registry/ninaero/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ninaero/ui/tabs";

import { initialSettings, type Settings, settingsMatch } from "./settings-state";

export function SettingsPreview() {
  const id = useId();
  const [draft, setDraft] = useState(initialSettings);
  const [saved, setSaved] = useState<Settings | null>(null);
  const isSaved = settingsMatch(draft, saved);

  function update<Key extends keyof Settings>(key: Key, value: Settings[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved({ ...draft });
  }

  return (
    <form
      aria-labelledby={`${id}-heading`}
      className="w-full max-w-lg space-y-6 rounded-xl border bg-card p-6 text-card-foreground"
      onSubmit={save}
      noValidate
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id={`${id}-heading`} className="text-lg font-semibold">
          Settings
        </h2>
        <Popover>
          <PopoverTrigger render={<Button type="button" variant="ghost" size="sm" />}>
            About
          </PopoverTrigger>
          <PopoverContent align="end">
            <PopoverTitle>Local preview</PopoverTitle>
            <PopoverDescription>
              Changes stay in this page. Reloading restores the sample values.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      </div>
      <Tabs defaultValue="profile" className="gap-5">
        <TabsList aria-label="Settings sections" variant="line">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4" keepMounted>
          <div className="space-y-2">
            <Label htmlFor={`${id}-name`}>Display name</Label>
            <Input
              id={`${id}-name`}
              name="displayName"
              autoComplete="off"
              value={draft.displayName}
              onChange={(event) => update("displayName", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="off"
              value={draft.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="min-h-36" keepMounted>
          <div className="flex items-center justify-between gap-6 py-2">
            <Label htmlFor={`${id}-updates`}>Release notes</Label>
            <Switch
              id={`${id}-updates`}
              name="updates"
              checked={draft.updates}
              onCheckedChange={(updates) => update("updates", updates)}
            />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex flex-wrap items-center gap-4 border-t pt-5">
        <Button type="submit" disabled={isSaved}>
          Save changes
        </Button>
        <output aria-live="polite" className="text-xs text-muted-foreground">
          {isSaved ? "Saved in this preview." : "Demo only. Reloading resets changes."}
        </output>
      </div>
    </form>
  );
}
