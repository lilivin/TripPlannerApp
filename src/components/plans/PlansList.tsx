import { OfflineStatusProvider, useOfflineStatusContext } from "./context/OfflineStatusContext";
import { PlanCard } from "./PlanCard";
import { PlanCardSkeleton } from "./PlanCardSkeleton";
import { OfflineStatusError } from "./OfflineStatusError";
import type { PlansListProps } from "./types";

/**
 * Component that displays invalid plans warning
 */
function InvalidPlansWarning({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative">
      <span className="block sm:inline">
        {count} {count === 1 ? "plan was" : "plans were"} skipped due to invalid data.
      </span>
    </div>
  );
}

/**
 * Inner component that consumes the OfflineStatusContext
 */
function PlansListContent({ plans, onViewPlan, onDeletePlan, onToggleOffline }: Omit<PlansListProps, "isLoading">) {
  const {
    offlineStatuses,
    isLoading: isLoadingOfflineStatus,
    error: offlineStatusError,
    retryFetch,
  } = useOfflineStatusContext();

  // Validate plans data to prevent rendering issues
  const validPlans = plans.filter((plan) => plan && plan.id && plan.name);
  const invalidPlansCount = plans.length - validPlans.length;

  return (
    <div className="mb-6">
      {/* Show error message for offline status failures */}
      {offlineStatusError && (
        <OfflineStatusError error={offlineStatusError} onRetry={retryFetch} isRetrying={isLoadingOfflineStatus} />
      )}

      {/* Show warning for invalid plans */}
      <InvalidPlansWarning count={invalidPlansCount} />

      {/* Render the valid plans */}
      {validPlans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onView={() => onViewPlan(plan.id)}
          onDelete={() => onDeletePlan(plan.id, plan.name)}
          onToggleOffline={(isOfflineAvailable) => onToggleOffline(plan.id, isOfflineAvailable)}
          isOfflineAvailable={offlineStatuses[plan.id] || false}
        />
      ))}

      {/* Show message if no valid plans */}
      {validPlans.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No valid plans to display.</p>
        </div>
      )}
    </div>
  );
}

/**
 * Main PlansList component that displays a list of trip plans
 */
export default function PlansList({ plans, isLoading, onViewPlan, onDeletePlan, onToggleOffline }: PlansListProps) {
  // Show loading skeletons when initially loading plans
  if (isLoading) {
    return <PlanCardSkeleton count={3} />;
  }

  return (
    <OfflineStatusProvider plans={plans}>
      <PlansListContent
        plans={plans}
        onViewPlan={onViewPlan}
        onDeletePlan={onDeletePlan}
        onToggleOffline={onToggleOffline}
      />
    </OfflineStatusProvider>
  );
}
