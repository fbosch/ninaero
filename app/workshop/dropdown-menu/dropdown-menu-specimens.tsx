"use client";

import { useState } from "react";

import { CopyIcon, FileTextIcon } from "@/lib/icons";
import { Button } from "@/registry/ninaero/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ninaero/ui/dialog";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/ninaero/ui/dropdown-menu";
import { FieldLegend, FieldSet } from "@/registry/ninaero/ui/field";

const triggerLayout = "h-auto min-h-8 w-fit max-w-full whitespace-normal";
const sides = ["top", "bottom", "left", "right", "inline-start", "inline-end"] as const;
const alignments = ["start", "center", "end"] as const;
const recentFiles = Array.from({ length: 24 }, (_, index) => `Example ${index + 1}`);

function FileActions({
  id,
  label,
  onAction,
}: {
  id: string;
  label: string;
  onAction: (action: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger id={id} render={<Button variant="outline" className={triggerLayout} />}>
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Example file</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onAction("Open")}>
            <FileTextIcon />
            Open
            <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("Duplicate")}>
            <CopyIcon />
            Duplicate
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem inset onClick={() => onAction("Rename")}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem disabled inset>
            Download
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => onAction("Delete example")}>
            Delete example
            <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DropdownMenuSpecimens() {
  const [action, setAction] = useState("None");
  const [grid, setGrid] = useState(true);
  const [rulers, setRulers] = useState(false);
  const [density, setDensity] = useState("comfortable");
  const [controlledOpen, setControlledOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("None");

  return (
    <div className="flex min-w-0 max-w-xl flex-col gap-8">
      <FieldSet className="button-specimen min-w-0 ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Actions and keyboard focus</FieldLegend>
        <div className="flex flex-wrap gap-3">
          <FileActions id="dropdown-actions" label="File actions" onAction={setAction} />
          <DropdownMenu>
            <DropdownMenuTrigger
              id="dropdown-disabled"
              disabled
              render={<Button variant="outline" className={triggerLayout} />}
            >
              Disabled menu
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Unavailable action</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button id="dropdown-outside" variant="secondary" className={triggerLayout}>
            Outside action
          </Button>
        </div>
        <p className="text-sm text-muted-foreground" role="status">
          Selected action: {action}.
        </p>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 bg-card p-6">
        <FieldLegend>Checkboxes and radio items</FieldLegend>
        <DropdownMenu>
          <DropdownMenuTrigger
            id="dropdown-settings"
            render={<Button variant="outline" className={triggerLayout} />}
          >
            View settings
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Display</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={grid}
                onCheckedChange={setGrid}
                closeOnClick={false}
              >
                Show grid
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={rulers}
                onCheckedChange={setRulers}
                closeOnClick={false}
              >
                Show rulers
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked disabled>
                Show guides
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Density</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
                <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="expanded">Expanded</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="text-sm text-muted-foreground" role="status">
          Grid {grid ? "on" : "off"}; rulers {rulers ? "on" : "off"}; density {density}.
        </p>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Submenus</FieldLegend>
        <DropdownMenu>
          <DropdownMenuTrigger
            id="dropdown-nested"
            render={<Button variant="outline" className={triggerLayout} />}
          >
            Open submenus
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setAction("New file")}>New file</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setAction("Email")}>Email</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAction("Copy link")}>
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-40">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => setAction("Export PDF")}>
                            PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setAction("Export PNG")}>
                            PNG
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub disabled>
                <DropdownMenuSubTrigger>Publish</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Unavailable destination</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 bg-card p-6">
        <FieldLegend>Sides and alignment</FieldLegend>
        <div className="flex flex-wrap gap-3">
          {sides.map((side) => (
            <DropdownMenu key={side}>
              <DropdownMenuTrigger render={<Button variant="outline" className={triggerLayout} />}>
                Open {side}
              </DropdownMenuTrigger>
              <DropdownMenuContent side={side} className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{side}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setAction("Inspect")}>Inspect</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAction("Duplicate")}>
                    Duplicate
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          {alignments.map((align) => (
            <DropdownMenu key={align}>
              <DropdownMenuTrigger render={<Button variant="outline" className={triggerLayout} />}>
                Align {align}
              </DropdownMenuTrigger>
              <DropdownMenuContent align={align} className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{align} aligned</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setAction("Inspect")}>Inspect</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 ninaero-surface-paper bg-(--paper-fill) p-6">
        <FieldLegend>Long labels and scrolling</FieldLegend>
        <DropdownMenu>
          <DropdownMenuTrigger
            id="dropdown-long"
            render={<Button variant="outline" className={triggerLayout} />}
          >
            Recent files
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" aria-label="Recent files">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Examples</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setAction("Long filename")}>
                ALongUnbrokenFilenameForCheckingWrappingWithoutHorizontalOverflow.txt
              </DropdownMenuItem>
              {recentFiles.map((name) => (
                <DropdownMenuItem key={name} onClick={() => setAction(name)}>
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </FieldSet>

      <FieldSet className="button-specimen min-w-0 bg-card p-6">
        <FieldLegend>Controlled state and dialog</FieldLegend>
        <div className="flex flex-wrap gap-3">
          <DropdownMenu open={controlledOpen} onOpenChange={setControlledOpen}>
            <DropdownMenuTrigger
              id="dropdown-controlled"
              render={<Button variant="outline" className={triggerLayout} />}
            >
              Controlled menu
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setAction("Controlled action")}>
                  Select action
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" className={triggerLayout} />}>
              Open dialog
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto [overflow-wrap:anywhere]">
              <DialogHeader>
                <DialogTitle>Menu in a dialog</DialogTitle>
                <DialogDescription>
                  Escape dismisses the menu first. Focus returns to its trigger inside the dialog.
                </DialogDescription>
              </DialogHeader>
              <FileActions id="dropdown-dialog" label="Dialog actions" onAction={setDialogAction} />
              <p className="text-sm text-muted-foreground" role="status">
                Selected action: {dialogAction}.
              </p>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground" role="status">
          Controlled menu {controlledOpen ? "open" : "closed"}.
        </p>
      </FieldSet>

      <DirectionProvider direction="rtl">
        <FieldSet
          dir="rtl"
          className="button-specimen min-w-0 ninaero-surface-paper bg-(--paper-fill) p-6"
        >
          <FieldLegend>Right to left</FieldLegend>
          <div className="flex flex-wrap gap-3">
            <FileActions id="dropdown-rtl" label="RTL actions" onAction={setAction} />
            <DropdownMenu>
              <DropdownMenuTrigger
                id="dropdown-rtl-settings"
                render={<Button variant="outline" className={triggerLayout} />}
              >
                RTL settings
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Display</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={grid}
                    onCheckedChange={setGrid}
                    closeOnClick={false}
                  >
                    Show grid
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setAction("RTL email")}>
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setAction("RTL link")}>
                          Copy link
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </FieldSet>
      </DirectionProvider>
    </div>
  );
}
