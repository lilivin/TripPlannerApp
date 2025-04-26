import { useState, useEffect } from "react";
import GuideSummaryCard from "./GuideSummaryCard";
import GeneratePlanForm from "./GeneratePlanForm";
import useGeneratePlanForm from "./hooks/useGeneratePlanForm";
import type { GuideDetailDto, TagDto } from "../types";
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
        console.log("API Response:", response);
        console.log("Response content:", response.content);

        // Sprawdź strukturę danych - czy zawiera dni i atrakcje
        if (!response.content || typeof response.content !== "object" || !("days" in response.content)) {
          console.error("Response content is missing 'days' array:", response.content);
          setSavingError("Wygenerowany plan nie zawiera poprawnej struktury danych");
          return;
        }

        // Store the generated plan in localStorage for the preview page
        localStorage.setItem(`generated_plan_${guideId}`, JSON.stringify(response));

        // Navigate to the preview page instead of creating a plan directly
        navigateTo(`/guides/${guideId}/generate/preview`);
      }
    } catch (error) {
      console.error("Błąd podczas generowania planu:", error);
      const errorMessage = error instanceof Error ? error.message : "Nieznany błąd";
      setSavingError(`Nie udało się wygenerować planu: ${errorMessage}`);
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
