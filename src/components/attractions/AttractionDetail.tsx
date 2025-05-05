import React from "react";
import type { GuideAttractionDto } from "@/types";
import { Badge } from "@/components/ui/badge";

interface AttractionDetailProps {
  attraction: GuideAttractionDto;
}

/**
 * Komponent wyświetlający szczegóły atrakcji
 * po rozwinięciu w AttractionItem
 */
const AttractionDetail: React.FC<AttractionDetailProps> = ({ attraction }) => {
  // Użyj custom_description jeśli istnieje, w przeciwnym razie użyj domyślnego opisu
  const description = attraction.custom_description || attraction.description;

  // Podziel opis na akapity
  const paragraphs = description.split("\n").filter((p) => p.trim() !== "");

  return (
    <div className="space-y-4">
      {/* Galeria zdjęć */}
      {attraction.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {attraction.images.map((image, index) => (
            <div
              key={index}
              className="aspect-square bg-cover bg-center rounded"
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
      )}

      {/* Opis atrakcji */}
      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Adres */}
      <div>
        <h4 className="text-sm font-medium mb-1">Adres:</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{attraction.address}</p>
      </div>

      {/* Tagi */}
      {attraction.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Tagi:</h4>
          <div className="flex flex-wrap gap-1.5">
            {attraction.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionDetail;
