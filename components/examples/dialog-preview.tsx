"use client";

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

export function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog preview</DialogTitle>
          <DialogDescription>
            Check the overlay, surface, typography, and keyboard focus in each color mode.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This example does not save or change any data.
        </p>
        <DialogFooter>
          <DialogClose render={<Button />}>Close dialog</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
