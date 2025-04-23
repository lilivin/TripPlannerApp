import type { Json } from "../db/database.types";
import type { TagDto } from "../types";

export type TransportationMode = 'walking' | 'public_transport' | 'car' | 'bicycle';

export const TRANSPORTATION_OPTIONS = [
  { value: 'walking', label: 'Pieszo' },
  { value: 'public_transport', label: 'Komunikacja miejska' },
  { value: 'car', label: 'Samochód' },
  { value: 'bicycle', label: 'Rower' },
];

export interface GeneratePlanFormData {
  guide_id: string;
  days: number;
  preferences: {
    include_tags: string[];
    exclude_tags: string[];
    start_time: string;
    end_time: string;
    include_meals: boolean;
    transportation_mode: TransportationMode;
  };
}

export interface GeneratePlanFormErrors {
  days?: string;
  start_time?: string;
  end_time?: string;
  timeRange?: string;
  transportation_mode?: string;
  general?: string;
}

export interface GeneratePlanResponse {
  content: Json;
  generation_params: Json;
  ai_generation_cost: number | null;
} 