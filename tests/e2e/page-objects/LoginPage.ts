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
    await this.fillLoginForm(email, password);
    await this.submitForm();
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
