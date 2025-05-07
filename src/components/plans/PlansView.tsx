import { useCallback, memo } from "react";
import { usePlans, type PlansViewFilterState } from "./hooks/usePlans";
import PlansHeader from "./PlansHeader";
import PlansFilters from "./PlansFilters";
import PlansList from "./PlansList";
import PlansPagination from "./PlansPagination";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import NoPlansMessage from "./NoPlansMessage";

// Error display component
const ErrorMessage = memo(
  ({ message, onRetry, isLoading }: { message: string; onRetry: () => void; isLoading: boolean }) => (
    <div className="mt-4 mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        disabled={isLoading}
      >
        {isLoading ? "Retrying..." : "Try Again"}
      </button>
    </div>
  )
);
ErrorMessage.displayName = "ErrorMessage";

// Success message component
const SuccessMessage = memo(({ message }: { message: string }) => (
  <div
    className="mt-4 mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <span className="block sm:inline">{message}</span>
  </div>
));
SuccessMessage.displayName = "SuccessMessage";

// Loading indicator component
const LoadingIndicator = memo(() => (
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
));
LoadingIndicator.displayName = "LoadingIndicator";

// The main component
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
  } = usePlans();

  // Memoized handler for viewing a plan
  const onViewPlan = useCallback(
    (id: string) => {
      handleViewPlan(id);
    },
    [handleViewPlan]
  );

  // Memoized handler for creating a new plan
  const onCreateNew = useCallback(() => {
    handleCreateNew();
  }, [handleCreateNew]);

  // Memoized handler for toggling a plan's offline availability
  const onToggleOffline = useCallback(
    (id: string, isOfflineAvailable: boolean) => {
      handleToggleOffline(id, isOfflineAvailable);
    },
    [handleToggleOffline]
  );

  // Memoized handler for deleting a plan
  const onDeletePlan = useCallback(
    (id: string, name: string) => {
      handleDeletePlan(id, name);
    },
    [handleDeletePlan]
  );

  // Memoized handler for page changes
  const onPageChange = useCallback(
    (page: number) => {
      handlePageChange(page);
    },
    [handlePageChange]
  );

  // Memoized handler for filter changes
  const onFilterChange = useCallback(
    (newFilters: Partial<PlansViewFilterState>) => {
      handleFilterChange(newFilters);
    },
    [handleFilterChange]
  );

  // Render component based on state
  return (
    <div className="container mx-auto py-8">
      <PlansHeader title="My Travel Plans" totalPlans={pagination.total} onCreateNew={onCreateNew} />

      <PlansFilters filters={filters} onFilterChange={onFilterChange} isLoading={isLoading} />

      {error && <ErrorMessage message={error} onRetry={retryFetch} isLoading={isLoading} />}

      {successMessage && <SuccessMessage message={successMessage} />}

      {!error && plans.length > 0 ? (
        <>
          <PlansList
            plans={plans}
            isLoading={isLoading}
            onViewPlan={onViewPlan}
            onDeletePlan={onDeletePlan}
            onToggleOffline={onToggleOffline}
          />

          <PlansPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </>
      ) : (
        !error &&
        !isInitialLoad && (
          <NoPlansMessage
            onCreateNew={onCreateNew}
            isFiltered={filters.isFavorite !== undefined || !!filters.guideId}
          />
        )
      )}

      {isInitialLoad && !error && <LoadingIndicator />}

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
