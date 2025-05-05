import { useState, useEffect, useCallback } from "react";
import type { TagDto } from "../../types";
import type { GeneratePlanFormData, GeneratePlanFormErrors, GeneratePlanResponse } from "../../types/plan";

const useGeneratePlanForm = (guideId: string, _availableTags: TagDto[]) => {
  // Initial form data
  const getInitialFormData = (): GeneratePlanFormData => ({
    guide_id: guideId,
    days: 1,
    preferences: {
      include_tags: [],
      exclude_tags: [],
      start_time: "09:00",
      end_time: "18:00",
      include_meals: true,
      transportation_mode: "walking",
    },
  });

  // Form state
  const [formData, setFormData] = useState<GeneratePlanFormData>(getInitialFormData());
  const [errors, setErrors] = useState<GeneratePlanFormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Field update handler
  const updateField = (field: keyof GeneratePlanFormData, value: GeneratePlanFormData[keyof GeneratePlanFormData]) => {
    setFormData((prev: GeneratePlanFormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Preference update handler
  const updatePreference = (
    field: keyof GeneratePlanFormData["preferences"],
    value: GeneratePlanFormData["preferences"][keyof GeneratePlanFormData["preferences"]]
  ) => {
    setFormData((prev: GeneratePlanFormData) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: GeneratePlanFormErrors = {};

    // Validate days
    if (!formData.days || formData.days < 1 || formData.days > 30 || !Number.isInteger(formData.days)) {
      newErrors.days = "Liczba dni musi być liczbą całkowitą od 1 do 30";
    }

    // Validate time range
    const startTime = formData.preferences.start_time;
    const endTime = formData.preferences.end_time;

    if (!startTime || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
      newErrors.start_time = "Nieprawidłowy format czasu";
    }

    if (!endTime || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(endTime)) {
      newErrors.end_time = "Nieprawidłowy format czasu";
    }

    if (startTime && endTime) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      if (endMinutes <= startMinutes) {
        newErrors.timeRange = "Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia";
      }
    }

    // Validate transportation mode
    if (!["walking", "public_transport", "car", "bicycle"].includes(formData.preferences.transportation_mode)) {
      newErrors.transportation_mode = "Nieprawidłowy środek transportu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const submitForm = async (): Promise<GeneratePlanResponse | null> => {
    if (!validateForm()) {
      return null;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/plans/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Błąd podczas generowania planu:", error);
      setErrors({ general: error instanceof Error ? error.message : "Wystąpił błąd podczas generowania planu" });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // LocalStorage handling
  const localStorageKey = `plan_form_${guideId}`;

  const saveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(formData));
    } catch (error) {
      console.error("Błąd podczas zapisywania do localStorage:", error);
    }
  }, [formData, localStorageKey]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        const parsedData = JSON.parse(saved) as GeneratePlanFormData;
        setFormData(parsedData);
      }
    } catch (error) {
      console.error("Błąd podczas ładowania z localStorage:", error);
    }
  }, [localStorageKey]);

  // Effects
  useEffect(() => {
    loadFromLocalStorage();
  }, [guideId, loadFromLocalStorage]);

  useEffect(() => {
    saveToLocalStorage();
  }, [formData, saveToLocalStorage]);

  return {
    formData,
    errors,
    isLoading,
    updateField,
    updatePreference,
    validateForm,
    submitForm,
  };
};

export default useGeneratePlanForm;
