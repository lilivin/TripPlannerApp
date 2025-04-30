import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DaysInput from "./DaysInput";
import TimeRangeInput from "./TimeRangeInput";
import TagsSelectInput from "./TagsSelectInput";
import TransportationModeSelect from "./TransportationModeSelect";
import MealsToggle from "./MealsToggle";
import LoadingOverlay from "../common/LoadingOverlay";
import type { TagDto } from "../types";
import type { GeneratePlanFormData, GeneratePlanFormErrors } from "../../types/plan";

interface GeneratePlanFormProps {
  guideId: string;
  availableTags: TagDto[];
  onSubmit: (data: GeneratePlanFormData) => Promise<void>;
  isLoading: boolean;
  formData: GeneratePlanFormData;
  errors: GeneratePlanFormErrors;
  updateField: (field: string, value: any) => void;
  updatePreference: (field: string, value: any) => void;
}

const GeneratePlanForm: React.FC<GeneratePlanFormProps> = ({
  guideId,
  availableTags,
  onSubmit,
  isLoading,
  formData,
  errors,
  updateField,
  updatePreference,
}) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Parametry generowania planu</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Days Input */}
            <DaysInput value={formData.days} onChange={(value) => updateField("days", value)} error={errors.days} />

            {/* Time Range Input */}
            <TimeRangeInput
              startTime={formData.preferences.start_time}
              endTime={formData.preferences.end_time}
              onStartTimeChange={(value) => updatePreference("start_time", value)}
              onEndTimeChange={(value) => updatePreference("end_time", value)}
              startError={errors.start_time}
              endError={errors.end_time}
              rangeError={errors.timeRange}
            />

            {/* Include Tags */}
            <TagsSelectInput
              availableTags={availableTags}
              selectedTagIds={formData.preferences.include_tags}
              onChange={(value) => updatePreference("include_tags", value)}
              label="Atrakcje do uwzględnienia"
              placeholder="Wyszukaj tagi atrakcji, które chcesz uwzględnić..."
            />

            {/* Exclude Tags */}
            <TagsSelectInput
              availableTags={availableTags}
              selectedTagIds={formData.preferences.exclude_tags}
              onChange={(value) => updatePreference("exclude_tags", value)}
              label="Atrakcje do wykluczenia"
              placeholder="Wyszukaj tagi atrakcji, które chcesz wykluczyć..."
            />

            {/* Transportation Mode */}
            <TransportationModeSelect
              value={formData.preferences.transportation_mode}
              onChange={(value) => updatePreference("transportation_mode", value)}
              error={errors.transportation_mode}
            />

            {/* Meals Toggle */}
            <MealsToggle
              value={formData.preferences.include_meals}
              onChange={(value) => updatePreference("include_meals", value)}
            />

            {/* General error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading} size="lg">
              Generuj plan
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default GeneratePlanForm;
