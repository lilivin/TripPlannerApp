import { test, expect } from "./page-objects/BaseTest";

test.describe.configure({ mode: "parallel" });

// Add enhanced debugging for CI environment
const isCI = !!process.env.CI;

test.describe("Login Scenario", () => {
  // Take screenshots on failure for all tests in this group
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== "passed") {
      // Capture screenshot on test failure
      await page.screenshot({
        path: `test-results/failed-${testInfo.title.replace(/\s+/g, "-")}-${Date.now()}.png`,
        fullPage: true,
      });

      // Log more detailed info about the page state
      console.log(`Page URL at failure: ${page.url()}`);
      console.log(`Test title: ${testInfo.title}`);
      console.log(`Test status: ${testInfo.status}`);

      if (isCI) {
        // Log DOM content in CI environment for additional debugging
        const html = await page.content();
        console.log(`Page HTML at failure (first 500 chars): ${html.substring(0, 500)}...`);
      }
    }
  });

  test("Should successfully log in with valid credentials", async ({ loginPage, homePage, page }) => {
    // Log environment information
    console.log(`Running login test with username: ${process.env.E2E_USERNAME || "test.user@example.com"}`);
    console.log(`In CI environment: ${isCI}`);
    console.log(`Viewport size: ${page.viewportSize()?.width}x${page.viewportSize()?.height}`);

    // Arrange: Navigate to the login page
    await loginPage.goto();

    // Take a screenshot of initial state in CI
    if (isCI) {
      await page.screenshot({ path: `test-results/login-initial-state.png` });
    }

    // Act: Login with valid credentials from environment variables
    await loginPage.login(
      process.env.E2E_USERNAME || "test.user@example.com",
      process.env.E2E_PASSWORD || "testPassword123!"
    );

    // Take a screenshot after entering credentials in CI
    if (isCI) {
      await page.screenshot({ path: `test-results/login-after-credentials.png` });
    }

    // Wait for the login process to complete with more detailed logging
    console.log("Waiting for login completion...");
    await loginPage.waitForLoginCompletion(5000);
    console.log(`Current URL after login attempt: ${page.url()}`);

    // Increase timeout for CI environments
    const timeout = isCI ? 10000 : 5000;

    // Assert: Verify user is logged in and on home page
    await expect(loginPage.page).toHaveURL("/", { timeout });
    console.log("URL check passed");

    await homePage.assertLoggedIn();
    console.log("Login assertion passed");
  });

  test("Should show error with invalid credentials", async ({ loginPage }) => {
    // Arrange: Navigate to login page
    await loginPage.goto();

    // Act: Enter invalid credentials and submit
    await loginPage.login("invalid@example.com", "wrongpassword");

    // Assert: Check for error message and that we're still on login page
    await loginPage.assertOnLoginPage();
    await expect(loginPage.loginError).toBeVisible({ timeout: 3000 });
  });

  test("Should validate form inputs", async ({ loginPage }) => {
    // Arrange: Navigate to login page
    await loginPage.goto();

    // Act & Assert: Try to submit with empty fields
    await loginPage.submitForm();
    await expect(loginPage.emailError).toBeVisible({ timeout: 2000 });
    await expect(loginPage.emailError).toHaveText("Please enter a valid email address");
    await expect(loginPage.passwordError).toBeVisible({ timeout: 2000 });
    await expect(loginPage.passwordError).toHaveText("Password must be at least 6 characters");

    // Act & Assert: Test invalid email format
    await loginPage.emailInput.fill("notanemail");
    await loginPage.submitForm();
    await expect(loginPage.emailError).toBeVisible({ timeout: 2000 });
    await expect(loginPage.emailError).toHaveText("Please enter a valid email address");

    // Act & Assert: Test valid email
    await loginPage.emailInput.fill("user@example.com");
    await loginPage.submitForm();
    await expect(loginPage.emailError).not.toBeVisible({ timeout: 2000 });
    await expect(loginPage.passwordError).toBeVisible({ timeout: 2000 });

    // Act & Assert: Test too short password
    await loginPage.passwordInput.fill("12345");
    await loginPage.submitForm();
    await expect(loginPage.passwordError).toBeVisible({ timeout: 2000 });
    await expect(loginPage.passwordError).toHaveText("Password must be at least 6 characters");

    // Act & Assert: Test valid password
    await loginPage.passwordInput.fill("123456");
    await loginPage.submitForm();
    await expect(loginPage.passwordError).not.toBeVisible({ timeout: 2000 });
  });
});
