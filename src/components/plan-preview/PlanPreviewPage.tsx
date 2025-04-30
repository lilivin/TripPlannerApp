import { useState, useEffect } from "react";
import { type GeneratePlanResponse, type GuideMinimalDto } from "@/types";
import PlanPreviewHeader from "./PlanPreviewHeader";
import PlanPreviewActions from "./PlanPreviewActions";
import PlanPreviewView from "./PlanPreviewView";
import PlanSaveDialog from "./PlanSaveDialog";
import { usePlanPreview } from "./hooks/usePlanPreview";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";

interface PlanPreviewPageProps {
  guideId: string;
}

export default function PlanPreviewPage({ guideId }: PlanPreviewPageProps) {
  // We need to get the generated plan data from localStorage or session storage
  // where it was stored after generation
  const [generationResponse, setGenerationResponse] = useState<GeneratePlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize from local storage on component mount
  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem(`generated_plan_${guideId}`);

      if (storedPlan) {
        const parsedPlan = JSON.parse(storedPlan);
        setGenerationResponse(parsedPlan);
      } else {
        setLoadError("Could not find generated plan data. Please try generating the plan again.");
      }
    } catch (error) {
      console.error("Error loading plan from localStorage:", error);
      setLoadError("Failed to load generated plan. Please try generating the plan again.");
    } finally {
      setIsLoading(false);
    }
  }, [guideId]);

  // If still loading or no data, show loading state
  if (isLoading) {
    return <LoadingState message="Loading plan preview..." />;
  }

  // If error loading data, show error state
  if (loadError || !generationResponse) {
    return <ErrorState code={404} message={loadError || "No plan data found"} />;
  }

  return <PlanPreviewContent guideId={guideId} generationResponse={generationResponse} />;
}

// Separate component to use the usePlanPreview hook after data is loaded
function PlanPreviewContent({
  guideId,
  generationResponse,
}: {
  guideId: string;
  generationResponse: GeneratePlanResponse;
}) {
  const {
    planViewModel,
    isListView,
    error,
    isSaving,
    saveDialogOpen,
    setIsListView,
    setSaveDialogOpen,
    handleAttractionOrderChange,
    handleAttractionRemove,
    handleNoteChange,
    handleSave,
  } = usePlanPreview(guideId, generationResponse);

  if (error) {
    return <ErrorState code={500} message={error} />;
  }

  if (!planViewModel) {
    return <LoadingState message="Preparing plan preview..." />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PlanPreviewHeader guide={planViewModel.guide} generationParams={planViewModel.generationParams} />

      <PlanPreviewActions
        onSave={() => setSaveDialogOpen(true)}
        onRegenerateClick={() => window.history.back()}
        onModifyParams={() => window.history.back()}
        onViewToggle={() => setIsListView(!isListView)}
        isListView={isListView}
        canSave={planViewModel.planDays.some((day) => day.attractions.length > 0)}
      />

      <PlanPreviewView
        planDays={planViewModel.planDays}
        isListView={isListView}
        onAttractionChange={handleAttractionOrderChange}
        onAttractionRemove={handleAttractionRemove}
        onNoteChange={handleNoteChange}
      />

      {saveDialogOpen && (
        <PlanSaveDialog
          isOpen={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
