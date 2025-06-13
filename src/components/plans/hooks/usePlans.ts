import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PlansViewFilterState, PlanDeleteState } from "@/types/plans";
import type { PlanSummaryDto } from "@/types";
import { validateFilters, validatePage } from "@/lib/validators/plans";
import { fetchPlansWithTransform, handlePlanDeletion, handleToggleOffline } from "@/lib/services/plans.service";
import { isSuccess } from "@/lib/utils/result";

const QUERY_KEY = "plans";

// Extended type for frontend display
export interface PlanSummaryViewModel extends PlanSummaryDto {
  formattedDate: string;
}

export function usePlans() {
  const queryClient = useQueryClient();

  // State for filters
  const [filters, setFilters] = useState<PlansViewFilterState>({
    page: 1,
    limit: 10,
  });

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<PlanDeleteState | null>(null);

  // State for navigation
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Effect to handle navigation
  useEffect(() => {
    if (pendingNavigation) {
      document.location.href = pendingNavigation;
    }
  }, [pendingNavigation]);

  // Query for fetching plans
  const { data, isLoading, isInitialLoading, error } = useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: async () => {
      const result = await fetchPlansWithTransform(validateFilters(filters));
      if (isSuccess(result)) {
        return result.data;
      }
      throw result.error;
    },
  });

  // Mutation for deleting plans
  const deleteMutation = useMutation({
    mutationFn: handlePlanDeletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    },
  });

  // Mutation for toggling offline status
  const toggleOfflineMutation = useMutation({
    mutationFn: async ({ id, isOfflineAvailable }: { id: string; isOfflineAvailable: boolean }) => {
      const result = await handleToggleOffline(id, isOfflineAvailable);
      if (!isSuccess(result)) {
        throw result.error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  // Function to handle filter changes
  const handleFilterChange = (newFilters: Partial<PlansViewFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset to page 1 when filters change unless page explicitly set
    }));
  };

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    const validPage = validatePage(newPage, data?.pagination.pages || 1);
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
    await deleteMutation.mutateAsync(planToDelete.id);
  };

  // Function to toggle plan offline availability
  const handleToggleOfflineStatus = async (id: string, isOfflineAvailable: boolean) => {
    if (!id) {
      console.error("Invalid plan ID for offline toggle");
      return;
    }

    await toggleOfflineMutation.mutateAsync({ id, isOfflineAvailable });
  };

  // Function to navigate to plan details
  const handleViewPlan = useCallback((id: string) => {
    if (!id) {
      console.error("Invalid plan ID for view");
      return;
    }

    setPendingNavigation(`/plans/${id}`);
  }, []);

  // Function to navigate to create new plan
  const handleCreateNew = useCallback(() => {
    setPendingNavigation("/guides");
  }, []);

  return {
    plans: data?.plans ?? [],
    pagination: data?.pagination ?? { total: 0, page: 1, limit: 10, pages: 0 },
    isLoading,
    isInitialLoad: isInitialLoading,
    isDeleting: deleteMutation.isPending,
    error: error instanceof Error ? error.message : null,
    successMessage: deleteMutation.isSuccess ? `Successfully deleted plan: ${planToDelete?.name}` : null,
    filters,
    deleteDialogOpen,
    planToDelete,
    handleFilterChange,
    handlePageChange,
    handleDeletePlan,
    confirmDeletePlan,
    handleToggleOffline: handleToggleOfflineStatus,
    handleViewPlan,
    handleCreateNew,
    setDeleteDialogOpen,
  };
}
