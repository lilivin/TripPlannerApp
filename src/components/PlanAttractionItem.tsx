import { useState } from "react";
import { type PlanAttractionViewModel } from "./hooks/usePlanPreview";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, Clock, Trash2, Edit2, Grip, ArrowDown } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AttractionActions from "./AttractionActions";
import AttractionNotes from "./AttractionNotes";

interface PlanAttractionItemProps {
  attraction: PlanAttractionViewModel;
  onRemove: () => void;
  onNoteChange: (note: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function PlanAttractionItem({
  attraction,
  onRemove,
  onNoteChange,
  isFirst,
  isLast,
}: PlanAttractionItemProps) {
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Set up sortable functionality
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: attraction.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  // Format time to be more readable
  const formatTime = (time: string) => {
    if (!time) return "";
    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (_) {
      return time;
    }
  };

  // Calculate duration in a readable format
  const formatDuration = (minutes: number) => {
    if (!minutes) return "";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${remainingMinutes}m`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`attraction-${attraction.id}`}
      className={`
        relative rounded-lg border p-4 shadow-sm transition-colors
        ${isDragging ? "bg-muted" : "bg-card"}
        ${isFirst ? "border-t-4 border-t-primary" : ""}
      `}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute right-2 top-4 cursor-grab text-muted-foreground hover:text-foreground"
      >
        <Grip className="h-5 w-5" />
      </div>

      <div className="grid gap-2">
        {/* Time and duration */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>
            {formatTime(attraction.startTime)} - {formatTime(attraction.endTime)}
          </span>
          {attraction.visitDuration > 0 && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {formatDuration(attraction.visitDuration)}
            </span>
          )}
        </div>

        {/* Attraction name and description */}
        <div className="space-y-1 pr-6">
          <h3 className="font-medium leading-none">{attraction.name}</h3>
          {attraction.description && <p className="text-sm text-muted-foreground">{attraction.description}</p>}
        </div>

        {/* Address */}
        {attraction.address && (
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{attraction.address}</span>
          </div>
        )}

        {/* Transport to next */}
        {attraction.transportToNext && !isLast && (
          <div className="mt-2 pt-2 border-t flex items-center text-sm text-muted-foreground">
            <ArrowDown className="mr-1 h-4 w-4" />
            <span className="font-medium">
              {attraction.transportToNext.mode.charAt(0).toUpperCase() + attraction.transportToNext.mode.slice(1)} -{" "}
              {formatDuration(attraction.transportToNext.duration)}
            </span>
            {attraction.transportToNext.description && (
              <span className="ml-1">{attraction.transportToNext.description}</span>
            )}
          </div>
        )}

        {/* Notes section */}
        {(attraction.note || isEditingNote) && (
          <div className="mt-2 pt-2 border-t">
            <AttractionNotes
              note={attraction.note}
              onNoteChange={onNoteChange}
              isEditing={isEditingNote}
              onEditingToggle={() => setIsEditingNote(!isEditingNote)}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <AttractionActions onRemove={onRemove} onEditNote={() => setIsEditingNote(true)} hasNote={!!attraction.note} />
    </div>
  );
}
