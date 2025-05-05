import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuideGalleryProps {
  images: string[];
  coverImage: string;
}

/**
 * Komponent wyświetlający galerię zdjęć przewodnika
 */
const GuideGallery: React.FC<GuideGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Jeśli nie ma zdjęć, wyświetl placeholder
  if (!images.length) {
    return (
      <div className="w-full aspect-[16/9] bg-muted rounded-lg flex items-center justify-center mb-6">
        <div className="flex flex-col items-center text-muted-foreground">
          <ImageIcon className="h-16 w-16 mb-2" />
          <p>Brak dostępnych zdjęć</p>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  return (
    <div className="relative mb-8">
      <div
        className={cn("w-full overflow-hidden rounded-lg relative", isZoomed ? "cursor-zoom-out" : "cursor-zoom-in")}
        onClick={toggleZoom}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleZoom();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div
          className={cn(
            "w-full aspect-[16/9] bg-cover bg-center transition-transform duration-300",
            isZoomed && "scale-150"
          )}
          style={{ backgroundImage: `url(${images[activeIndex]})` }}
        />

        <Button
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          size="icon"
          variant="secondary"
          className="absolute bottom-4 right-4"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {images.length > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <Button onClick={handlePrevious} size="icon" variant="outline" className="rounded-full h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-muted-foreground">
            {activeIndex + 1} / {images.length}
          </div>

          <Button onClick={handleNext} size="icon" variant="outline" className="rounded-full h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {images.length > 1 && (
        <div className="flex mt-2 overflow-x-auto gap-2 py-2 px-1">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "w-16 h-16 rounded border-2 flex-shrink-0 bg-cover bg-center",
                index === activeIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
              style={{ backgroundImage: `url(${image})` }}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GuideGallery;
