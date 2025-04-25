import type { APIRoute, APIContext } from "astro";
import { guidesService } from "../../../lib/services/guides.service";
import { guideIdSchema, guideQuerySchema } from "../../../schemas/guides.schema";
import { ApiError } from "../../../lib/utils/api-response";
import { createSuccessResponse, createErrorResponse } from "../../../lib/utils/api-response";
import { ResponseCache } from "../../../lib/cache/response-cache";

export const prerender = false;

// Cache configuration
const CACHE_NAME = "guide-details";
const CACHE_TTL_SECONDS = 3600; // 1 hour
const CACHE_TTL_WITH_ATTRACTIONS = 1800; // 30 minutes for responses with attractions

/**
 * GET /api/guides/{id}
 *
 * Returns detailed information about a specific guide by its ID.
 * This endpoint provides full guide details including:
 * - Basic information (title, description, language)
 * - Creator information
 * - Location and recommended days
 * - Average rating and reviews count
 * - Associated attractions with their details and tags (when include_attractions=true)
 *
 * Query Parameters:
 * - include_attractions: boolean (optional, default: false) - Whether to include attraction details
 *
 * Responses:
 * - 200 OK: Guide found and returned successfully
 * - 400 Bad Request: Invalid ID format or missing ID
 * - 404 Not Found: Guide with the specified ID does not exist
 * - 500 Internal Server Error: Server error occurred
 *
 * Performance considerations:
 * - Response is cached for 1 hour in memory
 * - HTTP cache headers are set for client-side caching
 */
export const GET: APIRoute = async ({ params, locals, url, request }: APIContext): Promise<Response> => {
  const startTime = performance.now();
  try {
    const { id } = params;

    console.log("API: Guide ID:", id);
    console.log("API: Search params:", Object.fromEntries(url.searchParams.entries()));

    // Check if ID is provided
    if (!id) {
      return createErrorResponse(400, "Brak ID przewodnika");
    }

    // Validate ID format
    const idValidation = guideIdSchema.safeParse(id);

    if (!idValidation.success) {
      return createErrorResponse(400, "Nieprawidłowy format ID", idValidation.error.format());
    }

    // Parse and validate query parameters
    const queryValidation = guideQuerySchema.safeParse({
      include_attractions: url.searchParams.get("include_attractions"),
    });

    if (!queryValidation.success) {
      return createErrorResponse(400, "Nieprawidłowe parametry zapytania", queryValidation.error.format());
    }

    const { include_attractions } = queryValidation.data;

    // Check if content is already in browser cache (304 Not Modified)
    const ifNoneMatch = request.headers.get("If-None-Match");
    const cacheKey = `${id}-${include_attractions}`;
    const etagValue = `"${cacheKey}"`;

    if (ifNoneMatch === etagValue) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etagValue,
        },
      });
    }

    // Get the cache instance
    const cache = ResponseCache.getInstance();

    // Determine appropriate cache TTL based on whether attractions are included
    // Responses with attractions are larger and change more frequently, so we use a shorter TTL
    const cacheTtl = include_attractions ? CACHE_TTL_WITH_ATTRACTIONS : CACHE_TTL_SECONDS;

    // Fetch guide details with caching
    const guide = await cache.getOrSet(
      CACHE_NAME,
      cacheKey,
      () => guidesService.getGuideDetails(locals.supabase, id, include_attractions),
      cacheTtl
    );

    // Return 404 if guide not found
    if (!guide) {
      return createErrorResponse(404, "Przewodnik nie został znaleziony");
    }

    // Create appropriate cache control header based on attractions inclusion
    const cacheControl = include_attractions
      ? `public, max-age=${CACHE_TTL_WITH_ATTRACTIONS}`
      : `public, max-age=${CACHE_TTL_SECONDS}`;

    // Calculate response time for monitoring
    const responseTime = Math.round(performance.now() - startTime);

    // Return guide details with cache headers
    return new Response(JSON.stringify(guide), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": cacheControl,
        Vary: "Accept, Accept-Encoding, include_attractions", // Vary header to handle different cache versions
        ETag: etagValue,
        "X-Response-Time": `${responseTime}ms`,
      },
    });
  } catch (error) {
    console.error("Error fetching guide details:", error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return createErrorResponse(
      500,
      "Wystąpił błąd wewnętrzny serwera",
      process.env.NODE_ENV === "development" ? String(error) : undefined
    );
  }
};
