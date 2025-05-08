import type { GeneratedPlanViewModel } from "../types/plan-preview.types";

const STORAGE_KEY_PREFIX = "plan_preview_";

export function savePlanPreview(guideId: string, planData: GeneratedPlanViewModel): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${guideId}`, JSON.stringify(planData));
  } catch (err) {
    console.error("Error saving plan preview to localStorage:", err);
    throw new Error("Failed to save plan preview to local storage");
  }
}

export function loadPlanPreview(guideId: string): GeneratedPlanViewModel | null {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${guideId}`);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Error loading plan preview from localStorage:", err);
    return null;
  }
}

export function removePlanPreview(guideId: string): void {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${guideId}`);
  } catch (err) {
    console.error("Error removing plan preview from localStorage:", err);
  }
}
