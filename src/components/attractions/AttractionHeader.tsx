import React from "react";
import { Button } from "../ui/button";

interface AttractionHeaderProps {
  name: string;
  onBack: () => void;
}

/**
 * Header component for the attraction details page
 * Displays the attraction name and a back button
 */
export function AttractionHeader({ name, onBack }: AttractionHeaderProps) {
  return (
    <div className="flex items-center mb-6">
      <Button variant="outline" onClick={onBack} className="mr-4" aria-label="Go back">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </Button>
      <h1 className="text-3xl font-bold truncate">{name}</h1>
    </div>
  );
}
