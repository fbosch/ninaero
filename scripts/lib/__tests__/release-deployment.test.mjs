import assert from "node:assert/strict";
import test from "node:test";

import { requestReleaseBuild } from "../release-deployment.mjs";

const commit = "a".repeat(40);
const hookUrl =
  "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/" +
  "12345678-1234-1234-1234-123456789abc";
const githubToken = "test-github-token";

function stubFetch(responses) {
  const calls = [];
  return {
    calls,
    fetchImpl: async (url, options) => {
      calls.push({ url, ...options });
      const response = responses.shift();
      assert.ok(response, "Unexpected extra request.");
      if (response instanceof Error) throw response;
      return Response.json(response.body ?? {}, { status: response.status ?? 200 });
    },
  };
}

test("a first release creates production at the exact commit before requesting a build", async () => {
  const stub = stubFetch([
    { status: 404 },
    { status: 201, body: { object: { sha: commit } } },
    { body: { success: true } },
  ]);
  const result = await requestReleaseBuild({ commit, githubToken, hookUrl, ...stub });
  assert.deepEqual(result, { commit, status: "requested" });
  assert.deepEqual(
    stub.calls.map(({ url, method }) => ({ url, method })),
    [
      {
        url: "https://api.github.com/repos/fbosch/ninaero/git/ref/heads/production",
        method: "GET",
      },
      { url: "https://api.github.com/repos/fbosch/ninaero/git/refs", method: "POST" },
      { url: hookUrl, method: "POST" },
    ],
  );
  assert.deepEqual(JSON.parse(stub.calls[1].body), {
    ref: "refs/heads/production",
    sha: commit,
  });
  assert.equal(stub.calls[0].headers.Authorization, `Bearer ${githubToken}`);
  assert.equal(stub.calls[2].headers, undefined);
  assert.equal(stub.calls[2].redirect, "error");
});

test("existing production advances without force and supports retrying the current release", async () => {
  const stub = stubFetch([
    { body: { object: { sha: commit } } },
    { body: { object: { sha: commit } } },
    { body: { success: true } },
  ]);
  await requestReleaseBuild({ commit, githubToken, hookUrl, ...stub });
  assert.equal(stub.calls[1].method, "PATCH");
  assert.deepEqual(JSON.parse(stub.calls[1].body), { sha: commit, force: false });
});

test("invalid hook URLs, credentials, and commits fail before any branch change", async () => {
  const hookCases = [
    undefined,
    "not a URL",
    hookUrl.replace("https:", "http:"),
    hookUrl.replace("api.cloudflare.com", "attacker.example"),
    hookUrl.replace("api.cloudflare.com", "user:pass@api.cloudflare.com"),
    hookUrl + "?secret=leaked",
    hookUrl + "#fragment",
    "https://api.cloudflare.com/client/v4/accounts/example",
  ];
  for (const value of hookCases) {
    const stub = stubFetch([]);
    await assert.rejects(
      requestReleaseBuild({ commit, githubToken, hookUrl: value, ...stub }),
      /must be a Cloudflare Pages deploy-hook URL/,
    );
    assert.equal(stub.calls.length, 0);
  }
  for (const invalid of [{ commit: "main" }, { githubToken: "" }]) {
    const stub = stubFetch([]);
    await assert.rejects(
      requestReleaseBuild({ commit, githubToken, hookUrl, ...stub, ...invalid }),
    );
    assert.equal(stub.calls.length, 0);
  }
});

test("lookup failures are not mistaken for a missing production branch", async () => {
  for (const status of [401, 403, 500]) {
    const stub = stubFetch([{ status }]);
    await assert.rejects(
      requestReleaseBuild({ commit, githubToken, hookUrl, ...stub }),
      /GitHub ref lookup failed/,
    );
    assert.equal(stub.calls.length, 1);
  }
});

test("non-fast-forward, protected-branch, and creation conflicts never trigger the hook", async () => {
  for (const initial of [200, 404]) {
    const stub = stubFetch([{ status: initial }, { status: 422 }]);
    await assert.rejects(
      requestReleaseBuild({ commit, githubToken, hookUrl, ...stub }),
      /Only fast-forward releases are allowed/,
    );
    assert.equal(stub.calls.length, 2);
  }
});

test("GitHub must confirm the promoted commit before the hook is called", async () => {
  const stub = stubFetch([{ status: 404 }, { body: { object: { sha: "b".repeat(40) } } }]);
  await assert.rejects(
    requestReleaseBuild({ commit, githubToken, hookUrl, ...stub }),
    /did not confirm/,
  );
  assert.equal(stub.calls.length, 2);
});

test("hook rejection and unsuccessful responses fail without retrying", async () => {
  for (const hook of [{ status: 503 }, { body: { success: false } }]) {
    const stub = stubFetch([{ status: 404 }, { body: { object: { sha: commit } } }, hook]);
    await assert.rejects(
      requestReleaseBuild({ commit, githubToken, hookUrl, ...stub }),
      /Cloudflare/,
    );
    assert.equal(stub.calls.length, 3);
  }
});

test("network errors do not disclose the hook secret or GitHub token", async () => {
  const stub = stubFetch([
    { status: 404 },
    { body: { object: { sha: commit } } },
    new Error(`Failed URL: ${hookUrl}; token: ${githubToken}`),
  ]);
  await assert.rejects(requestReleaseBuild({ commit, githubToken, hookUrl, ...stub }), (error) => {
    assert.equal(
      error.message,
      "Cloudflare deploy hook request failed. No automatic retry was attempted.",
    );
    assert.equal(error.message.includes(hookUrl), false);
    assert.equal(error.message.includes(githubToken), false);
    assert.equal(error.cause, undefined);
    return true;
  });
  assert.equal(stub.calls.length, 3);
});
