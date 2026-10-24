import { useState } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/registry/ninaero/ui/context-menu";

export function ContextMenuPreview() {
  const [choice, setChoice] = useState("No action selected");
  return (
    <div className="w-full max-w-72 space-y-2">
      <ContextMenu>
        <ContextMenuTrigger
          className="block rounded-lg border border-dashed p-4 text-center text-sm"
          tabIndex={0}
        >
          Right-click here or press Shift+F10
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setChoice("Copy selected")}>Copy sample</ContextMenuItem>
          <ContextMenuItem onClick={() => setChoice("Inspect selected")}>
            Inspect sample
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {choice}
      </p>
    </div>
  );
}
