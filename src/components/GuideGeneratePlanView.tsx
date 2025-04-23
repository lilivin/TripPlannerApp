import { useState, useEffect } from 'react';
import GuideSummaryCard from './GuideSummaryCard';
import GeneratePlanForm from './GeneratePlanForm';
import useGeneratePlanForm from './hooks/useGeneratePlanForm';
import type { GuideDetailDto, TagDto } from '../types';
import type { GeneratePlanFormData, GeneratePlanResponse } from '../types/plan';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from 'lucide-react';

interface GuideGeneratePlanViewProps {
  guideId: string;
}

const GuideGeneratePlanView = ({ guideId }: GuideGeneratePlanViewProps) => {
  const [guide, setGuide] = useState<GuideDetailDto | null>(null);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation function to replace useNavigate
  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  // Fetch guide details
  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const response = await fetch(`/api/guides/${guideId}`);
        if (response.status === 404) {
          setError('Nie znaleziono przewodnika');
          setIsLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setGuide(data);
      } catch (error) {
        console.error('Błąd podczas pobierania danych przewodnika:', error);
        setError('Wystąpił błąd podczas ładowania danych przewodnika');
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
        const response = await fetch('/api/tags');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTags(data.data); // Zgodnie z TagListResponse
      } catch (error) {
        console.error('Błąd podczas pobierania tagów:', error);
        // Nie ustawiamy błędu, tagi są opcjonalne
      }
    };

    fetchTags();
  }, []);

  // Initialize form hook
  const formHook = useGeneratePlanForm(guideId || '', tags);
  
  // Handle form submission
  const handleSubmit = async (data: GeneratePlanFormData) => {
    try {
      const response = await formHook.submitForm();
      
      if (response) {
        // Create a new plan from the response
        const planResponse = await createPlan(response, guide?.title || 'Nowy plan');
        
        if (planResponse) {
          // Navigate to the newly created plan
          navigateTo(`/plans/${planResponse.id}`);
        }
      }
    } catch (error) {
      console.error('Błąd podczas tworzenia planu:', error);
    }
  };

  // Create plan in database
  const createPlan = async (generatedPlan: GeneratePlanResponse, guideName: string): Promise<{ id: string } | null> => {
    try {
      const planData = {
        name: `${guideName} - Plan na ${formHook.formData.days} ${formHook.formData.days === 1 ? 'dzień' : 'dni'}`,
        guide_id: guideId,
        content: generatedPlan.content,
        generation_params: generatedPlan.generation_params,
        is_favorite: false
      };
      
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Błąd podczas zapisywania planu:', error);
      return null;
    }
  };

  // Show error if guide not found
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Błąd</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
      
      {guide && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-6">
          <div className="md:col-span-2">
            <GuideSummaryCard guide={guide} />
          </div>
          
          <div className="md:col-span-4">
            <GeneratePlanForm
              guideId={guideId || ''}
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