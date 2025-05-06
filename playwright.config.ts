import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// First try to load from .env.test, then fallback to .env if available
const envTestPath = path.resolve(process.cwd(), ".env.test");
const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envTestPath)) {
  console.log("Loading environment variables from .env.test");
  dotenv.config({ path: envTestPath });
} else if (fs.existsSync(envPath)) {
  console.log("Loading environment variables from .env");
  dotenv.config({ path: envPath });
} else {
  console.log("No .env or .env.test file found, using existing environment variables");
}

// Debug: Log environment variable presence (not values)
console.log("Environment variables availability check:");
console.log("SUPABASE_URL:", !!process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", !!process.env.SUPABASE_KEY);
console.log("VITE_SUPABASE_URL:", !!process.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_KEY:", !!process.env.VITE_SUPABASE_KEY);
console.log("E2E_USERNAME:", !!process.env.E2E_USERNAME);
console.log("E2E_PASSWORD:", !!process.env.E2E_PASSWORD);
console.log("BASE_URL:", process.env.BASE_URL || "http://localhost:3000");

/**
 * Playwright configuration
 * Following recommendations from the TripPlannerApp guidelines
 */
const config: PlaywrightTestConfig = {
  // Directory where tests are located
  testDir: "./tests/e2e",

  // Maximum time one test can run for - increased for CI environments
  timeout: process.env.CI ? 60000 : 30000,

  // Run tests in files in parallel
  fullyParallel: !process.env.CI, // Disable parallel in CI for more stable results

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry more times on CI
  retries: process.env.CI ? 3 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ["html", { open: "never" }],
    ["list"], // Add list reporter for more verbose console output
  ],

  // Shared settings for all the projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    // Collect trace when retrying the failed test
    trace: process.env.CI ? "on" : "on-first-retry",

    // Take screenshot on failure
    screenshot: "only-on-failure",

    // Record video for CI runs to aid debugging
    video: process.env.CI ? "on-first-retry" : "off",
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

  // Automatically start the web server before tests
  webServer: {
    command: "npm run preview",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120 * 1000, // 120 seconds to start - increased for CI environments
    env: {
      // Pass through environment variables to the web server
      // Convert undefined values to empty strings to satisfy type constraints
      SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
      SUPABASE_KEY: process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || "",
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "",
      VITE_SUPABASE_KEY: process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY || "",
      ...(process.env.TZ ? { TZ: process.env.TZ } : {}),
    },
  },
};

export default config;
