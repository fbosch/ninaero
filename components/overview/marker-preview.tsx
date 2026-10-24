import { MessageCircleIcon } from "@/lib/icons";
import { Marker, MarkerContent, MarkerIcon } from "@/registry/ninaero/ui/marker";

export function MarkerPreview() {
  return (
    <Marker variant="separator">
      <MarkerIcon>
        <MessageCircleIcon />
      </MarkerIcon>
      <MarkerContent>Example conversation</MarkerContent>
    </Marker>
  );
}
