import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ninaero/ui/card";

export function CardPreview() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>One shared theme</CardTitle>
        <CardDescription>The same tokens, on every surface.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">A compact card specimen.</p>
      </CardContent>
    </Card>
  );
}
