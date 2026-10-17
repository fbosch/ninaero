import { rm, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const outputDirectory = resolve(process.cwd(), "out");
const outputStats = await stat(outputDirectory);

if (!outputStats.isDirectory()) {
  throw new Error(`Expected static export directory at ${outputDirectory}`);
}

// Next exports /workshop to a file and nested routes beneath a directory.
await Promise.all([
  rm(join(outputDirectory, "workshop.html"), { force: true }),
  rm(join(outputDirectory, "workshop.txt"), { force: true }),
  rm(join(outputDirectory, "workshop"), { recursive: true, force: true }),
]);
