import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.spec.tsx",
  projects: [
    {
      name: "components",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:5173/playwright/gallery/index.html",
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
