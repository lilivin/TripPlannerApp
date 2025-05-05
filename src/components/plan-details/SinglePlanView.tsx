import { PlanHeader } from "./PlanHeader";
import { PlanActions } from "./PlanActions";
import { PlanViewToggle } from "./PlanViewToggle";
import { EditPlanDialog } from "./EditPlanDialog";
import { useSinglePlan } from "./hooks/useSinglePlan";
import { usePlanOfflineSync } from "./hooks/usePlanOfflineSync";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SinglePlanViewProps {
  planId: string;
}

export default function SinglePlanView({ planId }: SinglePlanViewProps) {
  const {
    plan,
    isLoading,
    error,
    isListView,
    editDialogOpen,
    setIsListView,
    setEditDialogOpen,
    handleAttractionOrderChange,
    handleAttractionRemove,
    handleNoteChange,
    handleEditPlan,
  } = useSinglePlan(planId);

  const {
    isAvailableOffline,
    isLoading: _isOfflineLoading,
    error: _offlineError,
    toggleOfflineAvailability,
  } = usePlanOfflineSync(planId);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 my-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-3xl my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!plan) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-3xl my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>
          The requested plan could not be found. It may have been deleted or you don&apos;t have permission to view it.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <PlanHeader plan={plan} />

      <PlanActions
        onViewToggle={() => setIsListView(!isListView)}
        onEdit={() => setEditDialogOpen(true)}
        onOfflineToggle={toggleOfflineAvailability}
        isListView={isListView}
        isOfflineAvailable={isAvailableOffline}
      />

      <PlanViewToggle
        planDays={plan.planDays}
        isListView={isListView}
        onAttractionChange={handleAttractionOrderChange}
        onAttractionRemove={handleAttractionRemove}
        onNoteChange={handleNoteChange}
      />

      <EditPlanDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditPlan}
        initialData={{ name: plan.name, is_favorite: plan.is_favorite }}
      />
    </div>
  );
}
