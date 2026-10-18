"use client";

import { type ReactNode, useState } from "react";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockHeader,
} from "@/registry/ninaero/ui/code-block";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ninaero/ui/toggle-group";

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
    <CodeBlock>
      <CodeBlockHeader className="flex-wrap">
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
        <CodeBlockActions>
          <CodeBlockCopyButton key={command.code} value={command.code} size="icon-sm" />
        </CodeBlockActions>
      </CodeBlockHeader>
      {command.content}
    </CodeBlock>
  );
}
