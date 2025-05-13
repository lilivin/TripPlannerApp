import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";
import { registerServiceWorker } from "./lib/utils/service-worker";

// Register service worker for offline functionality
registerServiceWorker();

// Get the root element and ensure it exists
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}

// Import after setting up the root to avoid import cycle issues
import HomePage from "./components/HomePage";
