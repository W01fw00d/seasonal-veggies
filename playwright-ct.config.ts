import { defineConfig, devices } from "@playwright/experimental-ct-react";
import path from "node:path";

export default defineConfig({
  testDir: "./tests/components",
  use: {
    ctViteConfig: {
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "./src"),
        },
      },
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
