import { useState, useEffect } from "react";
import type { GeneratePlanResponse, GuideMinimalDto, SavePlanFormData, CreatePlanCommand } from "@/types";
import type { AttractionDto } from "../../types";

// ViewModel interfaces
export interface GeneratedPlanViewModel {
  guide: GuideMinimalDto;
  generationParams: {
    days: number;
    preferences: {
      include_tags?: string[];
      exclude_tags?: string[];
      start_time?: string;
      end_time?: string;
      include_meals?: boolean;
      transportation_mode?: string;
    };
  };
  planDays: PlanDayViewModel[];
  aiGenerationCost: number | null;
  totalAttractions: number;
}

export interface PlanDayViewModel {
  id: string;
  date: string;
  dayNumber: number;
  attractions: PlanAttractionViewModel[];
}

export interface PlanAttractionViewModel extends AttractionDto {
  notes?: string;
  visitDuration: number;
  startTime: string;
  endTime: string;
  address: string;
  transportToNext?: {
    mode: string;
    duration: number;
    distance: number;
  };
}

export interface TransportInfoViewModel {
  mode: string;
  duration: number; // w minutach
  description?: string;
}

interface ApiAttraction {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  note: string;
  visitDuration: number;
  startTime: string;
  endTime: string;
  address: string;
  transportToNext?: {
    mode: string;
    duration: number;
    distance: number;
  };
}

interface ApiDay {
  id?: string;
  date?: string;
  dayNumber: number;
  attractions: ApiAttraction[];
}

interface ApiContent {
  days: ApiDay[];
  summary?: string;
}

interface PlanApiResponse {
  days: {
    dayNumber: number;
    attractions: {
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      location: {
        lat: number;
        lng: number;
      };
      note: string;
      visitDuration: number;
      startTime: string;
      endTime: string;
      address: string;
      transportToNext?: {
        mode: string;
        duration: number;
        distance: number;
      };
    }[];
  }[];
  aiGenerationCost: number | null;
}

