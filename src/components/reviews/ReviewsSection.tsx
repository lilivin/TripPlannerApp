import React from "react";
import type { ReviewDto, PaginationInfo } from "@/types";
import { MessagesSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ReviewItem from "./ReviewItem";

interface ReviewsSectionProps {
  guideId: string;
  reviewsCount: number;
  reviews: ReviewDto[];
  pagination: PaginationInfo;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

/**
 * Komponent wyświetlający listę recenzji przewodnika
 */
const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, pagination, isLoading, onPageChange }) => {
  // Jeśli nie ma recenzji, wyświetl odpowiedni komunikat
  if (!isLoading && (!reviews || reviews.length === 0)) {
    return (
      <Alert variant="default" className="my-6">
        <MessagesSquare className="h-5 w-5" />
        <AlertTitle className="ml-2">Brak recenzji</AlertTitle>
        <AlertDescription className="ml-7">Ten przewodnik nie ma jeszcze żadnych recenzji.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lista recenzji */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {/* Paginacja */}
      {pagination.pages > 1 && (
        <div className="flex justify-center pt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
            >
              Poprzednia
            </Button>

            <div className="text-sm">
              Strona {pagination.page} z {pagination.pages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages || isLoading}
            >
              Następna
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
