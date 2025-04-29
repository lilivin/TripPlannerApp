import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Run cleanup automatically after each test
afterEach(() => {
  cleanup();
});

// Set up global mocks if needed
beforeAll(() => {
  // Example: Global fetch mock
  global.fetch = vi.fn();

  // Example: Mock for window.matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Clean up mocks after all tests
afterAll(() => {
  vi.resetAllMocks();
});
