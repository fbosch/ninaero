import { Progress, ProgressLabel, ProgressValue } from "@/registry/ninaero/ui/progress";

export function ProgressPreview() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Progress value={62} className="w-full">
        <ProgressLabel>Example progress</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress variant="circular" value={62} aria-label="Example circular progress" />
    </div>
  );
}
