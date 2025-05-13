import type { Json } from "./db/database.types";

/**
 * Base pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/**
 * User profile DTO
 */
export interface UserProfileDto {
  id: string;
  email: string;
  language_preference: string;
  avatar_url: string | null;
  created_at: string;
  last_login_at: string | null;
}

/**
 * User profile update command
 */
export interface UpdateUserProfileCommand {
  language_preference?: string;
  avatar_url?: string | null;
}

/**
 * Featured Guide DTO
 */
export interface FeaturedGuideDto {
  id: string;
  title: string;
  description: string;
  price: number;
  location_name: string;
  cover_image_url: string | null;
  average_rating: number | null;
}

/**
 * Home Guest Response DTO
 */
export interface HomeGuestResponse {
  featured_guides: FeaturedGuideDto[];
}

/**
 * User Greeting DTO
 */
export interface UserGreetingDto {
  display_name: string;
  avatar_url: string | null;
}

/**
 * Recent Plan DTO
 */
export interface RecentPlanDto {
  id: string;
  name: string;
  guide: {
    title: string;
    location_name: string;
  };
  created_at: string;
  is_favorite: boolean;
  thumbnail_url: string | null;
}

/**
 * Recommended Guide DTO
 */
export interface RecommendedGuideDto extends FeaturedGuideDto {
  reason: string;
}

/**
 * New Guide DTO
 */
export interface NewGuideDto {
  id: string;
  title: string;
  price: number;
  location_name: string;
  cover_image_url: string | null;
  added_at: string;
}

/**
 * Home User Response DTO
 */
export interface HomeUserResponse {
  user_greeting: UserGreetingDto;
  recent_plans: RecentPlanDto[];
  recommended_guides: RecommendedGuideDto[];
  new_guides: NewGuideDto[];
}

/**
 * Creator summary DTO (used in listings)
 */
export interface CreatorSummaryDto {
  id: string;
  display_name: string;
  biography: string | null;
  profile_image_url: string | null;
  is_verified: boolean;
  website: string | null;
}

/**
 * Creator detail DTO (used for detailed view)
 */
export interface CreatorDetailDto extends CreatorSummaryDto {
  contact_email: string | null;
  guides_count: number;
}

/**
 * Creator query parameters
 */
export interface CreatorQuery extends PaginationQuery {
  search?: string;
}

/**
 * Creator list response
 */
export interface CreatorListResponse {
  data: CreatorSummaryDto[];
  pagination: PaginationInfo;
}

/**
 * Creator creation/update command
 */
export interface UpsertCreatorCommand {
  display_name: string;
  biography?: string | null;
  profile_image_url?: string | null;
  contact_email?: string | null;
  website?: string | null;
}

/**
 * Minimal creator information
 */
export interface CreatorMinimalDto {
  id: string;
  display_name: string;
}

/**
 * Creator with profile image
 */
export interface CreatorWithImageDto extends CreatorMinimalDto {
  profile_image_url: string | null;
}

/**
 * Guide summary DTO (used in listings)
 */
export interface GuideSummaryDto {
  id: string;
  title: string;
  description: string;
  language: string;
  price: number;
  creator: CreatorMinimalDto;
  location_name: string;
  recommended_days: number;
  cover_image_url: string | null;
  created_at: string;
  average_rating: number | null;
}

/**
 * Tag DTO
 */
export interface TagDto {
  id: string;
  name: string;
  category: string;
}

/**
 * Guide attraction DTO
 */
export interface GuideAttractionDto {
  id: string;
  name: string;
  description: string;
  custom_description: string | null;
  order_index: number;
  is_highlight: boolean;
  address: string;
  images: string[];
  tags: TagDto[];
}

/**
 * Guide detail DTO
 */
export interface GuideDetailDto extends GuideSummaryDto {
  updated_at: string;
  is_published: boolean;
  version: number;
  reviews_count: number;
  attractions?: GuideAttractionDto[];
}

/**
 * Guide query parameters
 */
export interface GuideQuery extends PaginationQuery {
  creator_id?: string;
  language?: string;
  location?: string;
  min_days?: number;
  max_days?: number;
  is_published?: boolean;
  search?: string;
}

/**
 * Guide list response
 */
export interface GuideListResponse {
  data: GuideSummaryDto[];
  pagination: PaginationInfo;
}

/**
 * Guide creation/update command
 */
export interface UpsertGuideCommand {
  title: string;
  description: string;
  language?: string;
  price?: number;
  location_name: string;
  recommended_days: number;
  cover_image_url?: string | null;
  is_published?: boolean;
}

/**
 * Geolocation DTO
 */
export interface GeolocationDto {
  latitude: number;
  longitude: number;
}

/**
 * Attraction summary DTO (used in listings)
 */
