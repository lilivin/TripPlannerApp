import React, { useEffect } from "react";
import GeneratePlanForm from "./GeneratePlanForm";
import useGeneratePlanForm from "./hooks/useGeneratePlanForm";
import type { TagDto } from "../types";
import type { GeneratePlanFormData, GeneratePlanResponse } from "../../types/plan";

interface GeneratePlanFormWrapperProps {
  guideId: string;
  availableTags: TagDto[];
  guideTitle: string;
}

const GeneratePlanFormWrapper: React.FC<GeneratePlanFormWrapperProps> = ({ guideId, availableTags, guideTitle }) => {
  // Initialize form hook
  const formHook = useGeneratePlanForm(guideId, availableTags);

  // Handle form submission
  const handleSubmit = async (data: GeneratePlanFormData) => {
    try {
      const response = await formHook.submitForm();

      if (response) {
        // Create a new plan from the response
        const planResponse = await createPlan(response);

        if (planResponse && planResponse.id) {
          // Dispatch custom event for Astro to handle navigation
          const event = new CustomEvent("plan-created", {
            detail: { planId: planResponse.id },
          });
          document.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.error("Błąd podczas tworzenia planu:", error);
    }
  };

  // Create plan in database
  const createPlan = async (generatedPlan: GeneratePlanResponse): Promise<{ id: string } | null> => {
    try {
      const planData = {
        name: `${guideTitle} - Plan na ${formHook.formData.days} ${formHook.formData.days === 1 ? "dzień" : "dni"}`,
        guide_id: guideId,
        content: generatedPlan.content,
        generation_params: generatedPlan.generation_params,
        is_favorite: false,
      };

      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Błąd podczas zapisywania planu:", error);
      return null;
    }
  };

  return (
    <GeneratePlanForm
      guideId={guideId}
      availableTags={availableTags}
      onSubmit={handleSubmit}
      isLoading={formHook.isLoading}
      formData={formHook.formData}
      errors={formHook.errors}
      updateField={formHook.updateField}
      updatePreference={formHook.updatePreference}
    />
  );
};

export default GeneratePlanFormWrapper;
