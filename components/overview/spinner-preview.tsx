import { Spinner } from "@/registry/ninaero/ui/spinner";

export function SpinnerPreview() {
  return (
    <div className="flex items-center gap-3">
      <Spinner className="size-6" aria-label="Activity indicator specimen" />
      <span className="text-sm text-muted-foreground">Activity specimen</span>
    </div>
  );
}
