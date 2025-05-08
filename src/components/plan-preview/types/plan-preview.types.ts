export interface GeneratedPlanViewModel {
  guide: {
    id: string;
    title: string;
    location_name: string;
  };
  generationParams: {
    days: number;
    preferences: {
      include_tags?: string[];
      exclude_tags?: string[];
      start_time?: string;
      end_time?: string;
      include_meals?: boolean;
      transportation_mode?: string;
    };
  };
  planDays: PlanDayViewModel[];
  aiGenerationCost: number | null;
  totalAttractions: number;
}

export interface PlanDayViewModel {
  id: string;
  date: string;
  dayNumber: number;
  attractions: PlanAttractionViewModel[];
}

export interface PlanAttractionViewModel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  notes?: string;
  visitDuration: number;
  startTime: string;
  endTime: string;
  address: string;
  transportToNext?: {
    mode: string;
    duration: number;
    distance: number;
  };
}

export interface TransportInfoViewModel {
  mode: string;
  duration: number;
  description?: string;
}

// API Response Types
export interface ApiAttraction {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  note: string;
  visitDuration: number;
  startTime: string;
  endTime: string;
  address: string;
  transportToNext?: {
    mode: string;
    duration: number;
    distance: number;
  };
}

export interface ApiDay {
  id?: string;
  date?: string;
  dayNumber: number;
  attractions: ApiAttraction[];
}
