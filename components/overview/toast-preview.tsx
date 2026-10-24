import { useState } from "react";

import type { PreviewProps } from "@/lib/component-overview";
import { Button } from "@/registry/ninaero/ui/button";
import { Toaster as BaseToaster, createToastManager } from "@/registry/ninaero/ui/toast";

export function ToastPreview({ interactive = false }: PreviewProps) {
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
