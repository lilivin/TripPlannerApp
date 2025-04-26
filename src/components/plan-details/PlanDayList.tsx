import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanDayItem } from "./PlanDayItem";
import type { PlanDayViewModel, PlanAttractionViewModel } from "@/types/plan-view";

interface PlanDayListProps {
  planDays: PlanDayViewModel[];
  onAttractionChange: (dayId: string, attractions: PlanAttractionViewModel[]) => void;
  onAttractionRemove: (dayId: string, attractionId: string) => void;
  onNoteChange: (dayId: string, attractionId: string, note: string) => void;
}

export function PlanDayList({ planDays, onAttractionChange, onAttractionRemove, onNoteChange }: PlanDayListProps) {
  const [activeDay, setActiveDay] = useState<string>(planDays[0]?.id || "");

  // Gdy zmieni się planDays, upewnij się, że aktywny dzień istnieje
  if (activeDay && !planDays.some((day) => day.id === activeDay) && planDays.length > 0) {
    setActiveDay(planDays[0].id);
  }

  // Obsługi dla konkretnego dnia
  const handleAttractionChangeForDay = (dayId: string) => (attractions: PlanAttractionViewModel[]) => {
    onAttractionChange(dayId, attractions);
  };

  const handleAttractionRemoveForDay = (dayId: string) => (attractionId: string) => {
    onAttractionRemove(dayId, attractionId);
  };

  const handleNoteChangeForDay = (dayId: string) => (attractionId: string, note: string) => {
    onNoteChange(dayId, attractionId, note);
  };

  if (planDays.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        This plan doesn&apos;t have any days or attractions yet.
      </div>
    );
  }

  return (
    <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
      <TabsList className="mb-4 flex w-full overflow-x-auto">
        {planDays.map((day) => (
          <TabsTrigger key={day.id} value={day.id} className="flex-1">
            Day {day.dayNumber} - {new Date(day.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </TabsTrigger>
        ))}
      </TabsList>

      {planDays.map((day) => (
        <TabsContent key={day.id} value={day.id} className="mt-0">
          <PlanDayItem
            day={day}
            onAttractionChange={handleAttractionChangeForDay(day.id)}
            onAttractionRemove={handleAttractionRemoveForDay(day.id)}
            onNoteChange={handleNoteChangeForDay(day.id)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
