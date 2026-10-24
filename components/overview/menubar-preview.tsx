import { useState } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/registry/ninaero/ui/menubar";

export function MenubarPreview() {
  const [choice, setChoice] = useState("No option selected");
  return (
    <div className="space-y-2">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setChoice("Grid selected")}>Grid</MenubarItem>
            <MenubarItem onClick={() => setChoice("List selected")}>List</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setChoice("Help selected")}>About this example</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {choice}
      </p>
    </div>
  );
}
