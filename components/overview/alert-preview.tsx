import { MessageCircleIcon } from "@/lib/icons";
import { Alert, AlertDescription, AlertTitle } from "@/registry/ninaero/ui/alert";

export function AlertPreview() {
  return (
    <Alert>
      <MessageCircleIcon />
      <AlertTitle>Theme preview</AlertTitle>
      <AlertDescription>Compare the neutral surfaces and text contrast.</AlertDescription>
    </Alert>
  );
}
