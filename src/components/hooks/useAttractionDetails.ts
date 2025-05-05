import { useState, useEffect } from "react";
import type { AttractionDetailDto } from "@/types";

interface AttractionDetailsState {
  data: AttractionDetailDto | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook for fetching attraction details
 * @param id Attraction ID to fetch
 * @returns Object containing attraction data, loading state, and error state
 */
export function useAttractionDetails(id: string) {
  const [state, setState] = useState<AttractionDetailsState>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) {
      setState({ data: null, isLoading: false, error: new Error("No attraction ID provided") });
      return;
    }

    async function fetchAttractionDetails() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`/api/attractions/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Attraction not found");
          }
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setState({ data, isLoading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error("An unknown error occurred"),
        });
      }
    }

    fetchAttractionDetails();
  }, [id]);

  return state;
}
