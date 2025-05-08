import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { GeneratedPlanViewModel, PlanAttractionViewModel } from "../types/plan-preview.types";

interface PlanPreviewState {
  planViewModel: GeneratedPlanViewModel | null;
  isListView: boolean;
  isSaving: boolean;
  saveDialogOpen: boolean;
  error: string | null;
}

const initialState: PlanPreviewState = {
  planViewModel: null,
  isListView: true,
  isSaving: false,
  saveDialogOpen: false,
  error: null,
};

const planPreviewSlice = createSlice({
  name: "planPreview",
  initialState,
  reducers: {
    setPlanViewModel: (state, action: PayloadAction<GeneratedPlanViewModel>) => {
      state.planViewModel = action.payload;
    },
    setIsListView: (state, action: PayloadAction<boolean>) => {
      state.isListView = action.payload;
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setSaveDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.saveDialogOpen = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateAttractions: (state, action: PayloadAction<{ dayId: string; attractions: PlanAttractionViewModel[] }>) => {
      if (state.planViewModel) {
        const { dayId, attractions } = action.payload;
        state.planViewModel.planDays = state.planViewModel.planDays.map((day) =>
          day.id === dayId ? { ...day, attractions } : day
        );
      }
    },
    removeAttraction: (state, action: PayloadAction<{ dayId: string; attractionId: string }>) => {
      if (state.planViewModel) {
        const { dayId, attractionId } = action.payload;
        state.planViewModel.planDays = state.planViewModel.planDays.map((day) =>
          day.id === dayId
            ? {
                ...day,
                attractions: day.attractions.filter((attr) => attr.id !== attractionId),
              }
            : day
        );
      }
    },
    updateAttractionNote: (state, action: PayloadAction<{ dayId: string; attractionId: string; note: string }>) => {
      if (state.planViewModel) {
        const { dayId, attractionId, note } = action.payload;
        state.planViewModel.planDays = state.planViewModel.planDays.map((day) =>
          day.id === dayId
            ? {
                ...day,
                attractions: day.attractions.map((attr) =>
                  attr.id === attractionId ? { ...attr, notes: note } : attr
                ),
              }
            : day
        );
      }
    },
  },
});

export const {
  setPlanViewModel,
  setIsListView,
  setIsSaving,
  setSaveDialogOpen,
  setError,
  updateAttractions,
  removeAttraction,
  updateAttractionNote,
} = planPreviewSlice.actions;

export default planPreviewSlice.reducer;
