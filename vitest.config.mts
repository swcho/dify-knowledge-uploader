import { defineConfig } from "vitest/config";
import { config } from "dotenv";

export default defineConfig({
  test: {
    globals: true,
    env: {
      ...config().parsed,
    },
    // setupFiles: ['./test/setup.mts'],
    include: ["**/*.test.ts"],
  },
  define: {
    "process.env": JSON.stringify(config().parsed),
  },
});
