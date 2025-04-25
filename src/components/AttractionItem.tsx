import React from "react";
import type { GuideAttractionDto } from "@/types";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AttractionDetail from "./AttractionDetail";

interface AttractionItemProps {
  attraction: GuideAttractionDto;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

/**
 * Komponent wyświetlający pojedynczą atrakcję
 * z możliwością rozwijania szczegółów
 */
const AttractionItem: React.FC<AttractionItemProps> = ({ attraction, isExpanded, onToggleExpand }) => {
  // Określ obraz główny atrakcji
  const primaryImage = attraction.images.length > 0 ? attraction.images[0] : null;

  // Podziel tagi na widoczne i ukryte
  const MAX_VISIBLE_TAGS = 3;
  const visibleTags = attraction.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTags = attraction.tags.slice(MAX_VISIBLE_TAGS);

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isExpanded ? "border-primary/50" : "hover:border-muted-foreground/20"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-0">
        <div className="flex items-start gap-4 w-full">
          {/* Thumbnail zdjęcia atrakcji */}
          {primaryImage && (
            <div
              className="h-16 w-16 bg-cover bg-center rounded shrink-0"
              style={{ backgroundImage: `url(${primaryImage})` }}
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">
                <a href={`/attractions/${attraction.id}`} className="hover:underline">
                  {attraction.name}
                </a>
              </h3>
            </div>

            {/* Tagline atrakcji */}
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{attraction.address}</span>
            </div>

            {/* Tagi atrakcji */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {visibleTags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}

              {hiddenTags.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{hiddenTags.length} więcej
                </Badge>
              )}
            </div>
          </div>

          {/* Przycisk rozwijania/zwijania */}
          <Button variant="ghost" size="sm" onClick={onToggleExpand} className="ml-2 p-2">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>

      {/* Rozwinięty widok szczegółów */}
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="h-px w-full bg-border my-4" />
          <AttractionDetail attraction={attraction} />
        </CardContent>
      )}
    </Card>
  );
};

export default AttractionItem;
