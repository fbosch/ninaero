import { Bubble, BubbleContent, BubbleGroup } from "@/registry/ninaero/ui/bubble";

export function BubblePreview() {
  return (
    <BubbleGroup className="w-full">
      <Bubble variant="secondary">
        <BubbleContent>How does this surface look?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Try the dark theme too.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  );
}
