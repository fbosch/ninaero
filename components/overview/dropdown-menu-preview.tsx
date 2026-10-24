import { useState } from "react";

import { Button } from "@/registry/ninaero/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/ninaero/ui/dropdown-menu";

export function DropdownMenuPreview() {
  const [choice, setChoice] = useState("No view selected");
  return (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>Choose view</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setChoice("Grid view selected")}>
            Grid view
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setChoice("List view selected")}>
            List view
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {choice}
      </p>
    </div>
  );
}
