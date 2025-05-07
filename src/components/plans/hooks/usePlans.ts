import { useState, useEffect } from "react";
import type { PlanSummaryDto } from "../../../types";
import { fetchUserPlans, deletePlan, togglePlanOfflineStatus } from "@/lib/services/plans.client";

// Extended type for frontend display
export interface PlanSummaryViewModel extends PlanSummaryDto {
  formattedDate: string;
}

export interface PlansViewFilterState {
  isFavorite?: boolean;
  guideId?: string;
  page: number;
  limit: number;
}

/**
 * Custom hook for managing plans data and state
 */
export function usePlans() {
  // State for data
  const [plans, setPlans] = useState<PlanSummaryViewModel[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for filters
  const [filters, setFilters] = useState<PlansViewFilterState>({
    page: 1,
    limit: 10,
  });

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to validate filters
  const validateFilters = (filterData: PlansViewFilterState): PlansViewFilterState => {
    const validatedFilters = { ...filterData };

    // Ensure page is a positive number
    validatedFilters.page = Math.max(1, Number(validatedFilters.page) || 1);

    // Ensure limit is within reasonable bounds
    const validLimits = [5, 10, 20, 50];
    if (!validLimits.includes(validatedFilters.limit)) {
      validatedFilters.limit = 10; // Default to 10 if invalid
    }

    // Ensure isFavorite is a boolean if defined
    if (validatedFilters.isFavorite !== undefined) {
      validatedFilters.isFavorite = Boolean(validatedFilters.isFavorite);
    }

    // Ensure guideId is a valid string if defined
    if (validatedFilters.guideId !== undefined && typeof validatedFilters.guideId !== "string") {
      delete validatedFilters.guideId;
    }

    return validatedFilters;
  };

  // Function to fetch plans
  const fetchPlans = async (skipLoading = false) => {
    if (!skipLoading) {
      setIsLoading(true);
    }

    try {
      const validatedFilters = validateFilters(filters);

      const response = await fetchUserPlans(validatedFilters);

      const transformedPlans = response.data
        .map((plan: PlanSummaryDto): PlanSummaryViewModel | null => {
          if (!plan || !plan.id || !plan.name || !plan.guide || !plan.created_at) {
            console.error("Invalid plan data", plan);
            return null;
          }

          try {
            const date = new Date(plan.created_at);
            return {
              ...plan,
              formattedDate: date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            };
          } catch (err) {
            console.error("Error formatting date", err);
            return {
              ...plan,
              formattedDate: plan.created_at,
            };
          }
        })
        .filter((plan: PlanSummaryViewModel | null): plan is PlanSummaryViewModel => plan !== null);

      setPlans(transformedPlans);
      setPagination(response.pagination || { total: 0, page: 1, limit: 10, pages: 0 });
      setError(null);
      setRetryCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Failed to fetch plans:", err);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Function to retry fetching plans
  const retryFetch = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Function to handle filter changes
  const handleFilterChange = (newFilters: Partial<PlansViewFilterState>) => {
    // Validate new filters
    const validatedFilters = { ...newFilters };

    // Validate limit if provided
    if (validatedFilters.limit) {
      const validLimits = [5, 10, 20, 50];
      if (!validLimits.includes(validatedFilters.limit)) {
        validatedFilters.limit = 10;
      }
    }

    setFilters((prev) => ({
      ...prev,
      ...validatedFilters,
      page: newFilters.page || 1, // Reset to page 1 when filters change unless page explicitly set
    }));
  };

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    // Validate new page number
    const validPage = Math.max(1, Math.min(newPage, pagination.pages || 1));

    if (validPage !== newPage) {
      console.warn(`Invalid page number ${newPage} corrected to ${validPage}`);
    }

    setFilters((prev) => ({
      ...prev,
      page: validPage,
    }));
  };

  // Function to prepare deleting a plan
  const handleDeletePlan = (id: string, name: string) => {
    if (!id || !name) {
      console.error("Invalid plan data for deletion", { id, name });
      return;
    }

    setPlanToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  // Function to confirm plan deletion
  const confirmDeletePlan = async () => {
    if (!planToDelete) return;

    setIsDeleting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await deletePlan(planToDelete.id);

      // Success message
      setSuccessMessage(`Successfully deleted plan: ${planToDelete.name}`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      // Refresh the plans list
      await fetchPlans(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete plan");
    } finally {
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
      setIsDeleting(false);
    }
  };

  // Function to toggle plan offline availability
  const handleToggleOffline = async (id: string, isOfflineAvailable: boolean) => {
    if (!id) {
      console.error("Invalid plan ID for offline toggle");
      return;
    }

    try {
      await togglePlanOfflineStatus(id, isOfflineAvailable);
      // Success, but no need to refresh entire list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update offline status");

      // Error should automatically be cleared after 5 seconds for non-critical errors
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  // Function to navigate to plan details
  const handleViewPlan = (id: string) => {
    if (!id) {
      console.error("Invalid plan ID for view");
      return;
    }

    window.location.href = `/plans/${id}`;
  };

  // Function to navigate to create new plan
  const handleCreateNew = () => {
    window.location.href = "/guides";
  };

  // Effect to fetch plans when filters change or retry is triggered
  useEffect(() => {
    fetchPlans();
  }, [filters, retryCount]);

  return {
    plans,
    pagination,
    isLoading,
    isInitialLoad,
    isDeleting,
    error,
    successMessage,
    filters,
    deleteDialogOpen,
    planToDelete,
    handleFilterChange,
    handlePageChange,
    handleDeletePlan,
    confirmDeletePlan,
    handleToggleOffline,
    handleViewPlan,
    handleCreateNew,
    setDeleteDialogOpen,
    retryFetch,
  };
}
