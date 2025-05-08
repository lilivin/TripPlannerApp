import { useState } from "react";
import { usePlanData } from "./usePlanData";
import { usePlanActions } from "./usePlanActions";
import type { PlanViewModel } from "@/types/plan-view";

export function usePlan(planId: string) {
  const [isListView, setIsListView] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: plan, isLoading, error } = usePlanData(planId);
  const actions = usePlanActions(planId);

  const handleAttractionOrderChange = async (
    dayId: string,
    attractions: PlanViewModel["planDays"][0]["attractions"]
  ) => {
    if (!plan) return;
    await actions.updateAttractionOrder.mutateAsync({ plan, dayId, attractions });
  };

  const handleAttractionRemove = async (dayId: string, attractionId: string) => {
    if (!plan) return;
    await actions.removeAttraction.mutateAsync({ plan, dayId, attractionId });
  };

  const handleNoteChange = async (dayId: string, attractionId: string, note: string) => {
    if (!plan) return;
    await actions.updateAttractionNote.mutateAsync({ plan, dayId, attractionId, note });
  };

  const handleEditPlan = async (data: Parameters<typeof actions.updatePlanMetadata.mutateAsync>[0]["data"]) => {
    if (!plan) return;
    await actions.updatePlanMetadata.mutateAsync({ plan, data });
    setEditDialogOpen(false);
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
