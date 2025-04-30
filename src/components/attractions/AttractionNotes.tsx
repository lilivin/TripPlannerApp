import { useState, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Save, X } from "lucide-react";

interface AttractionNotesProps {
  note: string;
  onNoteChange: (note: string) => void;
  isEditing: boolean;
  onEditingToggle: () => void;
}

export default function AttractionNotes({ note, onNoteChange, isEditing, onEditingToggle }: AttractionNotesProps) {
  const [editedNote, setEditedNote] = useState(note);
  const MAX_NOTE_LENGTH = 500;

  // Update edited note when the note prop changes
  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  // Handle note save
  const handleSave = () => {
    onNoteChange(editedNote);
    onEditingToggle();
  };

  // Handle cancel editing
  const handleCancel = () => {
    setEditedNote(note);
    onEditingToggle();
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="attraction-note" className="text-sm font-medium flex items-center">
            <StickyNote className="h-4 w-4 mr-1" />
            Note
          </label>
          <span className="text-xs text-muted-foreground">
            {editedNote.length}/{MAX_NOTE_LENGTH}
          </span>
        </div>

        <Textarea
          id="attraction-note"
          value={editedNote}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            // Limit input to max length
            if (e.target.value.length <= MAX_NOTE_LENGTH) {
              setEditedNote(e.target.value);
            }
          }}
          placeholder="Add a note about this attraction..."
          className="resize-none min-h-[100px]"
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={handleCancel} className="flex items-center gap-1">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleSave} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  // Display the note in view mode
  return (
    <div className="text-sm space-y-1">
      <div className="flex items-center text-muted-foreground">
        <StickyNote className="h-4 w-4 mr-1" />
        <span className="font-medium">Note</span>
      </div>
      <p className="pl-5 whitespace-pre-wrap">{note}</p>
    </div>
  );
}
