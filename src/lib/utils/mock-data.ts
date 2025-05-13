// Mock data generators for testing
import type {
  FeaturedGuideDto,
  HomeGuestResponse,
  HomeUserResponse,
  RecentPlanDto,
  RecommendedGuideDto,
  NewGuideDto,
  UserGreetingDto,
} from "@/types";

/**
 * Generates mock featured guides for the guest homepage
 */
export function generateMockFeaturedGuides(count = 5): FeaturedGuideDto[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `guide-${i + 1}`,
    title: `Travel Guide to ${["Paris", "Tokyo", "New York", "Rome", "Barcelona"][i % 5]}`,
    description: `Discover the hidden gems of ${["Paris", "Tokyo", "New York", "Rome", "Barcelona"][i % 5]} with our comprehensive travel guide.`,
    price: Math.floor(Math.random() * 30) + 10,
    location_name: ["Paris, France", "Tokyo, Japan", "New York, USA", "Rome, Italy", "Barcelona, Spain"][i % 5],
    cover_image_url: `/images/guides/cover-${i + 1}.jpg`,
    average_rating: Math.random() * 2 + 3,
  }));
}

/**
 * Generates mock user greeting data
 */
export function generateMockUserGreeting(): UserGreetingDto {
  return {
    display_name: "John Doe",
    avatar_url: "/images/avatars/default.jpg",
  };
}

/**
 * Generates mock recent plans for the user homepage
 */
export function generateMockRecentPlans(count = 3): RecentPlanDto[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `plan-${i + 1}`,
    name: `${["Weekend in", "Trip to", "Exploring"][i % 3]} ${["Paris", "Tokyo", "Rome"][i % 3]}`,
    guide: {
      title: `${["Paris", "Tokyo", "Rome"][i % 3]} Complete Guide`,
      location_name: ["Paris, France", "Tokyo, Japan", "Rome, Italy"][i % 3],
    },
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    is_favorite: i % 2 === 0,
    thumbnail_url: `/images/guides/thumbnail-${i + 1}.jpg`,
  }));
}

/**
 * Generates mock recommended guides for the user homepage
 */
export function generateMockRecommendedGuides(count = 3): RecommendedGuideDto[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `guide-rec-${i + 1}`,
    title: `${["Hidden Gems of", "Ultimate Guide to", "Explorer's Guide to"][i % 3]} ${["Madrid", "Berlin", "Amsterdam"][i % 3]}`,
    description: `Discover ${["Madrid", "Berlin", "Amsterdam"][i % 3]} like a local with this comprehensive guide.`,
    price: Math.floor(Math.random() * 30) + 10,
    location_name: ["Madrid, Spain", "Berlin, Germany", "Amsterdam, Netherlands"][i % 3],
    cover_image_url: `/images/guides/cover-rec-${i + 1}.jpg`,
    average_rating: Math.random() * 2 + 3,
    reason: ["Based on your past trips", "Popular with similar travelers", "Matches your travel preferences"][i % 3],
  }));
}

/**
 * Generates mock new guides for the user homepage
 */
export function generateMockNewGuides(count = 5): NewGuideDto[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `guide-new-${i + 1}`,
    title: `${["Discover", "Explore", "Adventure in", "Guide to", "Tour of"][i % 5]} ${["Vienna", "Prague", "Budapest", "Copenhagen", "Stockholm"][i % 5]}`,
    price: Math.floor(Math.random() * 30) + 10,
    location_name: [
      "Vienna, Austria",
      "Prague, Czech Republic",
      "Budapest, Hungary",
      "Copenhagen, Denmark",
      "Stockholm, Sweden",
    ][i % 5],
    cover_image_url: `/images/guides/cover-new-${i + 1}.jpg`,
    added_at: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

/**
 * Generates a complete mock response for guest homepage
 */
export function generateMockGuestHomeResponse(): HomeGuestResponse {
  return {
    featured_guides: generateMockFeaturedGuides(),
  };
}

/**
 * Generates a complete mock response for user homepage
 */
export function generateMockUserHomeResponse(): HomeUserResponse {
  return {
    user_greeting: generateMockUserGreeting(),
    recent_plans: generateMockRecentPlans(),
    recommended_guides: generateMockRecommendedGuides(),
    new_guides: generateMockNewGuides(),
  };
}
