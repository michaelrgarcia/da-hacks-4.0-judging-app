import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/lib/convex/__tests__/**/*.test.ts"],
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
    globals: true,
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
  },
});
