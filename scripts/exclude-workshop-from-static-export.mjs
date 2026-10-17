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

const publicRoutes = [
  { route: "/", files: ["index.html"] },
  { route: "/docs", files: ["docs.html", "docs/index.html"] },
  {
    route: "/docs/button",
    files: ["docs/button.html", "docs/button/index.html"],
  },
];

async function isFile(relativePath) {
  try {
    return (await stat(join(outputDirectory, relativePath))).isFile();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function exists(relativePath) {
  try {
    await stat(join(outputDirectory, relativePath));
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

for (const { route, files } of publicRoutes) {
  let found = false;
  for (const file of files) {
    if (await isFile(file)) {
      found = true;
      break;
    }
  }
  if (!found) {
    throw new Error(`Missing static route ${route}; checked ${files.join(", ")}`);
  }
}

for (const artifact of ["workshop.html", "workshop.txt", "workshop"]) {
  if (await exists(artifact)) {
    throw new Error(`Workshop route artifact remains in static output: ${artifact}`);
  }
}

console.log("Verified static routes /, /docs, /docs/button; /workshop is excluded.");
