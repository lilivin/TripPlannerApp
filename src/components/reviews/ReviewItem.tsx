import React from "react";
import type { ReviewDto } from "@/types";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ReviewItemProps {
  review: ReviewDto;
}

/**
 * Komponent wyświetlający pojedynczą recenzję
 */
const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  // Formatowanie daty
  const formattedDate = (() => {
    try {
      const date = parseISO(review.created_at);
      return format(date, "d MMMM yyyy", { locale: pl });
    } catch {
      return "Data nieznana";
    }
  })();

  // Generowanie gwiazdek dla oceny
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ));
  };

  return (
    <Card>
      <CardHeader className="p-4 pb-2 flex flex-row items-start space-x-4">
        <Avatar>
          {review.user.avatar_url ? (
            <AvatarImage src={review.user.avatar_url} alt="Avatar użytkownika" />
          ) : (
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center">{renderStars(review.rating)}</div>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {review.comment ? (
          <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Użytkownik nie dodał komentarza</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewItem;
