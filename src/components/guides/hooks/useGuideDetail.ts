import { useState, useEffect, useCallback } from "react";
import type { GuideDetailDto } from "@/types";

// Definiuję lokalnie typ ApiError, który nie jest dostępny w importowanych typach
interface ApiError {
  code: number;
  message: string;
  details?: unknown;
}

/**
 * Hook do pobierania i zarządzania stanem przewodnika
 * @param guideId ID przewodnika do pobrania
 * @returns Obiekt zawierający dane przewodnika, stan ładowania, błędy i funkcje pomocnicze
 */
export const useGuideDetail = (guideId: string) => {
  const [guide, setGuide] = useState<GuideDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [expandedAttractions, setExpandedAttractions] = useState<Record<string, boolean>>({});

  // Funkcja do pobierania danych
  const fetchGuide = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = `/api/guides/${guideId}?include_attractions=true`;
      console.log("Component: Fetching guide from URL:", url);

      const response = await fetch(url);
      console.log("Component: Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("Component: Error data:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Component: Guide data:", data);
      setGuide(data);
      setError(null);
    } catch (e) {
      const error = e as Error;
      setError({
        code: error instanceof Response ? error.status : 500,
        message: error.message || "Nieoczekiwany błąd podczas pobierania przewodnika",
      });
    } finally {
      setIsLoading(false);
    }
  }, [guideId]);

  // Funkcja przełączająca rozwinięcie atrakcji
  const toggleAttractionExpand = (attractionId: string) => {
    setExpandedAttractions((prev) => ({
      ...prev,
      [attractionId]: !prev[attractionId],
    }));
  };

  useEffect(() => {
    fetchGuide();
  }, [fetchGuide]);

  return {
    guide,
    isLoading,
    error,
    activeTabIndex,
    setActiveTabIndex,
    expandedAttractions,
    toggleAttractionExpand,
    refetch: fetchGuide,
  };
};
