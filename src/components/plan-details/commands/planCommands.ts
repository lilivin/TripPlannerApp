import type { PlanViewModel, PlanAttractionViewModel } from "@/types/plan-view";
import type { UpdatePlanCommand } from "@/types";
import * as PlanService from "@/lib/services/PlanService";
import { preparePlanContentForAPI } from "../mappers/planMappers";

export interface PlanCommand {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

export class UpdatePlanMetadataCommand implements PlanCommand {
  private previousPlan: PlanViewModel;
  private newData: UpdatePlanCommand;

  constructor(
    private planId: string,
    private currentPlan: PlanViewModel,
    newData: UpdatePlanCommand
  ) {
    this.previousPlan = currentPlan;
    this.newData = newData;
  }

  async execute(): Promise<void> {
    await PlanService.updatePlan(this.planId, this.newData);
  }

  async undo(): Promise<void> {
    await PlanService.updatePlan(this.planId, {
      name: this.previousPlan.name,
      is_favorite: this.previousPlan.is_favorite,
    });
  }
}

export class UpdateAttractionOrderCommand implements PlanCommand {
  private previousPlan: PlanViewModel;

  constructor(
    private planId: string,
    private currentPlan: PlanViewModel,
    private dayId: string,
    private newAttractions: PlanAttractionViewModel[]
  ) {
    this.previousPlan = currentPlan;
  }

  async execute(): Promise<void> {
    const updatedPlan = {
      ...this.currentPlan,
      planDays: this.currentPlan.planDays.map((day) => {
        if (day.id === this.dayId) {
          return { ...day, attractions: this.newAttractions };
        }
        return day;
      }),
    };

    await PlanService.updatePlan(this.planId, {
      content: preparePlanContentForAPI(updatedPlan),
    });
  }

  async undo(): Promise<void> {
    const previousDay = this.previousPlan.planDays.find((day) => day.id === this.dayId);
    if (!previousDay) return;

    const updatedPlan = {
      ...this.currentPlan,
      planDays: this.currentPlan.planDays.map((day) => {
        if (day.id === this.dayId) {
          return { ...day, attractions: previousDay.attractions };
        }
        return day;
      }),
    };

    await PlanService.updatePlan(this.planId, {
      content: preparePlanContentForAPI(updatedPlan),
    });
  }
}

export class RemoveAttractionCommand implements PlanCommand {
  private previousPlan: PlanViewModel;

  constructor(
    private planId: string,
    private currentPlan: PlanViewModel,
    private dayId: string,
    private attractionId: string
  ) {
    this.previousPlan = currentPlan;
  }

  async execute(): Promise<void> {
    const updatedPlan = {
      ...this.currentPlan,
      planDays: this.currentPlan.planDays.map((day) => {
        if (day.id === this.dayId) {
          return {
            ...day,
            attractions: day.attractions.filter((attr) => attr.id !== this.attractionId),
          };
        }
        return day;
      }),
    };

    await PlanService.updatePlan(this.planId, {
      content: preparePlanContentForAPI(updatedPlan),
    });
  }

  async undo(): Promise<void> {
    const previousDay = this.previousPlan.planDays.find((day) => day.id === this.dayId);
    if (!previousDay) return;

    const attractionToRestore = previousDay.attractions.find((attr) => attr.id === this.attractionId);
    if (!attractionToRestore) return;

    const updatedPlan = {
      ...this.currentPlan,
      planDays: this.currentPlan.planDays.map((day) => {
        if (day.id === this.dayId) {
          return {
            ...day,
            attractions: [...day.attractions, attractionToRestore],
          };
        }
        return day;
      }),
    };

    await PlanService.updatePlan(this.planId, {
      content: preparePlanContentForAPI(updatedPlan),
    });
  }
}

export class UpdateAttractionNoteCommand implements PlanCommand {
  private previousPlan: PlanViewModel;

  constructor(
    private planId: string,
    private currentPlan: PlanViewModel,
    private dayId: string,
    private attractionId: string,
    private newNote: string
  ) {
    this.previousPlan = currentPlan;
  }

  async execute(): Promise<void> {
    const updatedPlan = {
      ...this.currentPlan,
      planDays: this.currentPlan.planDays.map((day) => {
        if (day.id === this.dayId) {
          return {
            ...day,
            attractions: day.attractions.map((attr) => {
              if (attr.id === this.attractionId) {
                return { ...attr, note: this.newNote };
              }
              return attr;
            }),
          };
        }
        return day;
      }),
    };

    await PlanService.updatePlan(this.planId, {
      content: preparePlanContentForAPI(updatedPlan),
    });
  }

  async undo(): Promise<void> {
    const previousDay = this.previousPlan.planDays.find((day) => day.id === this.dayId);
    if (!previousDay) return;

    const previousAttraction = previousDay.attractions.find((attr) => attr.id === this.attractionId);
    if (!previousAttraction) return;

    const updatedPlan = {
      ...this.currentPlan,
      planDays: this.currentPlan.planDays.map((day) => {
        if (day.id === this.dayId) {
          return {
            ...day,
            attractions: day.attractions.map((attr) => {
              if (attr.id === this.attractionId) {
                return { ...attr, note: previousAttraction.note };
              }
              return attr;
            }),
          };
        }
        return day;
      }),
    };

    await PlanService.updatePlan(this.planId, {
      content: preparePlanContentForAPI(updatedPlan),
    });
  }
}
