import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

test.describe("Testowe testy środowiska", () => {
  test("prosty test sprawdzający czy środowisko testowe działa", async ({ page }) => {
    // Sprawdzenie czy możemy utworzyć instancję HomePage
    const homePage = new HomePage(page);

    // Nawigacja do strony głównej
    await homePage.goto();

    // Sprawdzenie czy jesteśmy na stronie głównej
    const url = page.url();
    expect(url).toContain("/");

    // Prosty test, który zawsze powinien przejść
    expect(true).toBe(true);
  });

  test("test sprawdzający podstawowe elementy DOM", async ({ page }) => {
    // Nawigacja do strony głównej
    await page.goto("/");

    // Sprawdzenie czy body istnieje (powinno zawsze przechodzić)
    await expect(page.locator("body")).toBeVisible();

    // Sprawdzenie czy HTML zawiera doctype (prosty test, który zawsze powinien przejść)
    const html = await page.content();
    expect(html).toContain("<!DOCTYPE html>");
  });
});
