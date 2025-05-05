import { useState, useEffect } from "react";
import type { PlanViewModel, PlanAttractionViewModel } from "@/types/plan-view";
import type { PlanDetailDto, UpdatePlanCommand, GeolocationDto } from "@/types";
import * as PlanService from "@/lib/services/PlanService";
import type { Json } from "@/db/database.types";

/**
 * Hook do pobierania i zarządzania danymi planu
 */
export function useSinglePlan(planId: string) {
  const [plan, setPlan] = useState<PlanViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isListView, setIsListView] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Pobieranie danych planu
  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return;

      setIsLoading(true);
      try {
        const data = await PlanService.getPlanById(planId);

        // Mapowanie danych z API na ViewModel
        const mappedPlan = mapPlanDetailToViewModel(data);
        setPlan(mappedPlan);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  // Funkcja do zmiany kolejności atrakcji w dniu
  const handleAttractionOrderChange = async (dayId: string, attractions: PlanAttractionViewModel[]) => {
    if (!plan) return;

    try {
      // Utwórz nowy plan ze zmienioną kolejnością atrakcji
      const updatedPlan = {
        ...plan,
        planDays: plan.planDays.map((day) => {
          if (day.id === dayId) {
            return { ...day, attractions };
          }
          return day;
        }),
      };

      // Aktualizuj UI
      setPlan(updatedPlan);

      // Zapisz zmiany w API bez czekania na odpowiedź
      saveChangesToAPI(updatedPlan).catch((err) => {
        console.error("Failed to save attraction order changes", err);
        setError("Nie udało się zmienić kolejności atrakcji. Zmiany mogą nie zostać zachowane.");
      });
    } catch (err) {
      console.error("Error updating attraction order", err);
      setError("Wystąpił nieoczekiwany błąd podczas aktualizacji kolejności atrakcji.");
    }
  };

  // Funkcja do usuwania atrakcji
  const handleAttractionRemove = async (dayId: string, attractionId: string) => {
    if (!plan) return;

    try {
      // Utwórz nowy plan z usuniętą atrakcją
      const updatedPlan = {
        ...plan,
        planDays: plan.planDays.map((day) => {
          if (day.id === dayId) {
            return {
              ...day,
              attractions: day.attractions.filter((attr) => attr.id !== attractionId),
            };
          }
          return day;
        }),
      };

      // Aktualizuj UI
      setPlan(updatedPlan);

      // Zapisz zmiany w API bez czekania na odpowiedź
      saveChangesToAPI(updatedPlan).catch((err) => {
        console.error("Failed to save attraction removal", err);
        setError("Nie udało się usunąć atrakcji. Zmiany mogą nie zostać zachowane.");

        // Pobierz ponownie aktualny stan planu z serwera w przypadku błędu
        refreshPlan();
      });
    } catch (err) {
      console.error("Error removing attraction", err);
      setError("Wystąpił nieoczekiwany błąd podczas usuwania atrakcji.");

      // Pobierz ponownie aktualny stan planu z serwera w przypadku błędu
      refreshPlan();
    }
  };

  // Funkcja do zmiany notatki dla atrakcji
  const handleNoteChange = async (dayId: string, attractionId: string, note: string) => {
    if (!plan) return;

    try {
      // Utwórz nowy plan ze zmienioną notatką
      const updatedPlan = {
        ...plan,
        planDays: plan.planDays.map((day) => {
          if (day.id === dayId) {
            return {
              ...day,
              attractions: day.attractions.map((attr) => {
                if (attr.id === attractionId) {
                  return { ...attr, note };
                }
                return attr;
              }),
            };
          }
          return day;
        }),
      };

      // Aktualizuj UI
      setPlan(updatedPlan);

      // Zapisz zmiany w API bez czekania na odpowiedź
      saveChangesToAPI(updatedPlan).catch((err) => {
        console.error("Failed to save note change", err);
        setError("Nie udało się zaktualizować notatki. Zmiany mogą nie zostać zachowane.");

        // Pobierz ponownie aktualny stan planu z serwera w przypadku błędu
        refreshPlan();
      });
    } catch (err) {
      console.error("Error changing note", err);
      setError("Wystąpił nieoczekiwany błąd podczas aktualizacji notatki.");

      // Pobierz ponownie aktualny stan planu z serwera w przypadku błędu
      refreshPlan();
    }
  };

  // Funkcja do edycji planu (nazwa, ulubiony)
  const handleEditPlan = async (data: UpdatePlanCommand) => {
    if (!plan) return;

    try {
      // Wysyłamy bezpośrednio do API, ponieważ to endpoint do edycji metadanych planu
      const updatedData = await PlanService.updatePlan(planId, data);
      const mappedPlan = mapPlanDetailToViewModel(updatedData);

      setPlan(mappedPlan);
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error editing plan:", err);
      setError(err instanceof Error ? err.message : "Nie udało się zapisać zmian planu");
    }
  };

  // Helper do odświeżania planu z serwera
  const refreshPlan = async () => {
    try {
      const data = await PlanService.getPlanById(planId);
      const mappedPlan = mapPlanDetailToViewModel(data);
      setPlan(mappedPlan);
    } catch (err) {
      console.error("Error refreshing plan", err);
    }
  };

  // Helper do zapisywania zmian w API
  const saveChangesToAPI = async (planToSave: PlanViewModel): Promise<void> => {
    console.log("Saving changes to API...");

    // Przygotowanie danych do zapisu
    const contentToSave = preparePlanContentForAPI(planToSave);

    try {
      console.log("Sending update request...");
      const updatedPlan = await PlanService.updatePlan(planId, {
        content: contentToSave,
      });

      console.log("Plan updated successfully:", updatedPlan);
    } catch (err) {
      console.error("Failed to save changes", err);
      throw err;
    }
  };

  return {
    plan,
    isLoading,
    error,
    isListView,
    editDialogOpen,
    setIsListView,
    setEditDialogOpen,
    handleAttractionOrderChange,
    handleAttractionRemove,
    handleNoteChange,
    handleEditPlan,
  };
}

