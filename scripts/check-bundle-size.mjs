import { checkRouteBundleBudgets, formatRouteBundleReport } from "./lib/bundle-size.mjs";

try {
  const result = await checkRouteBundleBudgets();
  console.log(formatRouteBundleReport(result));
  if (result.violations.length > 0) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`Route JS budget check failed: ${error.message}`);
  process.exitCode = 1;
}
