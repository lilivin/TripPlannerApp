import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GuideQuery,
  GuideListResponse,
  GuideSummaryDto,
  GuideDetailDto,
  GuideAttractionDto,
  TagDto,
  UpsertGuideCommand,
} from "../../types";
import { ApiError, ApiErrorTypes } from "../utils/api-response";

// Interface for raw database guide response
interface DatabaseGuide {
  id: string;
  title: string;
  description: string;
  language: string;
  price: number;
  creator_id: string;
  location_name: string;
  recommended_days: number;
  cover_image_url: string | null;
  created_at: string;
  is_published: boolean;
  creator: {
    id: string;
    display_name: string;
  };
}

// Interfaces for attraction and tag relationships
interface GuideAttractionRelation {
  attraction_id: string;
  order_index: number;
  custom_description: string | null;
  is_highlight: boolean;
  attractions: {
    id: string;
    name: string;
    description: string;
    address: string;
    images: string[];
  };
}

interface AttractionTagRelation {
  attraction_id: string;
  tag: {
    id: string;
    name: string;
    category: string;
  };
}

export const guidesService = {
  async getGuides(supabase: SupabaseClient, query: GuideQuery): Promise<GuideListResponse> {
    const {
      page = 1,
      limit = 10,
      creator_id,
      language,
      location,
      min_days,
      max_days,
      is_published = true,
      search,
    } = query;

    const offset = (page - 1) * limit;

    // Build base query
    let guidesQuery = supabase
      .from("guides")
      .select(
        `
        id,
        title,
        description,
        language,
        price,
        creator_id,
        location_name,
        recommended_days,
        cover_image_url,
        created_at,
        is_published,
        creator:creators(id, display_name)
      `
      )
      .is("deleted_at", null)
      .eq("is_published", is_published);

    // Add filters
    if (creator_id) {
      guidesQuery = guidesQuery.eq("creator_id", creator_id);
    }

    if (language) {
      guidesQuery = guidesQuery.eq("language", language);
    }

    if (location) {
      guidesQuery = guidesQuery.ilike("location_name", `%${location}%`);
    }

    if (min_days !== undefined) {
      guidesQuery = guidesQuery.gte("recommended_days", min_days);
    }

    if (max_days !== undefined) {
      guidesQuery = guidesQuery.lte("recommended_days", max_days);
    }

    if (search) {
      guidesQuery = guidesQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Create a clone of the query for count
    let countQueryBuilder = supabase
      .from("guides")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("is_published", is_published);

    // Apply the same filters
    if (creator_id) {
      countQueryBuilder = countQueryBuilder.eq("creator_id", creator_id);
    }

    if (language) {
      countQueryBuilder = countQueryBuilder.eq("language", language);
    }

    if (location) {
      countQueryBuilder = countQueryBuilder.ilike("location_name", `%${location}%`);
    }

    if (min_days !== undefined) {
      countQueryBuilder = countQueryBuilder.gte("recommended_days", min_days);
    }

    if (max_days !== undefined) {
      countQueryBuilder = countQueryBuilder.lte("recommended_days", max_days);
    }

    if (search) {
      countQueryBuilder = countQueryBuilder.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQueryBuilder;

    if (countError) {
      throw new ApiError(ApiErrorTypes.INTERNAL_ERROR, "Błąd podczas pobierania liczby przewodników", countError);
    }

    const total = count || 0;

    // Execute main query with pagination
    const { data: rawGuides, error } = await guidesQuery
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Query error:", error);
      throw new ApiError(ApiErrorTypes.INTERNAL_ERROR, "Błąd podczas pobierania przewodników", error);
    }

    console.log("Raw guides result:", rawGuides);

    if (!rawGuides) {
      return {
        data: [],
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    }

    // Type the guides data safely
    const guides = rawGuides as unknown as DatabaseGuide[];

    // Get average ratings for guides in a single query
    const guideIds = guides.map((guide) => guide.id);

    const averageRatings: Record<string, number | null> = {};

    if (guideIds.length > 0) {
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("reviews")
        .select("guide_id, rating")
        .in("guide_id", guideIds);

      if (ratingsError) {
        console.error("Error fetching ratings:", ratingsError);
      } else if (ratingsData) {
        // Calculate average rating for each guide
        const ratingsByGuide: Record<string, number[]> = {};

        ratingsData.forEach((review) => {
          if (!ratingsByGuide[review.guide_id]) {
            ratingsByGuide[review.guide_id] = [];
          }
          ratingsByGuide[review.guide_id].push(review.rating);
        });

        // Calculate averages
        Object.entries(ratingsByGuide).forEach(([guideId, ratings]) => {
          if (ratings.length > 0) {
            const sum = ratings.reduce((acc, rating) => acc + rating, 0);
            averageRatings[guideId] = parseFloat((sum / ratings.length).toFixed(1));
          } else {
            averageRatings[guideId] = null;
          }
        });
      }
    }

    // Map to DTO
    const mappedData: GuideSummaryDto[] = guides.map((guide) => {
      return {
        id: guide.id,
        title: guide.title,
        description: guide.description,
        language: guide.language,
        price: guide.price,
        creator: {
          id: guide.creator.id,
          display_name: guide.creator.display_name,
        },
        location_name: guide.location_name,
        recommended_days: guide.recommended_days,
        cover_image_url: guide.cover_image_url,
        created_at: guide.created_at,
        average_rating: averageRatings[guide.id] || null,
      };
    });

    // Calculate pagination info
    const pages = Math.ceil(total / limit);

    return {
      data: mappedData,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  },

  async getGuideDetails(
    supabase: SupabaseClient,
    id: string,
    includeAttractions = false
  ): Promise<GuideDetailDto | null> {
    // Query for guide details
    const { data: rawGuide, error } = await supabase
      .from("guides")
      .select(
        `
        id,
        title,
        description,
        language,
        price,
        creator_id,
        location_name,
        recommended_days,
        cover_image_url,
        created_at,
        updated_at,
        is_published,
        version,
        creator:creators(id, display_name)
      `
      )
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Record not found
        return null;
      }
      throw new ApiError(ApiErrorTypes.INTERNAL_ERROR, "Błąd podczas pobierania szczegółów przewodnika", error);
    }

    if (!rawGuide) {
      return null;
    }

    // Get the guide as the correct type
    const guide = rawGuide as unknown as DatabaseGuide & {
      updated_at: string;
      version: number;
    };

    // Get reviews count for the guide
    const { count: reviewsCount, error: reviewsError } = await supabase
      .from("reviews")
      .select("id", { count: "exact" })
      .eq("guide_id", id);

    if (reviewsError) {
      console.error("Error fetching reviews count:", reviewsError);
    }

    // Get average rating for the guide
    const { data: ratings, error: ratingsError } = await supabase.from("reviews").select("rating").eq("guide_id", id);

    let averageRating: number | null = null;

    if (!ratingsError && ratings && ratings.length > 0) {
      const sum = ratings.reduce((acc, review) => acc + review.rating, 0);
      averageRating = parseFloat((sum / ratings.length).toFixed(1));
    }

    // Initialize attractions as empty array
    let mappedAttractions: GuideAttractionDto[] = [];

    // Only fetch attractions when requested
    if (includeAttractions) {
      try {
        console.log("[DEBUG] Fetching attractions for guide:", id);

        // First, check if there are any records in guide_attractions table
        const { data: allGuideAttractions, error: checkError } = await supabase
          .from("guide_attractions")
          .select("guide_id, attraction_id")
          .eq("guide_id", id);

        console.log("[DEBUG] guide_attractions records for this guide:", allGuideAttractions);
        console.log("[DEBUG] Check error:", checkError);

        if (checkError) {
          console.error("[DEBUG] Error checking guide_attractions:", checkError);
        }

        if (!allGuideAttractions || allGuideAttractions.length === 0) {
          console.log("[DEBUG] No attractions found in guide_attractions for this guide");
        } else {
          console.log("[DEBUG] Found attractions relations count:", allGuideAttractions.length);
        }

        // Get attractions for the guide
        const { data: attractions, error: attractionsError } = await supabase
          .from("guide_attractions")
          .select(
            `
            attraction_id,
            order_index,
            custom_description,
            is_highlight,
            attractions:attraction_id(
              id,
              name,
              description,
              address,
              images
            )
          `
          )
          .eq("guide_id", id)
          .order("order_index");

        console.log("[DEBUG] Raw attractions data:", attractions);
        console.log("[DEBUG] Attractions error:", attractionsError);

        // Try a simpler query to test if attractions table exists and is accessible
        const { data: simpleAttractionsCheck, error: simpleCheckError } = await supabase
          .from("attractions")
          .select("id, name")
          .limit(2);

        console.log("[DEBUG] Simple attractions check:", simpleAttractionsCheck);
        console.log("[DEBUG] Simple check error:", simpleCheckError);

        if (attractionsError) {
          console.error("Error fetching guide attractions:", attractionsError);
          // Continue with empty attractions, but don't fail the entire request
        } else if (attractions && attractions.length > 0) {
          // Get tags for attractions
          let attractionIds: string[] = [];
          const guideAttractionsMap: Record<
            string,
            {
              order_index: number;
              custom_description: string | null;
              is_highlight: boolean;
            }
          > = {};

          // Type the attractions data safely
          const typedAttractions = attractions as unknown as GuideAttractionRelation[];
          console.log("[DEBUG] Typed attractions:", JSON.stringify(typedAttractions, null, 2));

          attractionIds = typedAttractions.map((a) => a.attraction_id);
          console.log("[DEBUG] Extracted attraction IDs:", attractionIds);

          // Create map for easier access
          typedAttractions.forEach((item) => {
            guideAttractionsMap[item.attraction_id] = {
              order_index: item.order_index,
              custom_description: item.custom_description,
              is_highlight: item.is_highlight,
            };
          });

          console.log("[DEBUG] Guide attractions map:", guideAttractionsMap);

          // Check if attractions property exists in each item
          typedAttractions.forEach((item, index) => {
            console.log(`[DEBUG] Item ${index} attractions property:`, item.attractions);
          });

          const attractionTags: Record<string, TagDto[]> = {};

          if (attractionIds.length > 0) {
            const { data: tags, error: tagsError } = await supabase
              .from("attraction_tags")
              .select(
                `
                attraction_id,
                tag:tag_id(
                  id,
                  name,
                  category
                )
              `
              )
              .in("attraction_id", attractionIds);

            if (tagsError) {
              console.error("Error fetching attraction tags:", tagsError);
              // Continue with empty tags, but don't fail the entire request
            } else if (tags) {
              // Type the tags data safely
              const typedTags = tags as unknown as AttractionTagRelation[];

              // Group tags by attraction
              typedTags.forEach((tagItem) => {
                if (!attractionTags[tagItem.attraction_id]) {
                  attractionTags[tagItem.attraction_id] = [];
                }
                attractionTags[tagItem.attraction_id].push({
                  id: tagItem.tag.id,
                  name: tagItem.tag.name,
                  category: tagItem.tag.category,
                });
              });
            }
          }

          // Map attractions to DTOs
          mappedAttractions = typedAttractions.map((item) => {
            const attraction = item.attractions;
            const tags = attractionTags[item.attraction_id] || [];

            return {
              id: attraction.id,
              name: attraction.name,
              description: attraction.description,
              custom_description: item.custom_description,
              order_index: item.order_index,
              is_highlight: item.is_highlight,
              address: attraction.address,
              images: attraction.images,
              tags,
            };
          });
        }
      } catch (error) {
        console.error("Unexpected error fetching attractions:", error);
        // We'll continue with empty attractions rather than failing the entire request
        // This is a graceful degradation approach
      }
    }

    // Return mapped guide with attractions (or empty array if not requested)
    return {
      id: guide.id,
      title: guide.title,
      description: guide.description,
      language: guide.language,
      price: guide.price,
      creator: {
        id: guide.creator.id,
        display_name: guide.creator.display_name,
      },
      location_name: guide.location_name,
      recommended_days: guide.recommended_days,
      cover_image_url: guide.cover_image_url,
      created_at: guide.created_at,
      updated_at: guide.updated_at,
      is_published: guide.is_published,
      version: guide.version,
      reviews_count: reviewsCount || 0,
      average_rating: averageRating,
      attractions: mappedAttractions,
    };
  },

  /**
   * Creates a new guide
   * @param supabase Supabase client
   * @param creatorId ID of the creator
   * @param data Guide data
   * @returns The newly created guide details
   */
  async createGuide(supabase: SupabaseClient, creatorId: string, data: UpsertGuideCommand): Promise<GuideDetailDto> {
    // Mapping input data to DB structure
    const guideData = {
      creator_id: creatorId,
      title: data.title,
      description: data.description,
      language: data.language || "pl",
      price: data.price || 0,
      location_name: data.location_name,
      recommended_days: data.recommended_days || 1,
      cover_image_url: data.cover_image_url || null,
      is_published: data.is_published || false,
    };

    // Insert into database
    const { data: newGuide, error } = await supabase.from("guides").insert(guideData).select("id").single();

    if (error) {
      throw new ApiError(ApiErrorTypes.INTERNAL_ERROR, "Błąd podczas tworzenia przewodnika", error);
    }

    // Get full data of the newly created guide
    const guide = await this.getGuideDetails(supabase, newGuide.id);

    if (!guide) {
      throw new ApiError(ApiErrorTypes.INTERNAL_ERROR, "Nie udało się pobrać utworzonego przewodnika", null);
    }

    return guide;
  },
};
