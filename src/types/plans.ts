import type { PlanSummaryDto } from "../types";

export interface PlanSummaryViewModel extends PlanSummaryDto {
  formattedDate: string;
}

export interface PlansViewFilterState {
  isFavorite?: boolean;
  guideId?: string;
  page: number;
  limit: number;
}

export interface PlansPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PlanDeleteState {
  id: string;
  name: string;
}

export interface PlansState {
  plans: PlanSummaryViewModel[];
  pagination: PlansPagination;
  isLoading: boolean;
  isInitialLoad: boolean;
  error: string | null;
  successMessage: string | null;
  deleteDialogOpen: boolean;
  planToDelete: PlanDeleteState | null;
  isDeleting: boolean;
}
