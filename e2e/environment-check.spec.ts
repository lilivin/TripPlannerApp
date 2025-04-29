import { test, expect } from "@playwright/test";

test.describe("Weryfikacja środowiska testowego", () => {
  test("prosty test weryfikujący czy Playwright działa", async () => {
    // Prosty test, który zawsze powinien przejść
    expect(1 + 1).toBe(2);
    expect(true).toBeTruthy();
    expect("Playwright").toContain("Play");
  });

  test("test weryfikujący dostęp do API Playwright", async ({ page }) => {
    // Test czy mamy dostęp do obiektu page
    expect(page).toBeDefined();

    // Sprawdzenie czy możemy tworzyć lokatory (nie nawigujemy na stronę)
    const testLocator = page.locator("body");
    expect(testLocator).toBeDefined();
  });
});
