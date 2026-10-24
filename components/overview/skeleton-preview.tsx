import { Skeleton } from "@/registry/ninaero/ui/skeleton";

export function SkeletonPreview() {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <p className="text-xs text-muted-foreground">Loading-state specimen</p>
    </div>
  );
}
