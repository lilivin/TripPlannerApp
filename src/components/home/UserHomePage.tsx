import type { HomeUserResponse } from "@/types";
import { UserWelcome } from "./user/UserWelcome";
import { RecentPlansGrid } from "./user/RecentPlansGrid";
import { RecommendedGuidesSlider } from "./user/RecommendedGuidesSlider";
import { NewGuidesSection } from "./user/NewGuidesSection";
import { QuickActionsBar } from "./user/QuickActionsBar";
import { useToggleFavoritePlan } from "../hooks/home-page";

interface UserHomePageProps {
  userData: HomeUserResponse;
}

export default function UserHomePage({ userData }: UserHomePageProps) {
  const { toggleFavorite, state: favoriteState } = useToggleFavoritePlan();

  const handleToggleFavorite = async (planId: string, isFavorite: boolean) => {
    await toggleFavorite(planId, isFavorite);
  };

  if (!userData || !userData.user_greeting) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10 py-6">
      <UserWelcome greeting={userData.user_greeting} />

      <QuickActionsBar />

      {userData.recent_plans?.length > 0 && (
        <RecentPlansGrid
          plans={userData.recent_plans}
          onToggleFavorite={handleToggleFavorite}
          favoriteState={favoriteState}
        />
      )}

      {userData.recommended_guides?.length > 0 && <RecommendedGuidesSlider guides={userData.recommended_guides} />}

      {userData.new_guides?.length > 0 && <NewGuidesSection guides={userData.new_guides} />}
    </div>
  );
}
