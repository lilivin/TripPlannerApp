import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Clock, Trash2, GripVertical, ChevronDown, ChevronUp, Edit, Check } from "lucide-react";
import type { PlanAttractionViewModel } from "@/types/plan-view";

interface PlanAttractionItemProps {
  attraction: PlanAttractionViewModel;
  onRemove: () => void;
  onNoteChange: (note: string) => void;
}

export function PlanAttractionItem({ attraction, onRemove, onNoteChange }: PlanAttractionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(attraction.note);

  // Formatowanie czasu
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    try {
      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return timeString;
    }
  };

  // Obsługa zapisywania notatki
  const handleSaveNote = () => {
    onNoteChange(noteValue);
    setIsEditingNote(false);
  };

  // Obsługa anulowania edycji notatki
  const handleCancelNoteEdit = () => {
    setNoteValue(attraction.note);
    setIsEditingNote(false);
  };

  return (
    <Card className="relative hover:shadow-md transition-shadow">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-30 cursor-grab">
        <GripVertical className="h-5 w-5" />
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="pt-4 pb-2 pl-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-base">{attraction.name}</h3>

              <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {formatTime(attraction.startTime)} - {formatTime(attraction.endTime)}
                  </span>
                </div>

                {attraction.address && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate max-w-xs">{attraction.address}</span>
                  </div>
                )}
              </div>
            </div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardContent>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-2 pl-10">
            {attraction.description && <p className="text-sm mb-3">{attraction.description}</p>}

            <div className="bg-muted/50 rounded-md p-3 mt-2 mb-1">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium">Notes</h4>

                {!isEditingNote && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 -mt-1 -mr-1"
                    onClick={() => setIsEditingNote(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <Textarea
                    value={noteValue}
                    onChange={(e) => setNoteValue(e.target.value)}
                    placeholder="Add your notes about this attraction..."
                    className="min-h-[80px] text-sm"
                  />

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancelNoteEdit}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveNote}>
                      <Check className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {attraction.note || "No notes yet. Click edit to add your own notes."}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-0 pb-3 pl-10">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onRemove}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Remove
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
