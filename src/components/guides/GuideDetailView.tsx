import React from "react";
import { useReviews } from "../reviews/hooks/useReviews";
import GuideHeader from "./GuideHeader";
import GuideGallery from "./GuideGallery";
import GuideContent from "./GuideContent";
import TabNavigation from "../common/TabNavigation";
import AttractionsList from "../attractions/AttractionsList";
import ReviewsSection from "../reviews/ReviewsSection";
import GeneratePlanButton from "../form/GeneratePlanButton";
import type { GuideDetailDto, CreatorWithImageDto } from "../types";

interface GuideDetailViewProps {
  guide: GuideDetailDto;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  expandedAttractions: Record<string, boolean>;
  toggleAttractionExpand: (id: string) => void;
}

/**
 * Główny komponent widoku szczegółów przewodnika
 * Wyświetla wszystkie informacje o przewodniku
 */
const GuideDetailView: React.FC<GuideDetailViewProps> = ({
  guide,
  activeTabIndex,
  setActiveTabIndex,
  expandedAttractions,
  toggleAttractionExpand,
}) => {
  // Pobieramy recenzje dla przewodnika
  const { reviews, isLoading: isReviewsLoading, pagination, fetchPage } = useReviews(guide.id);

  // Zliczamy dostępne atrakcje i recenzje
  const attractionsCount = guide.attractions?.length || 0;
  const reviewsCount = guide.reviews_count || 0;

  // Przygotowujemy dane twórcy z profilem
  const creatorWithImage: CreatorWithImageDto = {
    id: guide.creator.id,
    name: guide.creator.name,
    display_name: guide.creator.display_name,
    profile_image_url: guide.creator.avatar_url,
  };

  return (
    <div className="container mx-auto px-4 pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Nagłówek z tytułem, oceną i informacjami */}
        <GuideHeader
          guide={guide}
          averageRating={guide.average_rating || 0}
          recommendedDays={guide.recommended_days}
          price={guide.price}
        />

        {/* Galeria zdjęć */}
        <GuideGallery
          images={[guide.cover_image_url].filter(Boolean) as string[]}
          coverImage={guide.cover_image_url || ""}
        />

        {/* Treść przewodnika i informacje o twórcy */}
        <GuideContent description={guide.description} creator={creatorWithImage} locationName={guide.location_name} />

        {/* Nawigacja zakładkowa (atrakcje/recenzje) */}
        <TabNavigation
          activeTab={activeTabIndex}
          onTabChange={setActiveTabIndex}
          attractionsCount={attractionsCount}
          reviewsCount={reviewsCount}
        >
          {/* Zawartość zakładki z atrakcjami */}
          {activeTabIndex === 0 && (
            <AttractionsList
              attractions={guide.attractions}
              expandedAttractions={expandedAttractions}
              onToggleExpand={toggleAttractionExpand}
            />
          )}

          {/* Zawartość zakładki z recenzjami */}
          {activeTabIndex === 1 && (
            <ReviewsSection
              guideId={guide.id}
              reviewsCount={reviewsCount}
              reviews={reviews}
              pagination={pagination}
              isLoading={isReviewsLoading}
              onPageChange={fetchPage}
            />
          )}
        </TabNavigation>

        {/* Przycisk generowania planu */}
        <div className="mt-10 flex justify-center">
          <GeneratePlanButton
            guideId={guide.id}
            isPaid={guide.price > 0}
            hasAccess={true} // To powinno być pobrane z API autoryzacji
          />
        </div>
      </div>
    </div>
  );
};

export default GuideDetailView;
