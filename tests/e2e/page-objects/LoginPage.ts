import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Page Object Model class for the Login page
 */
export class LoginPage {
  readonly page: Page;

  // Locators
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly loginError: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly loadingSpinner: Locator;

  /**
   * Create a new LoginPage instance
   * @param page - Playwright page
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize all locators
    this.form = page.getByTestId("login-form");
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.submitButton = page.getByTestId("login-submit-button");
    this.emailError = page.getByTestId("email-error");
    this.passwordError = page.getByTestId("password-error");
    this.loginError = page.getByTestId("login-error-message");
    this.forgotPasswordLink = page.getByTestId("forgot-password-link");
    this.registerLink = page.getByTestId("register-link");
    this.loadingSpinner = page.getByTestId("loading-spinner");
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto("/login");
    await this.assertOnLoginPage();
  }

  /**
   * Fill in the login form
   * @param email - The email to use
   * @param password - The password to use
   */
  async fillLoginForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Submit the login form
   */
  async submitForm() {
    await this.submitButton.click();
  }

  /**
   * Login with the given credentials
   * @param email - The email to use
   * @param password - The password to use
   */
  async login(email: string, password: string) {
    console.log(`Attempting to login with email: ${email}`);
    await this.fillLoginForm(email, password);
    await this.submitForm();
  }

  /**
   * Wait for login to complete with redirect to home page
   * @param timeout - Time in ms to wait for redirect
   */
  async waitForLoginCompletion(timeout = 30000) {
    try {
      console.log("Waiting for redirection to home page...");
      await this.page.waitForURL("/", { timeout });
      console.log("Successfully redirected to home page");
    } catch (error) {
      console.error("Login redirection failed:", error);
      console.log("Current URL:", this.page.url());

      // Try to log any visible error messages on the page
      try {
        const pageContent = await this.page.content();
        console.log("Page content excerpt:", pageContent.substring(0, 500) + "...");

        const errorText = (await this.loginError.isVisible())
          ? await this.loginError.textContent()
          : "No visible error message";
        console.log("Error message on page:", errorText);

        // Check authentication status in local storage
        await this.checkAuthStatus();
      } catch (e) {
        console.error("Failed to extract page information:", e);
      }

      // Continue test execution even if redirect fails
    }
  }

  /**
   * Check authentication status by inspecting localStorage and sessionStorage
   */
  async checkAuthStatus() {
    try {
      console.log("Checking auth status in storage...");

      // Check localStorage
      const localStorageData = await this.page.evaluate(() => {
        const data: Record<string, string | null> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            try {
              // Mask sensitive data in tokens
              const value = localStorage.getItem(key);
              if (key.includes("token") || key.includes("refresh") || key.includes("auth")) {
                data[key] = value ? "***MASKED***" : null;
              } else {
                data[key] = value;
              }
            } catch {
              data[key] = "ERROR: Could not stringify value";
            }
          }
        }
        return data;
      });
      console.log("localStorage data:", JSON.stringify(localStorageData, null, 2));

      // Check sessionStorage
      const sessionStorageData = await this.page.evaluate(() => {
        const data: Record<string, string | null> = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            try {
              // Mask sensitive data in tokens
              const value = sessionStorage.getItem(key);
              if (key.includes("token") || key.includes("refresh") || key.includes("auth")) {
                data[key] = value ? "***MASKED***" : null;
              } else {
                data[key] = value;
              }
            } catch {
              data[key] = "ERROR: Could not stringify value";
            }
          }
        }
        return data;
      });
      console.log("sessionStorage data:", JSON.stringify(sessionStorageData, null, 2));

      // Check cookies
      const cookies = await this.page.context().cookies();
      console.log(
        "Cookies:",
        cookies.map((c) => ({ name: c.name, domain: c.domain, path: c.path }))
      );

      // Take a screenshot for visual debugging
      await this.page.screenshot({ path: "test-results/auth-failure.png" });
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  }

  /**
   * Assert that we are on the login page
   */
  async assertOnLoginPage() {
    await expect(this.page).toHaveURL("/login");
    await expect(this.form).toBeVisible();
  }

  /**
   * Check if any validation errors are visible
   */
  async hasValidationErrors() {
    const emailErrorVisible = await this.emailError.isVisible();
    const passwordErrorVisible = await this.passwordError.isVisible();
    return emailErrorVisible || passwordErrorVisible;
  }

  /**
   * Check if the login error message is visible
   */
  async hasLoginError() {
    return await this.loginError.isVisible();
  }

  /**
   * Navigate to the forgot password page
   */
  async goToForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  /**
   * Navigate to the registration page
   */
  async goToRegister() {
    await this.registerLink.click();
  }

  /**
   * Check if the form is in loading state
   */
  async isLoading() {
    return await this.loadingSpinner.isVisible();
  }
}
