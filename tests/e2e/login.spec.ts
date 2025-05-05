import { test, expect } from "./page-objects/BaseTest";

test.describe("Login Scenario", () => {
  test("Should successfully log in with valid credentials", async ({ loginPage, homePage }) => {
    // Arrange: Navigate to the login page
    await loginPage.goto();

    // Act: Login with valid credentials from environment variables
    await loginPage.login(
      process.env.E2E_USERNAME || "test.user@example.com",
      process.env.E2E_PASSWORD || "testPassword123!"
    );

    // Wait for the login process to complete and redirect
    await loginPage.page.waitForNavigation({ timeout: 10000 }).catch(() => {});

    // Assert: Verify user is logged in and redirected to home page
    await expect(loginPage.page).toHaveURL("/", { timeout: 10000 });
    await homePage.assertLoggedIn();
  });

  test("Should show error with invalid credentials", async ({ loginPage }) => {
    // Arrange: Navigate to login page
    await loginPage.goto();

    // Act: Enter invalid credentials and submit
    await loginPage.login("invalid@example.com", "wrongpassword");

    // Assert: Check for error message and that we're still on login page
    await loginPage.assertOnLoginPage();
    await expect(loginPage.loginError).toBeVisible();
  });

  test("Should validate form inputs", async ({ loginPage }) => {
    // Arrange: Navigate to login page
    await loginPage.goto();

    // Act & Assert: Try to submit with empty fields
    await loginPage.submitForm();
    await expect(loginPage.emailError).toBeVisible();
    await expect(loginPage.emailError).toHaveText("Please enter a valid email address");
    await expect(loginPage.passwordError).toBeVisible();
    await expect(loginPage.passwordError).toHaveText("Password must be at least 6 characters");

    // Act & Assert: Test invalid email format
    await loginPage.emailInput.fill("notanemail");
    await loginPage.submitForm();
    await expect(loginPage.emailError).toBeVisible();
    await expect(loginPage.emailError).toHaveText("Please enter a valid email address");

    // Act & Assert: Test valid email
    await loginPage.emailInput.fill("user@example.com");
    await loginPage.submitForm();
    await expect(loginPage.emailError).not.toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();

    // Act & Assert: Test too short password
    await loginPage.passwordInput.fill("12345");
    await loginPage.submitForm();
    await expect(loginPage.passwordError).toBeVisible();
    await expect(loginPage.passwordError).toHaveText("Password must be at least 6 characters");

    // Act & Assert: Test valid password
    await loginPage.passwordInput.fill("123456");
    await loginPage.submitForm();
    await expect(loginPage.passwordError).not.toBeVisible();
  });
});
