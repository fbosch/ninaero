import { toast as sonnerToast } from "sonner";

import type { PreviewProps } from "@/lib/component-overview";
import { Button } from "@/registry/ninaero/ui/button";
import { Toaster as SonnerToaster } from "@/registry/ninaero/ui/sonner";

export function SonnerPreview({ interactive = false }: PreviewProps) {
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
