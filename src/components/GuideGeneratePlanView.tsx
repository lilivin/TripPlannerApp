import { useState, useEffect } from "react";
import GuideSummaryCard from "./GuideSummaryCard";
import GeneratePlanForm from "./GeneratePlanForm";
import useGeneratePlanForm from "./hooks/useGeneratePlanForm";
import type { GuideDetailDto, TagDto } from "../types";
import type { GeneratePlanResponse } from "../types/plan";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface GuideGeneratePlanViewProps {
  guideId: string;
}

const GuideGeneratePlanView = ({ guideId }: GuideGeneratePlanViewProps) => {
  const [guide, setGuide] = useState<GuideDetailDto | null>(null);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingError, setSavingError] = useState<string | null>(null);

  // Navigation function to replace useNavigate
  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  // Fetch guide details
  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const response = await fetch(`/api/guides/${guideId}?include_attractions=true`);
        if (response.status === 404) {
          setError("Nie znaleziono przewodnika");
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Pobrane dane przewodnika:", data);

        // Sprawdź czy przewodnik ma atrakcje
        if (!data.attractions || data.attractions.length === 0) {
          setError("Ten przewodnik nie ma żadnych atrakcji. Dodaj atrakcje, aby móc wygenerować plan.");
          setIsLoading(false);
          return;
        }

        setGuide(data);
      } catch (error) {
        console.error("Błąd podczas pobierania danych przewodnika:", error);
        setError("Wystąpił błąd podczas ładowania danych przewodnika");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuideDetails();
  }, [guideId]);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTags(data.data); // Zgodnie z TagListResponse
      } catch (error) {
        console.error("Błąd podczas pobierania tagów:", error);
        // Nie ustawiamy błędu, tagi są opcjonalne
      }
    };

    fetchTags();
  }, []);

  // Initialize form hook
  const formHook = useGeneratePlanForm(guideId || "", tags);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setSavingError(null);

      // Sprawdź czy przewodnik ma atrakcje przed próbą generowania
      if (!guide?.attractions || guide.attractions.length === 0) {
        setSavingError("Nie można wygenerować planu dla przewodnika bez atrakcji");
        return;
      }

      const response = await formHook.submitForm();

      if (response) {
        // Create a new plan from the response
        const planResponse = await createPlan(response, guide?.title || "Nowy plan");

        if (planResponse) {
          // Navigate to the newly created plan
          navigateTo(`/plans/${planResponse.id}`);
        }
      }
    } catch (error) {
      console.error("Błąd podczas tworzenia planu:", error);
      const errorMessage = error instanceof Error ? error.message : "Nieznany błąd";
      setSavingError(`Nie udało się zapisać planu: ${errorMessage}`);
    }
  };

  // Create plan in database
  const createPlan = async (generatedPlan: GeneratePlanResponse, guideName: string): Promise<{ id: string } | null> => {
    if (!guide) {
      throw new Error("Brak danych przewodnika");
    }

    try {
      // Ensure the content has the expected structure
      const planContent =
        typeof generatedPlan.content === "string"
          ? { title: `Plan na ${formHook.formData.days} dni`, summary: generatedPlan.content, days: [] }
          : generatedPlan.content;

      const planData = {
        name: `${guideName} - Plan na ${formHook.formData.days} ${formHook.formData.days === 1 ? "dzień" : "dni"}`,
        guide_id: guide.id,
        content: planContent,
        generation_params: generatedPlan.generation_params,
        is_favorite: false,
      };

      console.log("Wysyłanie planu (pełne dane):", JSON.stringify(planData, null, 2));

      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(planData),
        credentials: "include", // Add this to ensure cookies are sent
      });

      let responseData;
      const responseText = await response.text();
      try {
        responseData = JSON.parse(responseText);
        console.log("Odpowiedź z API (sparsowana):", responseData);
      } catch (error) {
        console.error("Nie udało się sparsować odpowiedzi JSON:", responseText, error);
        throw new Error("Nieprawidłowa odpowiedź z serwera");
      }

      if (!response.ok) {
        const errorMessage = responseData?.error || responseData?.message || `Błąd HTTP: ${response.status}`;
        console.error("Szczegóły błędu z API:", {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          response: responseData,
        });
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error) {
      console.error("Szczegóły błędu podczas zapisywania planu:", error);
      if (error instanceof Error) {
        throw new Error(`Nie udało się zapisać planu: ${error.message}`);
      }
      throw error;
    }
  };

  // Show error if guide not found or has no attractions
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Błąd</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        {error.includes("atrakcji") && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Co możesz zrobić?</h3>
                <p>Aby wygenerować plan, najpierw należy dodać atrakcje do tego przewodnika.</p>
                <a href={`/guides/${guideId}/edit`} className="text-primary underline mt-2 inline-block">
                  Edytuj przewodnik i dodaj atrakcje
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-6"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Show main view when data is loaded
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Generowanie planu wycieczki</h1>

      {savingError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Błąd zapisywania planu</AlertTitle>
          <AlertDescription>{savingError}</AlertDescription>
        </Alert>
      )}

      {guide && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-6">
          <div className="md:col-span-2">
            <GuideSummaryCard guide={guide} />
          </div>

          <div className="md:col-span-4">
            <GeneratePlanForm
              guideId={guideId || ""}
              availableTags={tags}
              onSubmit={handleSubmit}
              isLoading={formHook.isLoading}
              formData={formHook.formData}
              errors={formHook.errors}
              updateField={formHook.updateField}
              updatePreference={formHook.updatePreference}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideGeneratePlanView;
