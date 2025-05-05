import React from "react";
import type { GuideAttractionDto } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AttractionItem from "./AttractionItem";

interface AttractionsListProps {
  attractions: GuideAttractionDto[];
  expandedAttractions: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
}

/**
 * Komponent wyświetlający listę atrakcji
 */
const AttractionsList: React.FC<AttractionsListProps> = ({ attractions, expandedAttractions, onToggleExpand }) => {
  // Sortuj atrakcje według order_index
  const sortedAttractions = [...attractions].sort((a, b) => a.order_index - b.order_index);

  // Jeśli nie ma atrakcji, wyświetl odpowiedni komunikat
  if (!sortedAttractions.length) {
    return (
      <Alert variant="default" className="my-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="ml-2">Brak atrakcji</AlertTitle>
        <AlertDescription className="ml-7">Ten przewodnik nie zawiera jeszcze żadnych atrakcji.</AlertDescription>
      </Alert>
    );
  }

  // Znajdź wyróżnione atrakcje
  const highlightedAttractions = sortedAttractions.filter((attraction) => attraction.is_highlight);

  return (
    <div className="space-y-6">
      {/* Wyróżnione atrakcje */}
      {highlightedAttractions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Wyróżnione atrakcje</h3>
          <div className="space-y-4">
            {highlightedAttractions.map((attraction) => (
              <AttractionItem
                key={attraction.id}
                attraction={attraction}
                isExpanded={expandedAttractions[attraction.id] || false}
                onToggleExpand={() => onToggleExpand(attraction.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Wszystkie atrakcje */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Wszystkie atrakcje</h3>
        <div className="space-y-4">
          {sortedAttractions.map((attraction) => (
            <AttractionItem
              key={attraction.id}
              attraction={attraction}
              isExpanded={expandedAttractions[attraction.id] || false}
              onToggleExpand={() => onToggleExpand(attraction.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttractionsList;
