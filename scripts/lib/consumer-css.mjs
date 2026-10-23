import { gzipSync } from "node:zlib";

import { optimize } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
export function buildConsumerCss(compiler, base) {
  const scanner = new Scanner({
    sources: [{ base, pattern: "**/*.{ts,tsx}", negated: false }],
  });
  const css = compiler.build(scanner.scan());
  const minified = optimize(css, { minify: true }).code;
  return {
    css,
    minified,
    sizes: {
      compiled: Buffer.byteLength(css),
      minified: Buffer.byteLength(minified),
      gzip: gzipSync(minified).byteLength,
    },
  };
}
