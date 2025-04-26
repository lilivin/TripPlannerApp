import type { PlanViewModel } from "@/types/plan-view";
import { Calendar, MapPin, User } from "lucide-react";

interface PlanHeaderProps {
  plan: PlanViewModel;
}

export function PlanHeader({ plan }: PlanHeaderProps) {
  // Obliczanie liczby dni w planie
  const daysCount = plan.planDays.length;

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{plan.name}</h1>

      <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{plan.guide.location_name}</span>
        </div>

        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>
            {daysCount} {daysCount === 1 ? "day" : "days"}
          </span>
        </div>

        <div className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          <span>Created from guide: {plan.guide.title}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(plan.updated_at).toLocaleDateString()}
        </div>

        {plan.is_favorite && (
          <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">Favorite</div>
        )}
      </div>
    </div>
  );
}
