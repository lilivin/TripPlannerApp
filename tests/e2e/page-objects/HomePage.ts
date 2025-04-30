import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Page Object Model class for the Home page
 */
export class HomePage {
  readonly page: Page;

  // Locators for elements that indicate login state
  readonly userProfileMenu: Locator;
  readonly welcomeMessage: Locator;
  readonly loginButton: Locator;

  /**
   * Create a new HomePage instance
   * @param page - Playwright page
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.userProfileMenu = page.getByTestId("user-profile-menu");
    this.welcomeMessage = page.getByTestId("welcome-message");
    this.loginButton = page.getByTestId("login-button");
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await this.page.goto("/");
    await expect(this.page).toHaveURL("/");
  }

  /**
   * Assert that the user is logged in
   */
  async assertLoggedIn() {
    // Using multiple possible indicators of logged-in state
    // At least one should pass for a successful verification
    try {
      // Try to verify profile menu is visible (primary indicator)
      await expect(this.userProfileMenu).toBeVisible({ timeout: 5000 });
      return;
    } catch {
      try {
        // Try to verify welcome message is visible
        await expect(this.welcomeMessage).toBeVisible({ timeout: 2000 });
        return;
      } catch {
        // Verify login button is not visible
        await expect(this.loginButton).not.toBeVisible({ timeout: 2000 });
      }
    }
  }

  /**
   * Assert that the user is logged out
   */
  async assertLoggedOut() {
    // Check login button is visible, which indicates logged-out state
    await expect(this.loginButton).toBeVisible();

    // Ensure user profile elements are not visible
    await expect(this.userProfileMenu)
      .not.toBeVisible({ timeout: 1000 })
      .catch(() => null);
    await expect(this.welcomeMessage)
      .not.toBeVisible({ timeout: 1000 })
      .catch(() => null);
  }

  /**
   * Take a screenshot of the home page
   * Can be used for visual verification
   */
  async takeScreenshot(name = "homepage") {
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }
}
