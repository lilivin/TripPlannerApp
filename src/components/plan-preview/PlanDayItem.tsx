import { useState } from "react";
import { type PlanDayViewModel, type PlanAttractionViewModel } from "./hooks/usePlanPreview";
import PlanAttractionItem from "./PlanAttractionItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface PlanDayItemProps {
  day: PlanDayViewModel;
  onAttractionChange: (attractions: PlanAttractionViewModel[]) => void;
  onAttractionRemove: (attractionId: string) => void;
  onNoteChange: (attractionId: string, note: string) => void;
}

export default function PlanDayItem({ day, onAttractionChange, onAttractionRemove, onNoteChange }: PlanDayItemProps) {
  // Set up DnD sensors for mouse, touch, and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle the end of a drag operation
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = day.attractions.findIndex((item) => item.id === active.id);
      const newIndex = day.attractions.findIndex((item) => item.id === over.id);

      // Create a new array with the updated order
      const newAttractions = arrayMove(day.attractions, oldIndex, newIndex);

      // Call the parent component's handler with the updated attractions
      onAttractionChange(newAttractions);
    }
  };

  // If no attractions, show empty state
  if (day.attractions.length === 0) {
    return (
      <div className="text-center p-6 border border-dashed rounded-md">
        <p className="text-muted-foreground">No attractions for this day.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={day.attractions.map((attraction) => attraction.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {day.attractions.map((attraction, index) => (
            <PlanAttractionItem
              key={attraction.id}
              attraction={attraction}
              onRemove={() => onAttractionRemove(attraction.id)}
              onNoteChange={(note: string) => onNoteChange(attraction.id, note)}
              isFirst={index === 0}
              isLast={index === day.attractions.length - 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
