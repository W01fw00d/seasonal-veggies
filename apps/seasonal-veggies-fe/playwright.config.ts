import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

export default defineConfig({
  testDir: "./src",
  reporter: [["list"], ["./playwright/coverage-reporter.mjs"]],
  projects: [
    {
      name: "components",
      testMatch: "**/components/**/*.spec.tsx",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:5173/playwright/gallery/index.html",
        serviceWorkers: "block",
      },
    },
    {
      name: "e2e",
      testDir: "./test",
      testMatch: "**/*.e2e.spec.tsx",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:5173",
        serviceWorkers: "block",
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173/playwright/gallery/index.html",
    reuseExistingServer: !process.env.CI,
  },
});
