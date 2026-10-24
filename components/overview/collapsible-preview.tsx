import { Button } from "@/registry/ninaero/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/ninaero/ui/collapsible";

export function CollapsiblePreview() {
  return (
    <Collapsible className="w-full max-w-72 rounded-lg border p-3">
      <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
        Show details
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
        Additional details appear here.
      </CollapsibleContent>
    </Collapsible>
  );
}
