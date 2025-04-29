import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

test("home page loads correctly", async ({ page }) => {
  const homePage = new HomePage(page);

  // Navigate to the home page
  await homePage.goto();

  // Verify the page has loaded
  await homePage.verifyPageLoaded();

  // Check if the page title exists
  const title = await page.title();
  expect(title).not.toBe("");

  // Example: Check if navigation elements are present
  // Modify this based on your actual page structure
  await expect(page.locator("nav")).toBeVisible();
});
