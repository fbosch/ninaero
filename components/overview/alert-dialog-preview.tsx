import { useState } from "react";

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

export function AlertDialogPreview() {
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
