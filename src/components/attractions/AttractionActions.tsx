import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AttractionActionsProps {
  onRemove: () => void;
  onEditNote: () => void;
  hasNote?: boolean;
}

export default function AttractionActions({ onRemove, onEditNote, hasNote = false }: AttractionActionsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex space-x-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onEditNote} className="h-8 w-8">
              <Edit2 className={`h-4 w-4 ${hasNote ? "text-primary" : ""}`} />
              <span className="sr-only">{hasNote ? "Edit note" : "Add note"}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{hasNote ? "Edit note" : "Add note"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove attraction</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove attraction</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
