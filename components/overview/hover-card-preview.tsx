import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/ninaero/ui/hover-card";

export function HoverCardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger href="/docs" className="text-sm underline underline-offset-4">
        Explore components
      </HoverCardTrigger>
      <HoverCardContent>
        <strong>Components</strong>
        <p className="text-muted-foreground">Browse the component overview.</p>
      </HoverCardContent>
    </HoverCard>
  );
}
