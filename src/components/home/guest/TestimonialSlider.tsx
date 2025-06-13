import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Testimonial } from "@/types/home-page";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (testimonials.length === 0) {
    return null;
  }

  const testimonial = testimonials[currentIndex];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Card className="p-6 md:p-8">
              <CardContent className="p-0">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary">
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback for missing images - using a local SVG placeholder
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%2364748b' text-anchor='middle' dy='0.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  <div className="flex mt-2 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="text-xl italic text-center">&ldquo;{testimonial.text}&rdquo;</blockquote>
              </CardContent>
            </Card>

            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="rounded-full bg-background/80 backdrop-blur-sm shadow-md"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous testimonial</span>
              </Button>
            </div>

            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="rounded-full bg-background/80 backdrop-blur-sm shadow-md"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </div>
          </div>

          {/* Pagination dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    currentIndex === index ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