// Helper do mapowania danych z API na ViewModel
function mapPlanDetailToViewModel(data: PlanDetailDto): PlanViewModel {
  // Parsowanie zawartości JSON planu
  const content = data.content as Record<string, unknown>;

  // Mapowanie dni planu
  const planDays = Array.isArray(content.days)
    ? content.days.map((day: Record<string, unknown>, index: number) => ({
        id: (day.id as string) || `day-${index}`,
        date: (day.date as string) || new Date(Date.now() + index * 86400000).toISOString().split("T")[0],
        dayNumber: index + 1,
        attractions: Array.isArray(day.attractions)
          ? day.attractions.map((attraction: Record<string, unknown>) => {
              // Przekształć geolocation z Record<string, unknown> na GeolocationDto jeśli istnieje
              const geoLocation = attraction.geolocation as Record<string, unknown> | undefined;
              const mappedGeolocation: GeolocationDto | undefined = geoLocation
                ? {
                    latitude: geoLocation.latitude as number,
                    longitude: geoLocation.longitude as number,
                  }
                : undefined;

              // Przekształć transportToNext na właściwy typ
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
            })
          : [],
      }))
    : [];

  // Tworzenie viewmodelu planu z prawidłowym typem dla generationParams
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

// Helper do przygotowania danych do zapisu w API
function preparePlanContentForAPI(plan: PlanViewModel): Json {
  console.log("Preparing plan content for API with data:", plan);

  // Uproszczona wersja transformacji, bardziej przypominająca strukturę z API
  const content = {
    days: plan.planDays.map((day) => {
      return {
        id: day.id,
        date: day.date,
        attractions: day.attractions.map((attraction) => {
          // Przekształcenie transportToNext na format zgodny z API
          const transportToNext = attraction.transportToNext
            ? {
                mode: attraction.transportToNext.mode,
                duration: attraction.transportToNext.duration,
                description: attraction.transportToNext.description || null,
              }
            : null;

          return {
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
            transport_to_next: transportToNext,
          };
        }),
      };
    }),
  };

  console.log("Prepared content for API:", content);
  return content as Json;
}
