import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LazyImage } from "@/components/ui/LazyImage";
import type { FeaturedGuideDto } from "@/types";

interface FeaturedGuidesCarouselProps {
  guides: FeaturedGuideDto[];
}

export function FeaturedGuidesCarousel({ guides }: FeaturedGuidesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show 3 items on desktop, 2 on tablet, 1 on mobile
  const itemsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  // Determine visible guides based on screen size and current index
  /*const visibleGuides = {
    mobile: guides.slice(currentIndex, currentIndex + itemsPerPage.mobile),
    tablet: guides.slice(currentIndex, currentIndex + itemsPerPage.tablet),
    desktop: guides.slice(currentIndex, currentIndex + itemsPerPage.desktop),
  };*/

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
    <section className="py-16" id="featured-guides">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Featured Guides</h2>

        <div className="relative">
          {/* Navigation buttons */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="rounded-full bg-background/80 backdrop-blur-sm shadow-md"
              aria-label="Previous guides"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous</span>
            </Button>
          </div>

          {/* Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.slice(currentIndex, currentIndex + itemsPerPage.desktop).map((guide) => (
              <Card key={guide.id} className="overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  {guide.cover_image_url ? (
                    <LazyImage
                      src={guide.cover_image_url}
                      alt={guide.title}
                      aspectRatio="16/9"
                      containerClassName="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white font-medium truncate">{guide.location_name}</p>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{guide.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{guide.price === 0 ? "Free" : `$${guide.price.toFixed(2)}`}</span>

                    {guide.average_rating && (
                      <div
                        className="flex items-center"
                        aria-label={`Rating: ${guide.average_rating.toFixed(1)} out of 5`}
                      >
                        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" aria-hidden="true" />
                        <span>{guide.average_rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="outline" className="w-full">
                    <a href={`/guides/${guide.id}`}>View Details</a>
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
              aria-label="Next guides"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>

        {/* Pagination dots */}
        {guides.length > itemsPerPage.desktop && (
          <div className="flex justify-center mt-8" role="navigation" aria-label="Guide pagination">
            {Array.from({ length: Math.ceil(guides.length / itemsPerPage.desktop) }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  Math.floor(currentIndex / itemsPerPage.desktop) === index
                    ? "bg-primary"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => setCurrentIndex(index * itemsPerPage.desktop)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={Math.floor(currentIndex / itemsPerPage.desktop) === index ? "true" : "false"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
