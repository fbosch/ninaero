import { InboxIcon } from "@/lib/icons";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ninaero/ui/empty";

export function EmptyPreview() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No items</EmptyTitle>
        <EmptyDescription>An empty-state specimen.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
