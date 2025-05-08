import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PlanViewModel, PlanAttractionViewModel } from "@/types/plan-view";
import type { UpdatePlanCommand } from "@/types";
import {
  UpdatePlanMetadataCommand,
  UpdateAttractionOrderCommand,
  RemoveAttractionCommand,
  UpdateAttractionNoteCommand,
} from "../../commands/planCommands";

export function usePlanActions(planId: string) {
  const queryClient = useQueryClient();

  const updatePlanMetadata = useMutation({
    mutationFn: async ({ plan, data }: { plan: PlanViewModel; data: UpdatePlanCommand }) => {
      const command = new UpdatePlanMetadataCommand(planId, plan, data);
      await command.execute();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] });
    },
  });

  const updateAttractionOrder = useMutation({
    mutationFn: async ({
      plan,
      dayId,
      attractions,
    }: {
      plan: PlanViewModel;
      dayId: string;
      attractions: PlanAttractionViewModel[];
    }) => {
      const command = new UpdateAttractionOrderCommand(planId, plan, dayId, attractions);
      await command.execute();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] });
    },
  });

  const removeAttraction = useMutation({
    mutationFn: async ({ plan, dayId, attractionId }: { plan: PlanViewModel; dayId: string; attractionId: string }) => {
      const command = new RemoveAttractionCommand(planId, plan, dayId, attractionId);
      await command.execute();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] });
    },
  });

  const updateAttractionNote = useMutation({
    mutationFn: async ({
      plan,
      dayId,
      attractionId,
      note,
    }: {
      plan: PlanViewModel;
      dayId: string;
      attractionId: string;
      note: string;
    }) => {
      const command = new UpdateAttractionNoteCommand(planId, plan, dayId, attractionId, note);
      await command.execute();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] });
    },
  });

  return {
    updatePlanMetadata,
    updateAttractionOrder,
    removeAttraction,
    updateAttractionNote,
  };
}