export interface AttractionSummaryDto {
  id: string;
  name: string;
  description: string;
  address: string;
  geolocation: GeolocationDto;
  images: string[];
  creator: CreatorMinimalDto;
  average_visit_time_minutes: number | null;
}

/**
 * Attraction detail DTO
 */
export interface AttractionDetailDto extends AttractionSummaryDto {
  opening_hours: Json | null;
  contact_info: Json | null;
  ticket_price_info: string | null;
  accessibility_info: string | null;
}

/**
 * Attraction query parameters
 */
export interface AttractionQuery extends PaginationQuery {
  creator_id?: string;
  search?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

/**
 * Attraction list response
 */
export interface AttractionListResponse {
  data: AttractionSummaryDto[];
  pagination: PaginationInfo;
}

/**
 * Attraction creation/update command
 */
export interface UpsertAttractionCommand {
  name: string;
  description: string;
  address: string;
  geolocation: GeolocationDto;
  opening_hours?: Json | null;
  contact_info?: Json | null;
  images: string[];
  average_visit_time_minutes?: number | null;
  ticket_price_info?: string | null;
  accessibility_info?: string | null;
}

/**
 * Guide attraction relationship command
 */
export interface AddGuideAttractionCommand {
  attraction_id: string;
  order_index: number;
  custom_description?: string | null;
  is_highlight?: boolean;
}

/**
 * Guide attraction update command
 */
export interface UpdateGuideAttractionCommand {
  order_index?: number;
  custom_description?: string | null;
  is_highlight?: boolean;
}

/**
 * Guide attraction relationship DTO
 */
export interface GuideAttractionRelationshipDto {
  guide_id: string;
  attraction_id: string;
  order_index: number;
  custom_description: string | null;
  is_highlight: boolean;
}

/**
 * Tag list response
 */
export interface TagListResponse {
  data: TagDto[];
}

/**
 * Minimal guide information
 */
export interface GuideMinimalDto {
  id: string;
  title: string;
  location_name: string;
}

/**
 * Plan summary DTO (used in listings)
 */
export interface PlanSummaryDto {
  id: string;
  name: string;
  guide: GuideMinimalDto;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
}

/**
 * Plan detail DTO
 */
export interface PlanDetailDto extends PlanSummaryDto {
  content: Json;
  generation_params: Json;
}

/**
 * Plan query parameters
 */
export interface PlanQuery extends PaginationQuery {
  guide_id?: string;
  is_favorite?: boolean;
}

/**
 * Plan list response
 */
export interface PlanListResponse {
  data: PlanSummaryDto[];
  pagination: PaginationInfo;
}

/**
 * Plan generation command
 */
export interface GeneratePlanCommand {
  guide_id: string;
  days: number;
  preferences: {
    include_tags?: string[];
    exclude_tags?: string[];
    start_time?: string;
    end_time?: string;
    include_meals?: boolean;
    transportation_mode?: string;
  };
}

/**
 * Plan generation response
 */
export interface GeneratePlanResponse {
  content: Json;
  generation_params: Json;
  ai_generation_cost: number | null;
}

/**
 * Plan creation command
 */
export interface CreatePlanCommand {
  name: string;
  guide_id: string;
  content: Json;
  generation_params: Json;
  is_favorite?: boolean;
}

/**
 * Plan update command
 */
export interface UpdatePlanCommand {
  name?: string;
  content?: Json;
  is_favorite?: boolean;
}

/**
 * Save plan form data
 */
export interface SavePlanFormData {
  name: string;
  isFavorite: boolean;
}

/**
 * User with avatar DTO
 */
export interface UserWithAvatarDto {
  id: string;
  avatar_url: string | null;
}

/**
 * Review DTO
 */
export interface ReviewDto {
  id: string;
  user: UserWithAvatarDto;
  rating: number;
  comment: string | null;
  created_at: string;
}

/**
 * Review query parameters
 */
export interface ReviewQuery extends PaginationQuery {
  rating?: number;
}

/**
 * Review list response
 */
export interface ReviewListResponse {
  data: ReviewDto[];
  pagination: PaginationInfo;
}

/**
 * Review creation/update command
 */
export interface UpsertReviewCommand {
  rating: number;
  comment?: string | null;
}

/**
 * Offline cache status DTO
 */
export interface OfflineCacheStatusDto {
  is_cached: boolean;
  last_synced_at: string;
}

/**
 * Update offline cache status command
 */
export interface UpdateOfflineCacheStatusCommand {
  is_cached: boolean;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Schema for validating attraction queries
 */
export const attractionsQuerySchema = {
  safeParse: (data: Record<string, unknown>) => {
    // Implementation would use a validation library like Zod
    // This is just a stub for the example
    return { success: true, data };
  },
};

export interface ErrorResponse {
  error: {
    message: string;
    details?: Record<string, unknown>;
  };
}
