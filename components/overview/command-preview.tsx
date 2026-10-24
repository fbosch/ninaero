import { useState } from "react";

import type { PreviewProps } from "@/lib/component-overview";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/ninaero/ui/command";

export function CommandPreview({ interactive }: PreviewProps) {
  const [selected, setSelected] = useState("");
  return (
    <div className="w-full max-w-64 rounded-lg border">
      <Command>
        <CommandInput placeholder="Find an action" aria-label="Find an action" />
        <CommandList>
          <CommandEmpty>No matching actions</CommandEmpty>
          <CommandGroup heading="Actions">
            {["Copy", "Paste", "Select all"].map((action) => (
              <CommandItem key={action} onSelect={() => interactive && setSelected(action)}>
                {action}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      {interactive && selected && (
        <output className="block px-2 pb-2 text-xs text-muted-foreground">
          Selected: {selected}
        </output>
      )}
    </div>
  );
}
