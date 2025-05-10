import { useState, useCallback } from "react";
import type { GuideSummaryDto, PaginationInfo, GuideListResponse } from "@/types";
import { apiClient, ApiClientError } from "@/lib/utils/api-client";

export type ErrorType = "network" | "server" | "notFound" | "unknown" | "auth";

interface ErrorState {
  type: ErrorType;
  message: string;
}

export interface GuidesFilterViewModel {
  search?: string;
  creator_id?: string;
  language?: string;
  location?: string;
  min_days?: number;
  max_days?: number;
  is_published?: boolean;
  page?: number;
  limit?: number;
}

interface UseGuidesDataReturn {
  guides: GuideSummaryDto[];
  pagination: PaginationInfo;
  loading: boolean;
  error: ErrorState | null;
  filters: GuidesFilterViewModel;
  setFilters: (filters: GuidesFilterViewModel) => void;
  handlePageChange: (page: number) => void;
  refreshGuides: () => Promise<void>;
}

export function useGuidesData(initialFilters: GuidesFilterViewModel = { page: 1, limit: 12 }): UseGuidesDataReturn {
  const [filters, setFilters] = useState<GuidesFilterViewModel>(initialFilters);
  const [guides, setGuides] = useState<GuideSummaryDto[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);

  const fetchGuides = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const data = await apiClient<GuideListResponse>(`/api/guides?${queryParams.toString()}`);
      setGuides(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching guides:", err);

      if (err instanceof ApiClientError) {
        const errorType: ErrorType =
          err.status === 404
            ? "notFound"
            : err.status && err.status >= 500
              ? "server"
              : err.message.includes("timed out")
                ? "network"
                : "unknown";

        setError({
          type: errorType,
          message: err.message,
        });
      } else if (err instanceof Error) {
        setError({
          type: "unknown",
          message: err.message || "An unexpected error occurred. Please try again.",
        });
      } else {
        setError({
          type: "unknown",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: GuidesFilterViewModel) => {
    if (newFilters.min_days && newFilters.min_days < 1) {
      newFilters.min_days = 1;
    }

    if (newFilters.max_days && newFilters.min_days && newFilters.max_days < newFilters.min_days) {
      newFilters.max_days = newFilters.min_days;
    }

    setFilters({ ...newFilters, page: 1 });
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1) page = 1;
      if (pagination.pages && page > pagination.pages) page = pagination.pages;

      setFilters((prev) => ({ ...prev, page }));
    },
    [pagination.pages]
  );

  return {
    guides,
    pagination,
    loading,
    error,
    filters,
    setFilters: handleFiltersChange,
    handlePageChange,
    refreshGuides: fetchGuides,
  };
}
