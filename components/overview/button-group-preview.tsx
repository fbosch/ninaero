import { useState } from "react";

import type { PreviewProps } from "@/lib/component-overview";
import { Button } from "@/registry/ninaero/ui/button";
import { ButtonGroup } from "@/registry/ninaero/ui/button-group";

export function ButtonGroupPreview({ interactive }: PreviewProps) {
  const [view, setView] = useState("Day");
  return (
    <div className="space-y-2">
      <ButtonGroup>
        {["Day", "Week", "Month"].map((option) => (
          <Button
            key={option}
            variant={view === option ? "default" : "outline"}
            onClick={() => interactive && setView(option)}
          >
            {option}
          </Button>
        ))}
      </ButtonGroup>
      {interactive && <output className="block text-xs text-muted-foreground">View: {view}</output>}
    </div>
  );
}
