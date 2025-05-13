import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";
import type { NewGuideDto } from "@/types";

interface NewGuidesSectionProps {
  guides: NewGuideDto[];
}

export function NewGuidesSection({ guides }: NewGuidesSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">New Guides</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {guides.map((guide) => (
          <Card key={guide.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
              {guide.cover_image_url ? (
                <img src={guide.cover_image_url} alt={guide.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                </div>
              )}

              <div className="absolute top-2 left-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>Added {formatDate(guide.added_at)}</span>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-1 line-clamp-1">{guide.title}</h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="line-clamp-1">{guide.location_name}</span>
                </div>
                <span className="font-medium">{guide.price === 0 ? "Free" : `$${guide.price.toFixed(2)}`}</span>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button asChild variant="outline" className="w-full h-9 text-sm">
                <a href={`/guides/${guide.id}`}>View Guide</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
