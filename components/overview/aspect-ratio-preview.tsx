import { AspectRatio } from "@/registry/ninaero/ui/aspect-ratio";

export function AspectRatioPreview() {
  return (
    <AspectRatio ratio={16 / 9} className="w-full rounded-lg border bg-muted">
      <div className="flex size-full items-center justify-center text-2xl font-medium">16 : 9</div>
    </AspectRatio>
  );
}
