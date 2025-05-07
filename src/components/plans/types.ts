import type { PlanSummaryDto } from "../../types";

/**
 * Extended PlanSummaryDto with additional properties for UI rendering
 */
export interface PlanSummaryViewModel extends PlanSummaryDto {
  formattedDate: string;
}

/**
 * Props for offline status error state display
 */
export interface OfflineStatusErrorProps {
  error: string;
  onRetry: () => void;
  isRetrying: boolean;
}

/**
 * Props for plan card skeleton loading state
 */
export interface PlanCardSkeletonProps {
  count?: number;
}

/**
 * Props for the central PlansList component
 */
export interface PlansListProps {
  plans: PlanSummaryViewModel[];
  isLoading: boolean;
  onViewPlan: (id: string) => void;
  onDeletePlan: (id: string, name: string) => void;
  onToggleOffline: (id: string, isOfflineAvailable: boolean) => void;
}
