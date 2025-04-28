import { useState, useEffect } from "react";
import type { PlanSummaryDto } from "../../types";
import PlansHeader from "./PlansHeader";
import PlansFilters from "./PlansFilters";
import PlansList from "./PlansList";
import PlansPagination from "./PlansPagination";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import NoPlansMessage from "./NoPlansMessage";

// Extended type for frontend display
interface PlanSummaryViewModel extends PlanSummaryDto {
  formattedDate: string; // Format przyjazny dla użytkownika
}

interface PlansViewFilterState {
  isFavorite?: boolean;
  guideId?: string;
  page: number;
  limit: number;
}

// Custom hook for managing plans data and state
function usePlansView() {
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
      // Validate filters before using them
      const validatedFilters = validateFilters(filters);

      const queryParams = new URLSearchParams();
      queryParams.append("page", validatedFilters.page.toString());
      queryParams.append("limit", validatedFilters.limit.toString());

      // Tymczasowo dodajemy sztywne ID użytkownika
      queryParams.append("user_id", "57e6776e-950c-4b0c-8e14-2a9bed080d3a");

      if (validatedFilters.isFavorite !== undefined) {
        queryParams.append("is_favorite", validatedFilters.isFavorite.toString());
      }

      if (validatedFilters.guideId) {
        queryParams.append("guide_id", validatedFilters.guideId);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Dla testów wypisz URL zapytania do konsoli
      console.log(`Fetching plans with URL: /api/plans?${queryParams.toString()}`);

      try {
        const response = await fetch(`/api/plans?${queryParams.toString()}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            // Dodaj header z ID użytkownika dla autoryzacji
            "X-User-ID": "57e6776e-950c-4b0c-8e14-2a9bed080d3a",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("You must be logged in to view plans");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to access these plans");
          } else if (response.status === 404) {
            throw new Error("No plans found");
          } else {
            throw new Error(`Failed to fetch plans: ${response.statusText}`);
          }
        }

        const data = await response.json();

        // Validate response data structure
        if (!data || !Array.isArray(data.data)) {
          throw new Error("Invalid response format from server");
        }

        // Transform the API response to view model
        const transformedPlans = data.data
          .map((plan: PlanSummaryDto): PlanSummaryViewModel | null => {
            // Validate plan data
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
                formattedDate: plan.created_at, // Fallback to raw date string
              };
            }
          })
          .filter((plan: PlanSummaryViewModel | null): plan is PlanSummaryViewModel => plan !== null);

        setPlans(transformedPlans);
        setPagination(data.pagination || { total: 0, page: 1, limit: 10, pages: 0 });
        setError(null);
        setRetryCount(0);
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }

      // Keep previous data on error
      console.error("Failed to fetch plans:", err);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Function to retry fetching plans
  const retryFetch = () => {
    setRetryCount((prev) => prev + 1);
    fetchPlans();
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        // Dla testów wypisz URL zapytania do konsoli
        console.log(`Deleting plan with ID: ${planToDelete.id}`);

        // Używamy standardowego endpointu, który został teraz poprawnie zaimplementowany
        const response = await fetch(`/api/plans/${planToDelete.id}`, {
          method: "DELETE",
          signal: controller.signal,
          headers: {
            // Dodaj header z ID użytkownika dla autoryzacji
            "X-User-ID": "57e6776e-950c-4b0c-8e14-2a9bed080d3a",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("You must be logged in to delete plans");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to delete this plan");
          } else if (response.status === 404) {
            throw new Error("The plan you're trying to delete no longer exists");
            // In this case, we should still refresh the list
          } else {
            throw new Error(`Failed to delete plan: ${response.statusText}`);
          }
        }

        // Success message
        setSuccessMessage(`Successfully deleted plan: ${planToDelete.name}`);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        // Refresh the plans list
        await fetchPlans(true);
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Delete request timed out. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to delete plan");
      }
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Dla testów wypisz URL zapytania do konsoli
      console.log(`Toggling offline status for plan ID: ${id} to ${isOfflineAvailable}`);

      try {
        const response = await fetch(`/api/plans/${id}/offline`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Dodaj header z ID użytkownika dla autoryzacji
            "X-User-ID": "57e6776e-950c-4b0c-8e14-2a9bed080d3a",
          },
          body: JSON.stringify({ is_cached: isOfflineAvailable }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("You must be logged in to change offline availability");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to change this plan's offline status");
          } else if (response.status === 404) {
            throw new Error("The plan you're trying to update no longer exists");
          } else if (response.status === 507) {
            throw new Error("Not enough storage space to save this plan offline");
          } else {
            throw new Error(`Failed to update offline status: ${response.statusText}`);
          }
        }

        // Success, but no need to refresh entire list
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Toggle offline request timed out. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to update offline status");
      }

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

export default function PlansView() {
  const {
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
  } = usePlansView();

  return (
    <div className="container mx-auto py-8">
      <PlansHeader title="My Travel Plans" totalPlans={pagination.total} onCreateNew={handleCreateNew} />

      <PlansFilters filters={filters} onFilterChange={handleFilterChange} isLoading={isLoading} />

      {error && (
        <div
          className="mt-4 mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={retryFetch}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Retrying..." : "Try Again"}
          </button>
        </div>
      )}

      {successMessage && (
        <div
          className="mt-4 mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {!error && plans.length > 0 ? (
        <>
          <PlansList
            plans={plans}
            isLoading={isLoading}
            onViewPlan={handleViewPlan}
            onDeletePlan={handleDeletePlan}
            onToggleOffline={handleToggleOffline}
          />

          <PlansPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </>
      ) : (
        !error &&
        !isInitialLoad && (
          <NoPlansMessage
            onCreateNew={handleCreateNew}
            isFiltered={filters.isFavorite !== undefined || !!filters.guideId}
          />
        )
      )}

      {isInitialLoad && !error && (
        <div className="py-12 text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-gray-600">Loading your plans...</p>
        </div>
      )}

      {planToDelete && (
        <ConfirmDeleteDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDeletePlan}
          planName={planToDelete.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
