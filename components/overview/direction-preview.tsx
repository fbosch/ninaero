import { Badge } from "@/registry/ninaero/ui/badge";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import { Separator } from "@/registry/ninaero/ui/separator";

export function DirectionPreview() {
  return (
    <div className="w-full space-y-4">
      <DirectionProvider direction="ltr">
        <div dir="ltr" className="flex gap-2">
          <Badge variant="outline">Start</Badge>
          <span className="text-sm">Left to right</span>
        </div>
      </DirectionProvider>
      <Separator />
      <DirectionProvider direction="rtl">
        <div dir="rtl" className="flex gap-2">
          <Badge variant="outline">Start</Badge>
          <span className="text-sm">Right to left</span>
        </div>
      </DirectionProvider>
    </div>
  );
}
