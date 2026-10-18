import type { Metadata } from "next";

import { DropdownMenuSpecimens } from "./dropdown-menu-specimens";

export const metadata: Metadata = { title: "Dropdown Menu workshop | Ninaero" };

export default function DropdownMenuWorkshopPage() {
  return (
    <div className="flex flex-col gap-8 [overflow-wrap:anywhere]">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Dropdown menus</h1>
        <p className="text-muted-foreground">
          Compact floating menus with clear highlights, checked items, and nested actions.
        </p>
        <p className="text-sm text-muted-foreground">
          Open with Enter, Space, or a pointer. Use arrow keys or type an item name to navigate.
          Escape dismisses the menu. Actions only update this example; shortcut hints do not bind
          keys. Selections are not saved.
        </p>
      </header>
      <DropdownMenuSpecimens />
    </div>
  );
}
