import { useState, useEffect, useCallback } from "react";
import type { GuideSummaryDto, PaginationInfo, GuideListResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "@/components/ui/icons";
import GuidesFiltersPanel from "./GuidesFiltersPanel";
import GuidesList from "./GuidesList";
import { apiClient, ApiClientError } from "@/lib/utils/api-client";
import { AuthProvider } from "../providers/AuthProvider";

// Error types for better error handling
type ErrorType = "network" | "server" | "notFound" | "unknown" | "auth";

interface ErrorState {
  type: ErrorType;
  message: string;
}

// Filter view model as per implementation plan
interface GuidesFilterViewModel {
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

function GuidesViewContent() {
  // State management
  const [filters, setFilters] = useState<GuidesFilterViewModel>({
    page: 1,
    limit: 12,
  });
  const [guides, setGuides] = useState<GuideSummaryDto[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);

  // Function to fetch guides from API
  const fetchGuides = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      console.log("Fetching guides from API...");

      // Use our apiClient utility
      const data = await apiClient<GuideListResponse>(`/api/guides?${queryParams.toString()}`);

      console.log("Guides loaded successfully:", data.data.length);
      setGuides(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching guides:", err);

      // Categorize errors for better user feedback
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

  // Handle filter changes
  const handleFiltersChange = (newFilters: GuidesFilterViewModel) => {
    // Validate numeric filters
    if (newFilters.min_days && newFilters.min_days < 1) {
      newFilters.min_days = 1;
    }

    if (newFilters.max_days && newFilters.min_days && newFilters.max_days < newFilters.min_days) {
      newFilters.max_days = newFilters.min_days;
    }

    // Reset to page 1 when filters change
    setFilters({ ...newFilters, page: 1 });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    // Ensure page is within valid range
    if (page < 1) page = 1;
    if (pagination.pages && page > pagination.pages) page = pagination.pages;

    setFilters((prev) => ({ ...prev, page }));
  };

  // Get error UI based on error type
  const getErrorUI = () => {
    if (!error) return null;

    const errorClasses = {
      network: "bg-yellow-100 border-yellow-400 text-yellow-800",
      server: "bg-red-100 border-red-400 text-red-800",
      notFound: "bg-blue-100 border-blue-400 text-blue-800",
      unknown: "bg-gray-100 border-gray-400 text-gray-800",
      auth: "bg-orange-100 border-orange-400 text-orange-800",
    };

    return (
      <div
        className={`${errorClasses[error.type]} border px-4 py-3 rounded mb-6 flex items-start justify-between`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error.message}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchGuides}
          aria-label="Try again"
          className="ml-2 flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Try Again
        </Button>
      </div>
    );
  };

  // Fetch guides on initial load and when filters change
  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Find Your Perfect Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <GuidesFiltersPanel initialFilters={filters} onFiltersChange={handleFiltersChange} />
        </CardContent>
      </Card>

      {getErrorUI()}

      <GuidesList guides={guides} pagination={pagination} onPageChange={handlePageChange} loading={loading} />
    </div>
  );
}

export default function GuidesView() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GuidesViewContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Simple error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Global error caught:", error);
      setHasError(true);
      setError(error.error || new Error("Unknown error occurred"));
    };

    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded" role="alert">
          <p className="font-bold">Something went wrong</p>
          <p>{error?.message || "An unknown error occurred. Please try refreshing the page."}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (err) {
    console.error("Render error:", err);
    setHasError(true);
    setError(err instanceof Error ? err : new Error("Unknown render error"));
    return null;
  }
}
