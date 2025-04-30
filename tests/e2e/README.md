# E2E Testing with Playwright

This directory contains End-to-End tests using Playwright following the TripPlannerApp testing guidelines.

## Page Object Model Structure

The tests are organized using the Page Object Model (POM) pattern to improve maintainability:

### Page Objects

- **LoginPage**: Encapsulates all login form interactions
  - Located at: `./page-objects/LoginPage.ts`
  - Contains selectors and methods for login form interactions
  - Handles validation, form submission, and error checks

- **HomePage**: Manages verification of the logged-in state
  - Located at: `./page-objects/HomePage.ts` 
  - Provides methods to check user authentication status
  - Handles multiple ways to verify logged-in status

- **BaseTest**: Sets up the test fixtures with page objects
  - Located at: `./page-objects/BaseTest.ts`
  - Extends the Playwright test with custom fixtures
  - Provides page objects automatically to test cases

### Test Scenarios

The login test scenarios (`login.spec.ts`) follow the Arrange-Act-Assert pattern:

1. **Successful Login Test**
   - Arranges by navigating to the login page
   - Acts by entering valid credentials and submitting
   - Asserts that the user is logged in and redirected

2. **Invalid Credentials Test**
   - Shows error messages when credentials are invalid
   - Verifies user remains on login page

3. **Form Validation Test**
   - Tests form validation for empty fields
   - Tests validation for invalid email format
   - Tests validation for short password

## Data-testid Attributes

All selectors use the `data-testid` attribute convention for resilient testing:

- `login-form`: The main login form
- `email-input`: Email input field
- `password-input`: Password field
- `login-submit-button`: Form submission button
- `login-error-message`: Authentication error message
- `email-error` / `password-error`: Field validation messages
- `user-profile-menu`: Indicator of logged-in state
- `welcome-message`: Alternative logged-in indicator
- `login-button`: Indicator of logged-out state

## Running the Tests

The tests are configured to run on Chromium only, as specified in `playwright.config.ts`.

```bash
# Run all tests
npx playwright test

# Run login tests specifically
npx playwright test login.spec.ts

# Run with UI mode for debugging
npx playwright test --ui
``` 