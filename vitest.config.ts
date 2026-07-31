import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  root: ".",
  cacheDir: ".vitest-cache",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ".")
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"]
  }
});
