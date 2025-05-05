import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuideDetailDto, GuideMinimalDto } from "../types";
import { MapPin, Calendar } from "lucide-react";

// We need to extend GuideMinimalDto with the properties needed for this component
interface ExtendedGuideMinimalDto extends GuideMinimalDto {
  recommended_days: number;
}

interface GuideSummaryCardProps {
  guide: GuideDetailDto | ExtendedGuideMinimalDto;
}

const GuideSummaryCard: React.FC<GuideSummaryCardProps> = ({ guide }) => {
  // Check if the guide is detailed (has more properties) or minimal
  const isDetailed = "description" in guide;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{guide.title}</CardTitle>
            <CardDescription className="flex items-center mt-1.5">
              <MapPin className="h-4 w-4 mr-1.5" />
              {guide.location_name}
            </CardDescription>
          </div>
          {isDetailed && "cover_image_url" in guide && guide.cover_image_url && (
            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
              <img src={guide.cover_image_url} alt={guide.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isDetailed && (
          <>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{(guide as GuideDetailDto).description}</p>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Rekomendowana liczba dni: {guide.recommended_days}</span>
            </div>
          </>
        )}

        {!isDetailed && (
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>Rekomendowana liczba dni: {guide.recommended_days}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GuideSummaryCard;
