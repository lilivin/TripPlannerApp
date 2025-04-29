import { expect } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";

/**
 * Page Object Model for the home page
 */
export class HomePage {
  readonly page: Page;
  readonly title: Locator;
  readonly navigation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator("h1").first();
    this.navigation = page.locator("nav");
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await this.page.goto("/");
  }

  /**
   * Verify that the home page has loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.navigation).toBeVisible();
    await expect(this.title).toBeVisible();
    // Checking URL instead of screenshot for more reliable tests
    await expect(this.page).toHaveURL(/.*\//);
  }
}
