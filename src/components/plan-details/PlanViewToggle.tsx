import { PlanDayList } from "./PlanDayList";
import { PlanMapView } from "./PlanMapView";
import type { PlanDayViewModel, PlanAttractionViewModel } from "@/types/plan-view";

interface PlanViewToggleProps {
  planDays: PlanDayViewModel[];
  isListView: boolean;
  onAttractionChange: (dayId: string, attractions: PlanAttractionViewModel[]) => void;
  onAttractionRemove: (dayId: string, attractionId: string) => void;
  onNoteChange: (dayId: string, attractionId: string, note: string) => void;
}

export function PlanViewToggle({
  planDays,
  isListView,
  onAttractionChange,
  onAttractionRemove,
  onNoteChange,
}: PlanViewToggleProps) {
  // Funkcja do obsługi kliknięcia na marker mapy
  const handleMarkerClick = (attractionId: string) => {
    // Znajdź dzień i atrakcję, aby pokazać szczegóły
    for (const day of planDays) {
      const attraction = day.attractions.find((a) => a.id === attractionId);
      if (attraction) {
        // Tu można zaimplementować pokazywanie szczegółów atrakcji
        console.log("Clicked attraction:", attraction);
        break;
      }
    }
  };

  return (
    <div className="mt-6">
      {isListView ? (
        <PlanDayList
          planDays={planDays}
          onAttractionChange={onAttractionChange}
          onAttractionRemove={onAttractionRemove}
          onNoteChange={onNoteChange}
        />
      ) : (
        <PlanMapView planDays={planDays} onMarkerClick={handleMarkerClick} />
      )}
    </div>
  );
}
