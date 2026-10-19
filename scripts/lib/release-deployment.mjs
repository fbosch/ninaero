const repository = "fbosch/ninaero";
const refPath = `/repos/${repository}/git/refs/heads/production`;
const shaPattern = /^[0-9a-f]{40}$/i;
const uuidPattern = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const hookPathPattern = new RegExp(`^/client/v4/pages/webhooks/deploy_hooks/${uuidPattern}$`, "i");

function validateHook(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("CLOUDFLARE_DEPLOY_HOOK must be a Cloudflare Pages deploy-hook URL.");
  }
  if (
    url.origin !== "https://api.cloudflare.com" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !hookPathPattern.test(url.pathname)
  ) {
    throw new Error("CLOUDFLARE_DEPLOY_HOOK must be a Cloudflare Pages deploy-hook URL.");
  }
  return url.href;
}

async function send(fetchImpl, url, options, label) {
  try {
    return await fetchImpl(url, {
      ...options,
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    // Fetch errors can contain the secret hook URL.
    throw new Error(`${label} request failed. No automatic retry was attempted.`);
  }
}

async function readJson(response, label) {
  try {
    return await response.json();
  } catch {
    throw new Error(`${label} returned invalid JSON.`);
  }
}

export async function requestReleaseBuild({ commit, githubToken, hookUrl, fetchImpl = fetch }) {
  const hook = validateHook(hookUrl);
  if (!shaPattern.test(commit ?? "")) throw new Error("A full release commit SHA is required.");
  if (!githubToken) throw new Error("GH_TOKEN is required to promote the production branch.");

  const github = async (path, method = "GET", body) =>
    send(
      fetchImpl,
      `https://api.github.com${path}`,
      {
        method,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${githubToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      },
      "GitHub",
    );

  const current = await github(`/repos/${repository}/git/ref/heads/production`);
  let promotion;
  if (current.status === 404) {
    promotion = await github(`/repos/${repository}/git/refs`, "POST", {
      ref: "refs/heads/production",
      sha: commit,
    });
  } else {
    if (!current.ok) throw new Error(`GitHub ref lookup failed (HTTP ${current.status}).`);
    promotion = await github(refPath, "PATCH", { sha: commit, force: false });
  }
  if (!promotion.ok) {
    throw new Error(
      `Production promotion failed (HTTP ${promotion.status}). Only fast-forward releases are allowed.`,
    );
  }
  const promoted = await readJson(promotion, "GitHub");
  if (promoted.object?.sha !== commit) {
    throw new Error("GitHub did not confirm the requested production commit.");
  }

  const response = await send(fetchImpl, hook, { method: "POST" }, "Cloudflare deploy hook");
  if (!response.ok) {
    throw new Error(`Cloudflare deploy hook rejected the request (HTTP ${response.status}).`);
  }
  const result = await readJson(response, "Cloudflare deploy hook");
  if (result.success !== true) {
    throw new Error("Cloudflare did not accept the deployment request.");
  }
  // shortcut: hook acceptance does not confirm a finished build. Keep production
  // unchanged until Cloudflare finishes; add a status callback before overlapping releases.
  return { commit, status: "requested" };
}
