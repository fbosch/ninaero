"use client";

import { type ReactNode, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/registry/ninaero/ui/toggle-group";

import { CodeBlockHeader } from "./code-block-header";

type InstallCommandOption = {
  packageManager: string;
  code: string;
  content: ReactNode;
};

export function InstallCommand({ commands }: { commands: InstallCommandOption[] }) {
  const [packageManager, setPackageManager] = useState("npm");
  const command = commands.find((option) => option.packageManager === packageManager);
  if (!command) throw new Error(`Missing install command for ${packageManager}.`);

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border bg-card">
      <CodeBlockHeader code={command.code} label={`${packageManager} install command`}>
        <ToggleGroup
          aria-label="Package manager"
          value={[packageManager]}
          onValueChange={(value) => {
            if (value.length > 0) setPackageManager(value[0]);
          }}
          size="sm"
          spacing={1}
        >
          {commands.map((option) => (
            <ToggleGroupItem
              key={option.packageManager}
              value={option.packageManager}
              className="px-1.5 sm:px-2.5"
            >
              {option.packageManager}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CodeBlockHeader>
      {command.content}
    </div>
  );
}
