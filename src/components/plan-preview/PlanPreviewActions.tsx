import { Button } from "@/components/ui/button";
import { MapPin, List, Save, RefreshCw, Settings } from "lucide-react";

interface PlanPreviewActionsProps {
  onSave: () => void;
  onRegenerateClick: () => void;
  onModifyParams: () => void;
  onViewToggle: () => void;
  isListView: boolean;
  canSave: boolean;
}

export default function PlanPreviewActions({
  onSave,
  onRegenerateClick,
  onModifyParams,
  onViewToggle,
  isListView,
  canSave,
}: PlanPreviewActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-between items-center">
      <div className="flex flex-wrap gap-2">
        <Button variant="default" onClick={onSave} disabled={!canSave} className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          Save Plan
        </Button>

        <Button variant="outline" onClick={onRegenerateClick} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>

        <Button variant="outline" onClick={onModifyParams} className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          Modify Parameters
        </Button>
      </div>

      <Button variant="ghost" onClick={onViewToggle} className="flex items-center gap-1">
        {isListView ? (
          <>
            <MapPin className="h-4 w-4" />
            Map View
          </>
        ) : (
          <>
            <List className="h-4 w-4" />
            List View
          </>
        )}
      </Button>
    </div>
  );
}
