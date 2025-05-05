import type { APIRoute } from "astro";
import { attractionsService } from "../../../lib/services/attractions.service";
import { attractionIdSchema } from "../../../schemas/attraction.schema";
import { ResponseCache } from "../../../lib/cache/response-cache";

export const prerender = false;

// Cache configuration
const CACHE_NAME = "attraction-details";
const CACHE_TTL_SECONDS = 3600; // 1 hour

/**
 * GET /api/attractions/{id}
 *
 * Returns detailed information about a specific attraction by its ID.
 * This endpoint provides full attraction details including:
 * - Basic information (name, description, address)
 * - Geolocation data
 * - Creator information
 * - Opening hours and contact details
 * - Ticket price and accessibility information
 * - Associated tags
 *
 * Responses:
 * - 200 OK: Attraction found and returned successfully
 * - 400 Bad Request: Invalid ID format or missing ID
 * - 404 Not Found: Attraction with the specified ID does not exist
 * - 500 Internal Server Error: Server error occurred
 *
 * Performance considerations:
 * - Response is cached for 1 hour in memory
 * - HTTP cache headers are set for client-side caching
 */
export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { id } = params;

    // Check if ID is provided
    if (!id) {
      return new Response(
        JSON.stringify({
          error: "Brak ID atrakcji",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate ID format
    const idValidation = attractionIdSchema.safeParse(id);

    if (!idValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowy format ID",
          details: idValidation.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get the cache instance
    const cache = ResponseCache.getInstance();

    // Fetch attraction details with caching
    const attraction = await cache.getOrSet(
      CACHE_NAME,
      id,
      () => attractionsService.getAttractionDetails(locals.supabase, id),
      CACHE_TTL_SECONDS
    );

    // Return 404 if attraction not found
    if (!attraction) {
      return new Response(
        JSON.stringify({
          error: "Atrakcja nie została znaleziona",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return attraction details
    return new Response(JSON.stringify(attraction), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Add browser cache headers (1 hour)
      },
    });
  } catch (error) {
    console.error("Error fetching attraction details:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas pobierania szczegółów atrakcji",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
