import { Separator } from "@/registry/ninaero/ui/separator";

export function SeparatorPreview() {
  return (
    <div className="w-full space-y-4 text-sm">
      <p>Content above</p>
      <Separator />
      <p className="text-muted-foreground">Content below</p>
    </div>
  );
}
