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
  // Pobierz dane powitania użytkownika
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("avatar_url, display_name")
    .eq("id", userId)
    .single();

  if (userError) throw userError;

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

  if (plansError) throw plansError;

  // Pobierz rekomendowane przewodniki
  const { data: interactionData, error: interactionError } = await supabase
    .from("user_guide_interactions")
    .select("guide_id, interaction_type, interaction_count")
    .eq("user_id", userId)
    .order("last_interaction_at", { ascending: false });

  if (interactionError) throw interactionError;

  // Analiza interakcji dla personalizowanych rekomendacji
  const interactionGuideIds = interactionData.map((i) => i.guide_id);

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
    .filter("id", "not.in", `(${interactionGuideIds.join(",")})`)
    .limit(3);

  if (recommendedError) throw recommendedError;

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
      created_at as added_at
    `
    )
    .eq("is_published", true)
    .eq("language", language)
    .filter("deleted_at", "is", null)
    .order("created_at", { ascending: false })
    .limit(5);

  if (newGuidesError) throw newGuidesError;

  // Przygotowanie rekomendacji z uzasadnieniami
  const recommendedWithReasons = (recommendedGuides as unknown as FeaturedGuideDto[]).map(
    (guide): RecommendedGuideDto => ({
      ...guide,
      reason: "Dopasowane do Twoich preferencji podróży",
    })
  );

  // Przygotowanie ostatnich planów z miniaturami
  const formattedRecentPlans = recentPlans.map(
    (plan: Record<string, unknown>): RecentPlanDto => ({
      id: plan.id as string,
      name: plan.name as string,
      guide: {
        title: (plan.guides as Record<string, string>).title,
        location_name: (plan.guides as Record<string, string>).location_name,
      },
      created_at: plan.created_at as string,
      is_favorite: plan.is_favorite as boolean,
      thumbnail_url: (plan.guides as Record<string, string | null>).cover_image_url,
    })
  );

  return {
    user_greeting: {
      display_name: userData.display_name || "użytkowniku",
      avatar_url: userData.avatar_url,
    },
    recent_plans: formattedRecentPlans,
    recommended_guides: recommendedWithReasons,
    new_guides: newGuides as unknown as NewGuideDto[],
  };
}
