import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { requestReleaseBuild } from "./lib/release-deployment.mjs";

try {
  const { stdout } = await promisify(execFile)("git", ["rev-parse", "HEAD"]);
  const result = await requestReleaseBuild({
    commit: stdout.trim(),
    githubToken: process.env.GH_TOKEN,
    hookUrl: process.env.CLOUDFLARE_DEPLOY_HOOK,
  });
  console.log(`Cloudflare build requested for ${result.commit}. Completion is not verified.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
