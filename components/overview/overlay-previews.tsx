"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import { toast as sonnerToast } from "sonner";

import type { OverlayName, PreviewProps } from "@/lib/component-overview";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/ninaero/ui/alert-dialog";
import { Button } from "@/registry/ninaero/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ninaero/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ninaero/ui/drawer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/ninaero/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ninaero/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/ninaero/ui/sheet";
import { Toaster as SonnerToaster } from "@/registry/ninaero/ui/sonner";
import { Toaster as BaseToaster, createToastManager } from "@/registry/ninaero/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/ninaero/ui/tooltip";

function AlertDialogPreview() {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="space-y-2">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>Reset sample</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset this sample?</AlertDialogTitle>
            <AlertDialogDescription>
              This changes only the local example state.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogCancel variant="default" onClick={() => setConfirmed(true)}>
              Reset sample
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {confirmed ? "Sample reset" : "Sample unchanged"}
      </p>
    </div>
  );
}

function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Example dialog</DialogTitle>
          <DialogDescription>A focused surface for a short message.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Done</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DrawerPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Example drawer</DrawerTitle>
          <DrawerDescription>A panel with some sample details.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function HoverCardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger href="/docs" className="text-sm underline underline-offset-4">
        Explore components
      </HoverCardTrigger>
      <HoverCardContent>
        <strong>Components</strong>
        <p className="text-muted-foreground">Browse the component overview.</p>
      </HoverCardContent>
    </HoverCard>
  );
}

function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Show details</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Example details</PopoverTitle>
          <PopoverDescription>This panel is anchored to its button.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}

function SheetPreview() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Example sheet</SheetTitle>
          <SheetDescription>A panel at the edge of the screen.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SonnerPreview({ interactive = false }: PreviewProps) {
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={() =>
          sonnerToast("Sample notification", {
            description: "Shown in this example.",
          })
        }
      >
        Show notification
      </Button>
      <p className="text-xs text-muted-foreground">A short notification appears after selection.</p>
      {interactive ? <SonnerToaster position="bottom-right" /> : null}
    </div>
  );
}

function ToastPreview({ interactive = false }: PreviewProps) {
  const [manager] = useState(createToastManager);
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={() =>
          manager.add({
            title: "Sample notification",
            description: "Shown in this example.",
          })
        }
      >
        Show toast
      </Button>
      <p className="text-xs text-muted-foreground">A short message appears after selection.</p>
      {interactive ? <BaseToaster toastManager={manager} /> : null}
    </div>
  );
}

function TooltipPreview() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>Hover or focus here</TooltipTrigger>
      <TooltipContent>Details for this control</TooltipContent>
    </Tooltip>
  );
}

export const overlayPreviews = {
  "alert-dialog": AlertDialogPreview,
  dialog: DialogPreview,
  drawer: DrawerPreview,
  "hover-card": HoverCardPreview,
  popover: PopoverPreview,
  sheet: SheetPreview,
  sonner: SonnerPreview,
  toast: ToastPreview,
  tooltip: TooltipPreview,
} satisfies Record<OverlayName, ComponentType<PreviewProps>>;
