import { Button } from "@/registry/ninaero/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ninaero/ui/popover";

export function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Show details</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Example details</PopoverTitle>
          <PopoverDescription>This panel is anchored to its button.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
