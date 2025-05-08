import { create } from "zustand";
import type { GeneratedPlanViewModel, PlanAttractionViewModel } from "../types/plan-preview.types";

interface PlanPreviewState {
  planViewModel: GeneratedPlanViewModel | null;
  isListView: boolean;
  isSaving: boolean;
  saveDialogOpen: boolean;
  error: string | null;
  setPlanViewModel: (plan: GeneratedPlanViewModel) => void;
  setIsListView: (isList: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  setSaveDialogOpen: (isOpen: boolean) => void;
  setError: (error: string | null) => void;
  updateAttractions: (dayId: string, attractions: PlanAttractionViewModel[]) => void;
  removeAttraction: (dayId: string, attractionId: string) => void;
  updateAttractionNote: (dayId: string, attractionId: string, note: string) => void;
}

export const usePlanPreviewStore = create<PlanPreviewState>((set) => ({
  planViewModel: null,
  isListView: true,
  isSaving: false,
  saveDialogOpen: false,
  error: null,
  setPlanViewModel: (plan) => set({ planViewModel: plan }),
  setIsListView: (isList) => set({ isListView: isList }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setSaveDialogOpen: (isOpen) => set({ saveDialogOpen: isOpen }),
  setError: (error) => set({ error }),
  updateAttractions: (dayId, attractions) =>
    set((state) => ({
      planViewModel: state.planViewModel
        ? {
            ...state.planViewModel,
            planDays: state.planViewModel.planDays.map((day) => (day.id === dayId ? { ...day, attractions } : day)),
          }
        : null,
    })),
  removeAttraction: (dayId, attractionId) =>
    set((state) => ({
      planViewModel: state.planViewModel
        ? {
            ...state.planViewModel,
            planDays: state.planViewModel.planDays.map((day) =>
              day.id === dayId
                ? {
                    ...day,
                    attractions: day.attractions.filter((attr) => attr.id !== attractionId),
                  }
                : day
            ),
          }
        : null,
    })),
  updateAttractionNote: (dayId, attractionId, note) =>
    set((state) => ({
      planViewModel: state.planViewModel
        ? {
            ...state.planViewModel,
            planDays: state.planViewModel.planDays.map((day) =>
              day.id === dayId
                ? {
                    ...day,
                    attractions: day.attractions.map((attr) =>
                      attr.id === attractionId ? { ...attr, notes: note } : attr
                    ),
                  }
                : day
            ),
          }
        : null,
    })),
}));
