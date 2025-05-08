import type { GeneratePlanResponse } from "@/types";
import type {
  GeneratedPlanViewModel,
  PlanDayViewModel,
  ApiDay,
  ApiAttraction,
  GuideMinimalDto,
} from "../types/plan-preview.types";

export function toViewModel(response: GeneratePlanResponse, guide: GuideMinimalDto): GeneratedPlanViewModel {
  const content = response.content as unknown as { days: ApiDay[] };
  const generationParams = response.generation_params as {
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

  let daysArray = content.days || [];
  if (!Array.isArray(daysArray)) {
    daysArray = [];
  }

  return {
    guide,
    generationParams,
    planDays: daysArray.map((day: ApiDay, index: number) => mapDay(day, index)),
    aiGenerationCost: response.ai_generation_cost,
    totalAttractions: daysArray.reduce((total: number, day: ApiDay) => total + (day.attractions?.length || 0), 0),
  };
}

function mapDay(day: ApiDay, index: number): PlanDayViewModel {
  return {
    id: day.id || `day-${index + 1}`,
    date: day.date || new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dayNumber: index + 1,
    attractions: (day.attractions || []).map(mapAttraction),
  };
}

function mapAttraction(attraction: ApiAttraction) {
  return {
    id: attraction.id,
    name: attraction.name,
    description: attraction.description,
    imageUrl: attraction.imageUrl,
    location: attraction.location,
    notes: attraction.note,
    visitDuration: attraction.visitDuration,
    startTime: attraction.startTime,
    endTime: attraction.endTime,
    address: attraction.address,
    transportToNext: attraction.transportToNext,
  };
}
