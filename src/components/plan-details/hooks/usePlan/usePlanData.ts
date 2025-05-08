import { useQuery } from "@tanstack/react-query";
import * as PlanService from "@/lib/services/PlanService";
import { mapPlanDetailToViewModel } from "../../mappers/planMappers";
import type { PlanViewModel } from "@/types/plan-view";

export function usePlanData(planId: string) {
  return useQuery<PlanViewModel>({
    queryKey: ["plan", planId],
    queryFn: async () => {
      const data = await PlanService.getPlanById(planId);
      return mapPlanDetailToViewModel(data);
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
