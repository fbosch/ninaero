import { ToggleGroup, ToggleGroupItem } from "@/registry/ninaero/ui/toggle-group";

export function ToggleGroupPreview() {
  return (
    <ToggleGroup defaultValue={["left"]} variant="outline" spacing={0} aria-label="Text alignment">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}
