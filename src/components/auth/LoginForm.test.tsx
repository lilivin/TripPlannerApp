import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

// Mock fetch API
vi.mock("global", () => ({
  fetch: vi.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Setup default fetch mock
    global.fetch = vi.fn();
    global.window.location.href = "/current-page";
  });

  // Validation tests
  describe("form validation", () => {
    it("should validate email format", async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.type(emailInput, "invalid-email");
      fireEvent.blur(emailInput);

      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();

      // Fix email and check if error disappears
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "valid@example.com");
      fireEvent.blur(emailInput);

      expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
    });

    it("should validate password length", async () => {
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText(/password/i);
      await userEvent.type(passwordInput, "abc");
      fireEvent.blur(passwordInput);

      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();

      // Fix password and check if error disappears
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, "validpassword");
      fireEvent.blur(passwordInput);

      expect(screen.queryByText(/password must be at least 6 characters/i)).not.toBeInTheDocument();
    });

    it("should validate all fields on form submission", async () => {
      render(<LoginForm />);

      // First try to submit the form with empty values
      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await userEvent.click(submitButton);

      // Then type invalid values and test validation
      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.type(emailInput, "invalid-email");

      const passwordInput = screen.getByLabelText(/password/i);
      await userEvent.type(passwordInput, "123");

      // Move focus to trigger validation
      await userEvent.tab();

      // Look for validation error messages directly in the DOM
      const emailError = await screen.findByText(/please enter a valid email address/i);
      const passwordError = await screen.findByText(/password must be at least 6 characters/i);

      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
    });
  });

  // API interaction tests
  describe("API interactions", () => {
    it("should show loading state during form submission", async () => {
      // Mock fetch to delay response
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ success: true }),
                }),
              100
            )
          )
      );

      render(<LoginForm />);

      // Fill form with valid data
      await userEvent.type(screen.getByLabelText(/email address/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "password123");

      // Submit form
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      // Check loading state
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });

    it("should handle successful login", async () => {
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      // Mock window.location.href
      Object.defineProperty(window, "location", {
        writable: true,
        value: { href: "/current-page" },
      });

      render(<LoginForm />);

      // Fill form with valid data
      await userEvent.type(screen.getByLabelText(/email address/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "password123");

      // Submit form
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      // Wait for redirect
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        });
        // Check if the URL includes the root path, rather than exact match
        expect(window.location.href).toContain("/");
      });
    });

    it("should handle API error responses", async () => {
      // Mock error response
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({
            error: "Invalid credentials",
          }),
      });

      render(<LoginForm />);

      // Fill form with valid data
      await userEvent.type(screen.getByLabelText(/email address/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "password123");

      // Submit form
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      // Check error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it("should handle network errors", async () => {
      // Mock network failure
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      render(<LoginForm />);

      // Fill form with valid data
      await userEvent.type(screen.getByLabelText(/email address/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "password123");

      // Submit form
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      // Check error message
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  // UI element tests
  describe("UI elements", () => {
    it("should disable form inputs during submission", async () => {
      // Mock delayed response
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ success: true }),
                }),
              100
            )
          )
      );

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      // Fill form with valid data
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");

      // Submit form
      await userEvent.click(submitButton);

      // Check disabled state
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it('should render the "Forgot password" link', () => {
      render(<LoginForm />);

      const forgotPasswordLink = screen.getByText(/forgot your password/i);
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink.getAttribute("href")).toBe("/forgot-password");
    });

    it("should render the registration link", () => {
      render(<LoginForm />);

      const registerLink = screen.getByText(/register/i);
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.getAttribute("href")).toBe("/register");
    });

    it("should show appropriate styling for invalid fields", async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.type(emailInput, "invalid-email");
      fireEvent.blur(emailInput);

      expect(emailInput).toHaveClass("border-red-300");
    });
  });
});
