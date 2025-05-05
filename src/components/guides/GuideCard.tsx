import type { GuideSummaryDto } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StarIcon } from "@/components/ui/icons";

interface GuideCardProps {
  guide: GuideSummaryDto;
}

export default function GuideCard({ guide }: GuideCardProps) {
  const {
    id,
    title,
    description,
    language,
    price,
    creator,
    location_name,
    recommended_days,
    cover_image_url,
    average_rating,
    created_at,
  } = guide;

  // Format price to display as €X.XX or "Free"
  const formattedPrice = price === 0 ? "Free" : `€${price.toFixed(2)}`;

  // Create placeholder image URL if no cover image is provided
  const imageUrl = cover_image_url || "https://placehold.co/400x225/e2e8f0/1e293b?text=No+Image";

  // Format date for better accessibility
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format rating display with accessible details
  const ratingDisplay = average_rating ? (
    <div className="flex items-center" aria-label={`Rating: ${average_rating.toFixed(1)} out of 5`}>
      <StarIcon className="h-4 w-4 fill-current text-yellow-500 mr-1" aria-hidden="true" />
      <span>{average_rating.toFixed(1)}</span>
    </div>
  ) : (
    <span className="text-muted-foreground text-sm" aria-label="No ratings yet">
      No ratings
    </span>
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-primary">
      <a
        href={`/guides/${id}`}
        className="block h-full flex flex-col focus:outline-none"
        aria-label={`View details for ${title} guide - ${description.substring(0, 100)}${description.length > 100 ? "..." : ""}`}
      >
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={`Cover for ${title}`}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            loading="lazy"
          />
          <div
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground px-2 py-1 m-2 rounded text-sm font-medium"
            aria-label={price === 0 ? "Free guide" : `Price: ${formattedPrice}`}
          >
            {formattedPrice}
          </div>
        </div>

        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg sm:text-xl font-semibold line-clamp-2">{title}</h3>
          </div>
          <div className="flex justify-between text-sm">
            <span aria-label={`Language: ${language}`}>{language.toUpperCase()}</span>
            {ratingDisplay}
          </div>
        </CardHeader>

        <CardContent className="pb-2 sm:pb-3 flex-grow">
          <p className="text-muted-foreground text-sm sm:text-base line-clamp-3 mb-2">{description}</p>
          <div className="flex flex-wrap gap-2">
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted"
              aria-label={`Location: ${location_name}`}
            >
              {location_name}
            </span>
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted"
              aria-label={`Duration: ${recommended_days} ${recommended_days === 1 ? "day" : "days"}`}
            >
              {recommended_days} {recommended_days === 1 ? "day" : "days"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 text-xs sm:text-sm border-t mt-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
            <span className="text-muted-foreground">By: {creator.display_name}</span>
            <time
              dateTime={created_at}
              className="text-muted-foreground text-xs mt-1 sm:mt-0"
              aria-label={`Published on ${formattedDate}`}
            >
              {formattedDate}
            </time>
          </div>
        </CardFooter>
      </a>
    </Card>
  );
}