export function usePlanPreview(guideId: string, generationResponse: GeneratePlanResponse) {
  // State management
  const [planViewModel, setPlanViewModel] = useState<GeneratedPlanViewModel | null>(null);
  const [isListView, setIsListView] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data from the generation response
  useEffect(() => {
    try {
      // First, fetch the guide minimal information
      const fetchGuideInfo = async () => {
        try {
          const response = await fetch(`/api/guides/${guideId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch guide info: ${response.statusText}`);
          }
          const guideData = await response.json();

          // Wydziel minimalne informacje o przewodniku
          const guideMinimal: GuideMinimalDto = {
            id: guideData.id,
            title: guideData.title,
            location_name: guideData.location_name,
          };

          // Now map the response data to our view model
          const mappedViewModel = mapResponseToViewModel(generationResponse, guideMinimal);
          setPlanViewModel(mappedViewModel);

          // Save to localStorage as backup
          localStorage.setItem(`plan_preview_${guideId}`, JSON.stringify(mappedViewModel));
        } catch (err) {
          console.error("Error fetching guide info:", err);
          setError("Could not load guide information. Please try again.");
        }
      };

      fetchGuideInfo();
    } catch (err) {
      console.error("Error mapping generation response to view model:", err);
      setError("Could not prepare plan data. Please try generating the plan again.");
    }
  }, [guideId, generationResponse]);

  // Function to map API response to our view model
  const mapResponseToViewModel = (response: GeneratePlanResponse, guide: GuideMinimalDto): GeneratedPlanViewModel => {
    const content = response.content as unknown as { days: ApiDay[] };
    const generationParams = response.generation_params as {
      days: number;
      preferences: {
        include_tags?: string[];
        exclude_tags?: string[];
        start_time?: string;
        end_time?: string;
        include_meals?: boolean;
        transportation_mode?: string;
      };
    };

    let daysArray = content.days || [];
    if (!Array.isArray(daysArray)) {
      daysArray = [];
    }

    return {
      guide,
      generationParams,
      planDays: daysArray.map((day: ApiDay, index: number) => ({
        id: day.id || `day-${index + 1}`,
        date: day.date || new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        dayNumber: index + 1,
        attractions: (day.attractions || []).map((attraction: ApiAttraction) => ({
          id: attraction.id,
          name: attraction.name,
          description: attraction.description,
          imageUrl: attraction.imageUrl,
          location: attraction.location,
          notes: attraction.note,
          visitDuration: attraction.visitDuration,
          startTime: attraction.startTime,
          endTime: attraction.endTime,
          address: attraction.address,
          transportToNext: attraction.transportToNext,
        })),
      })),
      aiGenerationCost: response.ai_generation_cost,
      totalAttractions: daysArray.reduce((total: number, day: ApiDay) => total + (day.attractions?.length || 0), 0),
    };
  };

  // Parse markdown summary text into structured days with attractions
  const parseSummaryToDays = (
    summary: string,
    numberOfDays: number
  ): {
    id: string;
    date: string;
    dayNumber: number;
    attractions: {
      name: string;
      description: string;
      start_time: string;
      end_time: string;
      visit_duration: number;
      address: string;
    }[];
  }[] => {
    const days = [];

    // Try to split the summary by day headers
    const dayRegex = /####\s+Dzień\s+(\d+):/gi;
    const dayMatches = [...summary.matchAll(dayRegex)];

    // If we found day markers in the text
    if (dayMatches.length > 0) {
      // For each day match, extract content up to the next day or end
      for (let i = 0; i < dayMatches.length; i++) {
        const match = dayMatches[i];
        const dayNumber = parseInt(match[1], 10);
        const startPos = match.index;
        const endPos = i < dayMatches.length - 1 ? dayMatches[i + 1].index : summary.length;

        if (startPos !== undefined && endPos !== undefined) {
          const dayContent = summary.substring(startPos, endPos).trim();

          // Extract title from the day header line
          const titleMatch = dayContent.match(/####\s+Dzień\s+\d+:\s+(.+)/);
          const title = titleMatch ? titleMatch[1].trim() : `Dzień ${dayNumber}`;

          // Extract bullet points which are typically attractions
          // Format: - **09:00 - 10:00**: Śniadanie w kawiarni...
          const bulletRegex = /-\s+\*\*([^*]+)\*\*:(.*?)(?=\n-\s+\*\*|\n*$)/gs;
          const attractions = [];
          let bulletMatch;

          while ((bulletMatch = bulletRegex.exec(dayContent)) !== null) {
            const timeRange = bulletMatch[1].trim();
            const description = bulletMatch[2].trim();

            // Parse time range (e.g., "09:00 - 10:00")
            const timeMatch = timeRange.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
            const startTime = timeMatch ? timeMatch[1] : "";
            const endTime = timeMatch ? timeMatch[2] : "";

            // Create a sensible name from the description
            // Generally the first sentence or phrase describes what the attraction is
            const sentences = description.split(".");
            const name = sentences[0].trim() || description.substring(0, 50);

            attractions.push({
              name: name,
              description: description,
              start_time: startTime,
              end_time: endTime,
              visit_duration: calculateDurationInMinutes(startTime, endTime),
              address: "",
            });
          }

          // If we couldn't extract structured attractions, try another common format
          // Format with nested bullet points: - **10:00 - 13:00**: Zwiedzanie Pałacu...
          //   - Rozpocznij od wejścia...
          //   - Zobacz wystawy...
          if (attractions.length === 0) {
            const simpleBulletRegex = /-\s+\*\*([^*]+)\*\*:([^-]*(?:\n\s*-[^*]*)*)/gm;
            let simpleBulletMatch;

            while ((simpleBulletMatch = simpleBulletRegex.exec(dayContent)) !== null) {
              const timeRange = simpleBulletMatch[1].trim();
              const description = simpleBulletMatch[2].trim();

              // Parse time range (e.g., "09:00 - 10:00")
              const timeMatch = timeRange.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
              const startTime = timeMatch ? timeMatch[1] : "";
              const endTime = timeMatch ? timeMatch[2] : "";

              // Extract name - usually the first few words
              const firstLine = description.split("\n")[0].trim();
              const name = firstLine.substring(0, 50);

              attractions.push({
                name: name,
                description: description,
                start_time: startTime,
                end_time: endTime,
                visit_duration: calculateDurationInMinutes(startTime, endTime),
                address: "",
              });
            }
          }

          // If we still couldn't extract attractions, create one for the whole day
          if (attractions.length === 0) {
            attractions.push({
              name: title,
              description: dayContent.replace(/####\s+Dzień\s+\d+:.+\n/, "").trim(),
              start_time: "",
              end_time: "",
              visit_duration: 0,
              address: "",
            });
          }

          days.push({
            id: `day-${dayNumber}`,
            date: new Date(Date.now() + (dayNumber - 1) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            dayNumber: dayNumber,
            attractions: attractions,
          });
        }
      }
    } else {
      // If no day markers found, create basic structure based on number of days
      for (let i = 0; i < numberOfDays; i++) {
        days.push({
          id: `day-${i + 1}`,
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          dayNumber: i + 1,
          attractions: [
            {
              name: `Dzień ${i + 1}`,
              description: summary,
              start_time: "",
              end_time: "",
              visit_duration: 0,
              address: "",
            },
          ],
        });
      }
    }

    return days;
  };

  // Helper function to calculate duration between two time strings in minutes
  const calculateDurationInMinutes = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) return 0;

    let durationMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight

    return durationMinutes;
  };

  // Handle attraction order change within a day
  const handleAttractionOrderChange = (dayId: string, attractions: PlanAttractionViewModel[]) => {
    if (!planViewModel) return;

    setPlanViewModel({
      ...planViewModel,
      planDays: planViewModel.planDays.map((day) => (day.id === dayId ? { ...day, attractions } : day)),
    });

    // Save to localStorage
    saveToLocalStorage(planViewModel);
  };

  // Handle attraction removal
  const handleAttractionRemove = (dayId: string, attractionId: string) => {
    if (!planViewModel) return;

    setPlanViewModel({
      ...planViewModel,
      planDays: planViewModel.planDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              attractions: day.attractions.filter((attr) => attr.id !== attractionId),
            }
          : day
      ),
    });

    // Save to localStorage
    saveToLocalStorage(planViewModel);
  };

  // Handle note changes for attractions
  const handleNoteChange = (dayId: string, attractionId: string, note: string) => {
    if (!planViewModel) return;

    setPlanViewModel({
      ...planViewModel,
      planDays: planViewModel.planDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              attractions: day.attractions.map((attr) => (attr.id === attractionId ? { ...attr, notes: note } : attr)),
            }
          : day
      ),
    });

    // Save to localStorage
    saveToLocalStorage(planViewModel);
  };

  // Save plan to server
  const handleSave = async (formData: SavePlanFormData) => {
    if (!planViewModel) return;

    setIsSaving(true);
    try {
      // Map view model back to API format
      const planContent = planViewModel.planDays.map((day) => ({
        date: day.date,
        attractions: day.attractions.map((attr) => ({
          name: attr.name,
          description: attr.description,
          start_time: attr.startTime,
          end_time: attr.endTime,
          visit_duration: attr.visitDuration,
          address: attr.address,
          location: attr.location,
          image_url: attr.imageUrl,
          notes: attr.notes,
          transport_to_next: attr.transportToNext
            ? {
                mode: attr.transportToNext.mode,
                duration: attr.transportToNext.duration,
                distance: attr.transportToNext.distance,
              }
            : null,
        })),
      }));

      // Create save command
      const saveCommand: CreatePlanCommand = {
        name: formData.name,
        guide_id: guideId,
        content: { days: planContent },
        generation_params: planViewModel.generationParams as Record<string, unknown>,
        is_favorite: formData.isFavorite,
      };

      // Save to API
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveCommand),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save plan");
      }

      const data = await response.json();

      // Redirect to saved plan
      window.location.href = `/plans/${data.id}`;
    } catch (err) {
      console.error("Error saving plan:", err);
      setError(err instanceof Error ? err.message : "Failed to save the plan. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to save current state to localStorage
  const saveToLocalStorage = (planData: GeneratedPlanViewModel) => {
    try {
      localStorage.setItem(`plan_preview_${guideId}`, JSON.stringify(planData));
    } catch (err) {
      console.error("Error saving plan preview to localStorage:", err);
    }
  };

  return {
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
  };
}
