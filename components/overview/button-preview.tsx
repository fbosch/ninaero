import { useState } from "react";

import type { PreviewProps } from "@/lib/component-overview";
import { Button } from "@/registry/ninaero/ui/button";

export function ButtonPreview({ interactive }: PreviewProps) {
  const [last, setLast] = useState("");
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => interactive && setLast("Primary")}>Primary</Button>
        <Button variant="secondary" onClick={() => interactive && setLast("Secondary")}>
          Secondary
        </Button>
        <Button variant="outline" onClick={() => interactive && setLast("Outline")}>
          Outline
        </Button>
      </div>
      {interactive && (
        <output className="block text-xs text-muted-foreground">
          {last ? `${last} button selected` : "Select a button to see feedback"}
        </output>
      )}
    </div>
  );
}
