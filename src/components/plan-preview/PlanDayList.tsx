import { type PlanDayViewModel, type PlanAttractionViewModel } from "./hooks/usePlanPreview";
import PlanDayItem from "./PlanDayItem";

interface PlanDayListProps {
  planDays: PlanDayViewModel[];
  onAttractionChange: (dayId: string, attractions: PlanAttractionViewModel[]) => void;
  onAttractionRemove: (dayId: string, attractionId: string) => void;
  onNoteChange: (dayId: string, attractionId: string, note: string) => void;
}

export default function PlanDayList({
  planDays,
  onAttractionChange,
  onAttractionRemove,
  onNoteChange,
}: PlanDayListProps) {
  // If no days, show an empty state
  if (planDays.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No days in this plan. Try generating a new plan.</p>
      </div>
    );
  }

  // Format date to display in a more readable format (e.g., "Monday, January 1")
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    } catch (_) {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      {planDays.map((day) => (
        <div key={day.id} id={`day-${day.id}`} className="space-y-2">
          <div className="flex items-end justify-between border-b pb-2">
            <h2 className="text-xl font-semibold">
              Day {day.dayNumber}
              <span className="ml-2 text-sm font-normal text-muted-foreground">{formatDate(day.date)}</span>
            </h2>
            <div className="text-sm text-muted-foreground">
              {day.attractions.length} {day.attractions.length === 1 ? "attraction" : "attractions"}
            </div>
          </div>

          <PlanDayItem
            day={day}
            onAttractionChange={(attractions: PlanAttractionViewModel[]) => onAttractionChange(day.id, attractions)}
            onAttractionRemove={(attractionId: string) => onAttractionRemove(day.id, attractionId)}
            onNoteChange={(attractionId: string, note: string) => onNoteChange(day.id, attractionId, note)}
          />
        </div>
      ))}
    </div>
  );
}
