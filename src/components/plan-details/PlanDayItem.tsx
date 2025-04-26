import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlanAttractionItem } from "./PlanAttractionItem";
import type { PlanDayViewModel, PlanAttractionViewModel } from "@/types/plan-view";

interface PlanDayItemProps {
  day: PlanDayViewModel;
  onAttractionChange: (attractions: PlanAttractionViewModel[]) => void;
  onAttractionRemove: (attractionId: string) => void;
  onNoteChange: (attractionId: string, note: string) => void;
}

// Komponent dla sortowalnej atrakcji
function SortableAttractionItem({
  attraction,
  onRemove,
  onNoteChange,
}: {
  attraction: PlanAttractionViewModel;
  onRemove: () => void;
  onNoteChange: (note: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: attraction.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PlanAttractionItem attraction={attraction} onRemove={onRemove} onNoteChange={onNoteChange} />
    </div>
  );
}

export function PlanDayItem({ day, onAttractionChange, onAttractionRemove, onNoteChange }: PlanDayItemProps) {
  // Formatowanie daty
  const formattedDate = new Date(day.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Konfiguracja sensorów dla systemu drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Minimalna odległość do aktywacji przeciągania
      },
    })
  );

  // Obsługa zakończenia przeciągania i upuszczania
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Znajdź indeksy elementów, które zostały zamienione
      const oldIndex = day.attractions.findIndex((attraction) => attraction.id === active.id);
      const newIndex = day.attractions.findIndex((attraction) => attraction.id === over?.id);

      if (newIndex !== -1) {
        // Stwórz nową tablicę z przemieszczoną atrakcją
        const newAttractions = [...day.attractions];
        const [movedItem] = newAttractions.splice(oldIndex, 1);
        newAttractions.splice(newIndex, 0, movedItem);

        // Wywołaj funkcję zmiany kolejności
        onAttractionChange(newAttractions);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Day {day.dayNumber} - {formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {day.attractions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No attractions planned for this day.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={day.attractions.map((attraction) => attraction.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {day.attractions.map((attraction) => (
                  <SortableAttractionItem
                    key={attraction.id}
                    attraction={attraction}
                    onRemove={() => onAttractionRemove(attraction.id)}
                    onNoteChange={(note: string) => onNoteChange(attraction.id, note)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}
