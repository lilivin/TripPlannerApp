import { test as base } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { HomePage } from "./HomePage";

// Define the fixture types
interface CustomFixtures {
  loginPage: LoginPage;
  homePage: HomePage;
}

/**
 * Extended test fixture that includes page objects
 */
export const test = base.extend<CustomFixtures>({
  // @ts-ignore - Playwright's use is not a React hook
  loginPage: async ({ page }, use) => {
    // Create a LoginPage instance and pass it to the test
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  // @ts-ignore - Playwright's use is not a React hook
  homePage: async ({ page }, use) => {
    // Create a HomePage instance and pass it to the test
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

// Export the expect function from the base test
export { expect } from "@playwright/test";
