import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { List, Map, Edit2, Download, Wifi, WifiOff } from "lucide-react";

interface PlanActionsProps {
  onViewToggle: () => void;
  onEdit: () => void;
  onOfflineToggle: () => void;
  isListView: boolean;
  isOfflineAvailable: boolean;
}

export function PlanActions({
  onViewToggle,
  onEdit,
  onOfflineToggle,
  isListView,
  isOfflineAvailable,
}: PlanActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onViewToggle}>
              {isListView ? (
                <>
                  <Map className="h-4 w-4 mr-2" />
                  Map View
                </>
              ) : (
                <>
                  <List className="h-4 w-4 mr-2" />
                  List View
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch to {isListView ? "map" : "list"} view</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Plan
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit plan name and favorite status</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isOfflineAvailable ? "default" : "outline"}
              size="sm"
              onClick={onOfflineToggle}
              className={isOfflineAvailable ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isOfflineAvailable ? (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  Available Offline
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 mr-2" />
                  Save for Offline
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isOfflineAvailable ? "This plan is available offline" : "Save this plan for offline use"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export plan as PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
