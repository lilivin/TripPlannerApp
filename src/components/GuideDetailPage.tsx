import React from "react";
import { useGuideDetail } from "./hooks/useGuideDetail";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import GuideDetailView from "./GuideDetailView";

interface GuideDetailPageProps {
  id: string;
}

/**
 * Główny komponent strony szczegółów przewodnika
 * Zarządza stanem ładowania i wyświetla odpowiedni widok
 */
const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ id }) => {
  const {
    guide,
    isLoading,
    error,
    activeTabIndex,
    setActiveTabIndex,
    expandedAttractions,
    toggleAttractionExpand,
    refetch,
  } = useGuideDetail(id);

  // Wyświetl stan ładowania
  if (isLoading) {
    return <LoadingState />;
  }

  // Wyświetl stan błędu
  if (error) {
    return <ErrorState code={error.code} message={error.message} onRetry={refetch} />;
  }

  // Wyświetl główny widok jeśli dane są dostępne
  if (guide) {
    return (
      <GuideDetailView
        guide={guide}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
        expandedAttractions={expandedAttractions}
        toggleAttractionExpand={toggleAttractionExpand}
      />
    );
  }

  // Fallback - nie powinien wystąpić, ale dla bezpieczeństwa
  return <ErrorState code={404} message="Nie znaleziono przewodnika" onRetry={refetch} />;
};

export default GuideDetailPage;
