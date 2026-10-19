import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { overviewItems } from "@/lib/component-overview";
import { parseComponentProgress } from "@/lib/component-progress";
import { Alert, AlertDescription, AlertTitle } from "@/registry/ninaero/ui/alert";
import { Progress } from "@/registry/ninaero/ui/progress";

import styles from "./development-notice.module.css";

export async function DevelopmentNotice() {
  const markdown = await readFile(join(process.cwd(), "COMPONENTS.md"), "utf8");
  const { themed, total } = parseComponentProgress(
    markdown,
    overviewItems.map(({ name }) => name),
  );
  const summary = `${themed} of ${total} components themed`;

  return (
    <div className={styles.dock}>
      <Alert
        role="note"
        aria-labelledby="development-notice-title"
        className={`pointer-events-auto mx-auto grid w-full max-w-full grid-cols-[auto_minmax(0,1fr)] gap-x-3 sm:flex sm:w-fit sm:flex-wrap sm:items-center sm:justify-center sm:gap-y-2 ${styles.surface}`}
      >
        <Progress
          variant="circular"
          value={themed}
          max={total}
          aria-label="Component theming"
          aria-valuetext={summary}
          sound={false}
          className="row-span-2 shrink-0 self-center"
        />
        <AlertTitle id="development-notice-title">In development</AlertTitle>
        <AlertDescription>{summary}</AlertDescription>
      </Alert>
    </div>
  );
}
