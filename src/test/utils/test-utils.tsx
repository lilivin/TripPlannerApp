import { cleanup, render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { afterEach } from "vitest";
import type { ReactElement } from "react";

// Add any providers here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };

// Clean up after each test
afterEach(() => {
  cleanup();
});
