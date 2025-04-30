import { describe, it, expect } from "vitest";
import { render, screen } from "../test/utils/test-utils";
import LoadingState from "./LoadingState";

describe("LoadingState", () => {
  it("renders with default message", () => {
    render(<LoadingState />);

    // Check if loading text is displayed
    expect(screen.getByText("Wczytywanie danych...")).toBeInTheDocument();
    expect(screen.getByText("Proszę czekać, trwa pobieranie danych.")).toBeInTheDocument();

    // Check if spinner is displayed
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    const customMessage = "Generowanie planu...";
    render(<LoadingState message={customMessage} />);

    // Check if custom message is displayed
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByText("Proszę czekać, trwa pobieranie danych.")).toBeInTheDocument();
  });
});
