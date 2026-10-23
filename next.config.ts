import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  /* config options here */
  experimental: {
    agentUpgrade: "security",
    // shortcut: bypass stale generated-CSS entries in the dev filesystem cache.
    // Re-enable when regenerated Button CSS survives a cached dev-server restart.
    turbopackFileSystemCacheForDev: false,
  },
  turbopack: {
    rules: {
      "*.css": {
        // Preserve native CSS Module class exports instead of emitting plain CSS.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
