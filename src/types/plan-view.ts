import type { GeolocationDto, GuideMinimalDto } from "../types";

/**
 * Plan day view model
 */
export interface PlanDayViewModel {
  id: string;
  date: string;
  dayNumber: number;
  attractions: PlanAttractionViewModel[];
}

/**
 * Plan attraction view model
 */
export interface PlanAttractionViewModel {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  visitDuration: number;
  address: string;
  geolocation?: GeolocationDto;
  imageUrl?: string;
  note: string;
  transportToNext?: {
    mode: string;
    duration: number;
    description?: string;
  };
}

/**
 * Plan view model
 */
export interface PlanViewModel {
  id: string;
  name: string;
  guide: GuideMinimalDto;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  planDays: PlanDayViewModel[];
  generationParams: {
    days: number;
    preferences: {
      start_time?: string;
      end_time?: string;
      include_meals?: boolean;
      transportation_mode?: string;
      include_tags?: string[];
      exclude_tags?: string[];
    };
  };
}
