import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  HomeGuestResponse,
  HomeUserResponse,
  FeaturedGuideDto,
  RecentPlanDto,
  RecommendedGuideDto,
  NewGuideDto,
} from "../../types";

/**
 * Pobiera dane strony głównej dla niezalogowanych użytkowników
 */
export async function getGuestHomeData(supabase: SupabaseClient, language = "pl"): Promise<HomeGuestResponse> {
  const { data: featuredGuides, error } = await supabase
    .from("guides")
    .select(
      `
      id,
      title,
      description,
      price,
      location_name,
      cover_image_url,
      average_rating:reviews(rating).avg()
    `
    )
    .eq("is_published", true)
    .eq("language", language)
    .filter("deleted_at", "is", null)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;

  return {
    featured_guides: featuredGuides as unknown as FeaturedGuideDto[],
  };
}

/**
 * Pobiera dane strony głównej dla zalogowanych użytkowników
 */
export async function getUserHomeData(
  supabase: SupabaseClient,
  userId: string,
  language = "pl"
): Promise<HomeUserResponse> {
  try {
    // Pobierz dane powitania użytkownika
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("avatar_url, email")
      .eq("id", userId)
      .maybeSingle();

    if (userError) {
      console.error("Error fetching user data:", userError);
      throw userError;
    }

    // If no user data found, use default values
    const displayName = userData?.email?.split("@")[0] || "użytkowniku";
    const avatarUrl = userData?.avatar_url || null;

    // Pobierz ostatnie plany użytkownika
    const { data: recentPlans, error: plansError } = await supabase
      .from("plans")
      .select(
        `
        id,
        name,
        created_at,
        is_favorite,
        guides:guide_id (
          title,
          location_name,
          cover_image_url
        )
      `
      )
      .eq("user_id", userId)
      .filter("deleted_at", "is", null)
      .order("created_at", { ascending: false })
      .limit(3);

    if (plansError) {
      console.error("Error fetching recent plans:", plansError);
      throw plansError;
    }

    // Pobierz rekomendowane przewodniki (bez interakcji użytkownika)
    const { data: recommendedGuides, error: recommendedError } = await supabase
      .from("guides")
      .select(
        `
        id,
        title,
        description,
        price,
        location_name,
        cover_image_url,
        average_rating:reviews(rating).avg()
      `
      )
      .eq("is_published", true)
      .eq("language", language)
      .filter("deleted_at", "is", null)
      .order("created_at", { ascending: false })
      .limit(3);

    if (recommendedError) {
      console.error("Error fetching recommended guides:", recommendedError);
      throw recommendedError;
    }

    // Pobierz nowe przewodniki
    const { data: newGuides, error: newGuidesError } = await supabase
      .from("guides")
      .select(
        `
        id,
        title,
        price,
        location_name,
        cover_image_url,
        created_at
      `
      )
      .eq("is_published", true)
      .eq("language", language)
      .filter("deleted_at", "is", null)
      .order("created_at", { ascending: false })
      .limit(5);

    if (newGuidesError) {
      console.error("Error fetching new guides:", newGuidesError);
      throw newGuidesError;
    }

    // Przygotowanie rekomendacji z uzasadnieniami
    const recommendedWithReasons = (recommendedGuides as unknown as FeaturedGuideDto[]).map(
      (guide): RecommendedGuideDto => ({
        ...guide,
        reason: "Popularne wśród podróżników",
      })
    );

    // Przygotowanie ostatnich planów z miniaturami
    const formattedRecentPlans = (recentPlans || []).map((plan: Record<string, unknown>): RecentPlanDto => {
      const guides = (plan.guides as Record<string, string | null>) || {};
      return {
        id: plan.id as string,
        name: plan.name as string,
        guide: {
          title: guides.title || "Untitled Guide",
          location_name: guides.location_name || "Unknown Location",
        },
        created_at: plan.created_at as string,
        is_favorite: plan.is_favorite as boolean,
        thumbnail_url: guides.cover_image_url,
      };
    });

    return {
      user_greeting: {
        display_name: displayName,
        avatar_url: avatarUrl,
      },
      recent_plans: formattedRecentPlans,
      recommended_guides: recommendedWithReasons,
      new_guides: newGuides
        ? (newGuides.map((guide) => ({
            ...guide,
            added_at: guide.created_at,
          })) as unknown as NewGuideDto[])
        : [],
    };
  } catch (error) {
    console.error("Error in getUserHomeData:", error);
    throw error;
  }
}
