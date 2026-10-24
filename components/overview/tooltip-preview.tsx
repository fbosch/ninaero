import { Button } from "@/registry/ninaero/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/ninaero/ui/tooltip";

export function TooltipPreview() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>Hover or focus here</TooltipTrigger>
      <TooltipContent>Details for this control</TooltipContent>
    </Tooltip>
  );
}
