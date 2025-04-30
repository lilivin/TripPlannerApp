import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.test file
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

/**
 * Playwright configuration
 * Following recommendations from the TripPlannerApp guidelines
 */
const config: PlaywrightTestConfig = {
  // Directory where tests are located
  testDir: "./tests/e2e",

  // Maximum time one test can run for
  timeout: 30000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [["html", { open: "never" }]],

  // Shared settings for all the projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    // Collect trace when retrying the failed test
    trace: "on-first-retry",

    // Take screenshot on failure
    screenshot: "only-on-failure",
  },

  // Configure projects for major browsers - only Chromium per guidelines
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  // Create artifacts directory for storing screenshots and traces
  outputDir: "test-results/",
};

export default config;
