import type { PlanViewModel, PlanAttractionViewModel } from "@/types/plan-view";
import type { PlanDetailDto, GeolocationDto } from "@/types";
import type { Json } from "@/db/database.types";

export function mapPlanDetailToViewModel(data: PlanDetailDto): PlanViewModel {
  const content = data.content as Record<string, unknown>;
  const planDays = Array.isArray(content.days)
    ? content.days.map((day: Record<string, unknown>, index: number) => ({
        id: (day.id as string) || `day-${index}`,
        date: (day.date as string) || new Date(Date.now() + index * 86400000).toISOString().split("T")[0],
        dayNumber: index + 1,
        attractions: mapAttractions(day.attractions as Record<string, unknown>[]),
      }))
    : [];

  const generationParamsData = data.generation_params as Record<string, unknown>;
  const preferencesData = (generationParamsData?.preferences || {}) as Record<string, unknown>;

  return {
    id: data.id,
    name: data.name,
    guide: data.guide,
    created_at: data.created_at,
    updated_at: data.updated_at,
    is_favorite: data.is_favorite,
    planDays,
    generationParams: {
      days: (generationParamsData?.days as number) || planDays.length,
      preferences: {
        start_time: preferencesData.start_time as string | undefined,
        end_time: preferencesData.end_time as string | undefined,
        include_meals: preferencesData.include_meals as boolean | undefined,
        transportation_mode: preferencesData.transportation_mode as string | undefined,
        include_tags: preferencesData.include_tags as string[] | undefined,
        exclude_tags: preferencesData.exclude_tags as string[] | undefined,
      },
    },
  };
}

function mapAttractions(attractions: Record<string, unknown>[]): PlanAttractionViewModel[] {
  return attractions.map((attraction: Record<string, unknown>) => {
    const geoLocation = attraction.geolocation as Record<string, unknown> | undefined;
    const mappedGeolocation: GeolocationDto | undefined = geoLocation
      ? {
          latitude: geoLocation.latitude as number,
          longitude: geoLocation.longitude as number,
        }
      : undefined;

    const transport = attraction.transport_to_next as Record<string, unknown> | undefined;
    const mappedTransport = transport
      ? {
          mode: transport.mode as string,
          duration: transport.duration as number,
          description: transport.description as string | undefined,
        }
      : undefined;

    return {
      id: (attraction.id as string) || `attraction-${Math.random().toString(36).substring(2, 11)}`,
      name: (attraction.name as string) || "",
      description: (attraction.description as string) || "",
      startTime: (attraction.start_time as string) || "",
      endTime: (attraction.end_time as string) || "",
      visitDuration: (attraction.visit_duration_minutes as number) || 0,
      address: (attraction.address as string) || "",
      geolocation: mappedGeolocation,
      imageUrl: (attraction.image_url as string) || undefined,
      note: (attraction.note as string) || "",
      transportToNext: mappedTransport,
    };
  });
}

export function preparePlanContentForAPI(plan: PlanViewModel): Json {
  return {
    days: plan.planDays.map((day) => ({
      id: day.id,
      date: day.date,
      attractions: day.attractions.map((attraction) => ({
        id: attraction.id,
        name: attraction.name,
        description: attraction.description,
        start_time: attraction.startTime,
        end_time: attraction.endTime,
        visit_duration_minutes: attraction.visitDuration,
        address: attraction.address,
        geolocation: attraction.geolocation || null,
        image_url: attraction.imageUrl || null,
        note: attraction.note || "",
        transport_to_next: attraction.transportToNext
          ? {
              mode: attraction.transportToNext.mode,
              duration: attraction.transportToNext.duration,
              description: attraction.transportToNext.description || null,
            }
          : null,
      })),
    })),
  } as Json;
}
