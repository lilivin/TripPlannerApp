import type { PlansViewFilterState } from "@/types/plans";

const VALID_LIMITS = [5, 10, 20, 50] as const;
const DEFAULT_LIMIT = 10;

export function validateFilters(filters: PlansViewFilterState): PlansViewFilterState {
  const validatedFilters = { ...filters };

  // Ensure page is a positive number
  validatedFilters.page = Math.max(1, Number(validatedFilters.page) || 1);

  // Ensure limit is within valid bounds
  if (!VALID_LIMITS.includes(validatedFilters.limit as (typeof VALID_LIMITS)[number])) {
    validatedFilters.limit = DEFAULT_LIMIT;
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
}

export function validatePage(page: number, maxPages: number): number {
  return Math.max(1, Math.min(page, maxPages || 1));
}
