import { FileTextIcon } from "@/lib/icons";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/ninaero/ui/item";

export function ItemPreview() {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <FileTextIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Theme tokens</ItemTitle>
        <ItemDescription>A shared palette for every component.</ItemDescription>
      </ItemContent>
    </Item>
  );
}
