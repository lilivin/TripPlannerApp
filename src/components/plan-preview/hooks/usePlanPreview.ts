import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { GeneratePlanResponse, GuideMinimalDto, SavePlanFormData, CreatePlanCommand } from "@/types";
import type { AttractionDto } from "../../types";
import { toViewModel } from "../adapters/plan-preview.adapter";
import { savePlanPreview } from "../services/plan-preview.storage";
import {
  setPlanViewModel,
  setIsListView,
  setIsSaving,
  setSaveDialogOpen,
  setError,
  updateAttractions,
  removeAttraction,
  updateAttractionNote,
} from "../store/plan-preview.slice";
import type { RootState } from "@/store";

// ViewModel interfaces
export interface GeneratedPlanViewModel {
  guide: GuideMinimalDto;
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

export interface PlanAttractionViewModel extends AttractionDto {
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
  duration: number; // w minutach
  description?: string;
}

export function usePlanPreview(guideId: string, generationResponse: GeneratePlanResponse) {
  const dispatch = useDispatch();
  const { planViewModel, isListView, error, isSaving, saveDialogOpen } = useSelector(
    (state: RootState) => state.planPreview
  );

  // Initialize data from the generation response
  useEffect(() => {
    const fetchGuideInfo = async () => {
      try {
        const response = await fetch(`/api/guides/${guideId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch guide info: ${response.statusText}`);
        }
        const guideData = await response.json();

        const guideMinimal = {
          id: guideData.id,
          title: guideData.title,
          location_name: guideData.location_name,
        };

        const mappedViewModel = toViewModel(generationResponse, guideMinimal);
        dispatch(setPlanViewModel(mappedViewModel));
        savePlanPreview(guideId, mappedViewModel);
      } catch (err) {
        console.error("Error fetching guide info:", err);
        dispatch(setError("Could not load guide information. Please try again."));
      }
    };

    fetchGuideInfo();
  }, [guideId, generationResponse, dispatch]);

  // Handle attraction order change within a day
  const handleAttractionOrderChange = useCallback(
    (dayId: string, attractions: PlanAttractionViewModel[]) => {
      dispatch(updateAttractions({ dayId, attractions }));
      if (planViewModel) {
        savePlanPreview(guideId, planViewModel);
      }
    },
    [guideId, planViewModel, dispatch]
  );

  // Handle attraction removal
  const handleAttractionRemove = useCallback(
    (dayId: string, attractionId: string) => {
      dispatch(removeAttraction({ dayId, attractionId }));
      if (planViewModel) {
        savePlanPreview(guideId, planViewModel);
      }
    },
    [guideId, planViewModel, dispatch]
  );

  // Handle note changes for attractions
  const handleNoteChange = useCallback(
    (dayId: string, attractionId: string, note: string) => {
      dispatch(updateAttractionNote({ dayId, attractionId, note }));
      if (planViewModel) {
        savePlanPreview(guideId, planViewModel);
      }
    },
    [guideId, planViewModel, dispatch]
  );

  // Save plan to server
  const handleSave = useCallback(
    async (formData: SavePlanFormData) => {
      if (!planViewModel) return;

      dispatch(setIsSaving(true));
      try {
        const planContent = planViewModel.planDays.map((day) => ({
          date: day.date,
          attractions: day.attractions.map((attr) => ({
            name: attr.name,
            description: attr.description,
            start_time: attr.startTime,
            end_time: attr.endTime,
            visit_duration: attr.visitDuration,
            address: attr.address,
            location: attr.location,
            image_url: attr.imageUrl,
            notes: attr.notes,
            transport_to_next: attr.transportToNext
              ? {
                  mode: attr.transportToNext.mode,
                  duration: attr.transportToNext.duration,
                  distance: attr.transportToNext.distance,
                }
              : null,
          })),
        }));

        const saveCommand: CreatePlanCommand = {
          name: formData.name,
          guide_id: guideId,
          content: { days: planContent },
          generation_params: planViewModel.generationParams,
          is_favorite: formData.isFavorite,
        };

        const response = await fetch("/api/plans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saveCommand),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save plan");
        }

        const data = await response.json();
        window.location.href = `/plans/${data.id}`;
      } catch (err) {
        console.error("Error saving plan:", err);
        dispatch(setError(err instanceof Error ? err.message : "Failed to save the plan. Please try again."));
      } finally {
        dispatch(setIsSaving(false));
      }
    },
    [guideId, planViewModel, dispatch]
  );

  return {
    planViewModel,
    isListView,
    error,
    isSaving,
    saveDialogOpen,
    setIsListView: (value: boolean) => dispatch(setIsListView(value)),
    setSaveDialogOpen: (value: boolean) => dispatch(setSaveDialogOpen(value)),
    handleAttractionOrderChange,
    handleAttractionRemove,
    handleNoteChange,
    handleSave,
  };
}
