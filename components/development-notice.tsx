import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { overviewItems } from "@/lib/component-overview";
import { parseComponentProgress } from "@/lib/component-progress";
import { Alert, AlertDescription, AlertTitle } from "@/registry/ninaero/ui/alert";
import { Progress } from "@/registry/ninaero/ui/progress";

export async function DevelopmentNotice() {
  const markdown = await readFile(join(process.cwd(), "COMPONENTS.md"), "utf8");
  const { themed, total } = parseComponentProgress(
    markdown,
    overviewItems.map(({ name }) => name),
  );
  const summary = `${themed} of ${total} components themed`;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[2] px-[20px] sm:px-[32px] xl:bottom-[max(1.25rem,env(safe-area-inset-bottom))]">
      <Alert
        role="note"
        aria-labelledby="development-notice-title"
        className="pointer-events-auto mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 supports-backdrop-filter:bg-card/80 supports-backdrop-filter:backdrop-blur-md forced-colors:backdrop-blur-none"
      >
        <AlertTitle id="development-notice-title">In development</AlertTitle>
        <AlertDescription>{summary}</AlertDescription>
        <Progress
          value={themed}
          max={total}
          aria-label="Component theming"
          aria-valuetext={summary}
          sound={false}
          className="w-20 shrink-0"
        />
      </Alert>
    </div>
  );
}
