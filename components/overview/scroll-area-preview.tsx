import { ScrollArea } from "@/registry/ninaero/ui/scroll-area";

const scrollRows = [
  "Background",
  "Foreground",
  "Card",
  "Popover",
  "Primary",
  "Secondary",
  "Muted",
  "Accent",
  "Border",
  "Input",
  "Ring",
  "Destructive",
];

export function ScrollAreaPreview() {
  return (
    <ScrollArea className="h-36 w-full rounded-lg border">
      <div className="p-3">
        {scrollRows.map((token) => (
          <p key={token} className="border-b py-2 text-sm last:border-0">
            {token}
          </p>
        ))}
      </div>
    </ScrollArea>
  );
}
