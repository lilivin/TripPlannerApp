import { type PlanDayViewModel, type PlanAttractionViewModel } from "./hooks/usePlanPreview";
import PlanDayList from "./PlanDayList";
import PlanMapView from "./PlanMapView";

interface PlanPreviewViewProps {
  planDays: PlanDayViewModel[];
  isListView: boolean;
  onAttractionChange: (dayId: string, attractions: PlanAttractionViewModel[]) => void;
  onAttractionRemove: (dayId: string, attractionId: string) => void;
  onNoteChange: (dayId: string, attractionId: string, note: string) => void;
}

export default function PlanPreviewView({
  planDays,
  isListView,
  onAttractionChange,
  onAttractionRemove,
  onNoteChange,
}: PlanPreviewViewProps) {
  // Show either list view or map view based on isListView prop
  return (
    <div className="w-full">
      {isListView ? (
        <PlanDayList
          planDays={planDays}
          onAttractionChange={onAttractionChange}
          onAttractionRemove={onAttractionRemove}
          onNoteChange={onNoteChange}
        />
      ) : (
        <PlanMapView
          planDays={planDays}
          onMarkerClick={(attractionId: string) => {
            // Find the attraction and scroll to it
            const dayElement = document.getElementById(`attraction-${attractionId}`);
            if (dayElement) {
              dayElement.scrollIntoView({ behavior: "smooth", block: "center" });
              // Highlight the element temporarily
              dayElement.classList.add("highlight-attraction");
              setTimeout(() => {
                dayElement.classList.remove("highlight-attraction");
              }, 2000);
            }
          }}
        />
      )}
    </div>
  );
}
