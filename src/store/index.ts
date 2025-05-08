import { configureStore } from "@reduxjs/toolkit";
import planPreviewReducer from "../components/plan-preview/store/plan-preview.slice";

export const store = configureStore({
  reducer: {
    planPreview: planPreviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
