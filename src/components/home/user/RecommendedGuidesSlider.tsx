import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { RecommendedGuideDto } from "@/types";

interface RecommendedGuidesSliderProps {
  guides: RecommendedGuideDto[];
}

export function RecommendedGuidesSlider({ guides }: RecommendedGuidesSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show 3 items on desktop, 2 on tablet, 1 on mobile
  const itemsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(guides.length - itemsPerPage.desktop, currentIndex + 1));
  };

  if (guides.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>

      <div className="relative">
        {/* Navigation buttons */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>
        </div>

        {/* Guides Slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.slice(currentIndex, currentIndex + itemsPerPage.desktop).map((guide) => (
            <Card key={guide.id} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                {guide.cover_image_url ? (
                  <img src={guide.cover_image_url} alt={guide.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium truncate">{guide.location_name}</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm p-1.5"
                          >
                            <Info className="h-full w-full text-white" />
                            <span className="sr-only">Why recommended</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{guide.reason}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{guide.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{guide.description}</p>

                <div className="flex items-center justify-between">
                  <span className="font-semibold">{guide.price === 0 ? "Free" : `$${guide.price.toFixed(2)}`}</span>

                  {guide.average_rating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                      <span>{guide.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <a href={`/guides/${guide.id}`}>View Guide</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= guides.length - itemsPerPage.desktop}
            className="rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
