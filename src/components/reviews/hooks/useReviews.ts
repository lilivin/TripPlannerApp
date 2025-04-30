import { useState, useEffect } from 'react';
import type { ReviewDto, PaginationInfo } from '@/types';

// Definicja lokalnego typu błędu
interface ApiError {
  code: number;
  message: string;
  details?: unknown;
}

/**
 * Hook do pobierania i zarządzania recenzjami
 * @param guideId ID przewodnika, dla którego pobierane są recenzje
 * @returns Obiekt zawierający recenzje, stan ładowania, błędy i funkcje pomocnicze
 */
export const useReviews = (guideId: string) => {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Funkcja do pobierania recenzji
  const fetchReviews = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/guides/${guideId}/reviews?page=${page}&limit=${pagination.limit}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReviews(data.data);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        pages: data.pagination.pages
      });
      setError(null);
    } catch (e) {
      const error = e as Error;
      setError({
        code: error instanceof Response ? error.status : 500,
        message: error.message || 'Nieoczekiwany błąd podczas pobierania recenzji'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [guideId]);

  return {
    reviews,
    isLoading,
    error,
    pagination,
    fetchPage: fetchReviews
  };
}; 