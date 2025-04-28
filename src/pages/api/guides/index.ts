import type { APIRoute, APIContext } from "astro";
import type { AstroGlobal } from "astro";
import { guidesService } from "../../../lib/services/guides.service";
import { guidesQuerySchema } from "../../../schemas/guides.schema";
import { createGuideSchema } from "../../../schemas/guide-create.schema";
import { ApiError, ApiErrorTypes } from "../../../lib/utils/api-response";
import { createSuccessResponse, createErrorResponse } from "../../../lib/utils/api-response";
import { ResponseCache } from "../../../lib/cache/response-cache";
import type { UpsertGuideCommand } from "../../../types";

export const prerender = false;

// Cache configuration
const CACHE_NAME = "guides-list";
const CACHE_TTL_SECONDS = 600; // 10 minutes

/**
 * GET /api/guides
 *
 * Returns a list of guides with filtering options and pagination.
 * This endpoint provides guide summaries including:
 * - Basic information (title, description, language)
 * - Creator information
 * - Location and recommended days
 * - Average rating
 *
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - creator_id: Filter by creator
 * - language: Filter by language
 * - location: Filter by location name
 * - min_days: Filter by minimum recommended days
 * - max_days: Filter by maximum recommended days
 * - is_published: Filter by publication status (default: true)
 * - search: Search in title and description
 *
 * Responses:
 * - 200 OK: Guides retrieved successfully
 * - 400 Bad Request: Invalid query parameters
 * - 500 Internal Server Error: Server error occurred
 *
 * Performance considerations:
 * - Response is cached for 10 minutes in memory (for identical query parameters)
 * - HTTP cache headers are set for client-side caching
 */
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Validate query parameters
    const validationResult = guidesQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return createErrorResponse(400, "Nieprawidłowe parametry zapytania", validationResult.error.format());
    }

    // Get validated query parameters
    const query = validationResult.data;

    // Generate a cache key from query parameters
    const cacheKey = generateCacheKey(query);

    // Get the cache instance
    const cache = ResponseCache.getInstance();

    // Access Supabase client from context
    const supabase = locals.supabase;

    // Call service method with caching
    const response = await guidesService.getGuides(supabase, query);
    /*
    const response = await cache.getOrSet(
      CACHE_NAME,
      cacheKey,
      () => guidesService.getGuides(supabase, query),
      CACHE_TTL_SECONDS
    );
    */

    // Return successful response with cache headers
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600", // Add browser cache headers (10 minutes)
      },
    });
  } catch (error) {
    console.error("Error fetching guides:", error);

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

/**
 * POST /api/guides
 *
 * Creates a new guide. Requires authentication and creator privileges.
 *
 * Request body:
 * - title: Guide title (required, 5-255 characters)
 * - description: Guide description (required, min 10 characters)
 * - language: Language code (optional, defaults to 'pl')
 * - price: Guide price (optional, defaults to 0)
 * - location_name: Location name (required, 2-255 characters)
 * - recommended_days: Recommended days (optional, defaults to 1)
 * - cover_image_url: Cover image URL (optional, can be null)
 * - is_published: Publication status (optional, defaults to false)
 *
 * Responses:
 * - 201 Created: Guide created successfully
 * - 400 Bad Request: Invalid input data
 * - 401 Unauthorized: Authentication required
 * - 403 Forbidden: Creator privileges required
 * - 500 Internal Server Error: Server error occurred
 */
export const POST: APIRoute = async ({ request, locals }: APIContext) => {
  try {
    // Development mode test header for bypassing authentication
    // IMPORTANT: Use only for testing and remove in production
    const TEST_CREATOR_ID = "00000000-0000-4000-a000-000000000001";
    const isTestMode = process.env.NODE_ENV === "development" && request.headers.get("X-Test-Mode") === "true";

    let creatorId: string | null = null;

    if (isTestMode) {
      // Use the test creator ID or the one provided in headers
      creatorId = request.headers.get("X-Test-Creator-ID") || TEST_CREATOR_ID;
      console.log("⚠️ TEST MODE: Using test creator ID:", creatorId);
    } else {
      // Regular authentication flow
      if (!locals.supabase.auth.getSession) {
        return createErrorResponse(401, "Unauthorized", "Wymagane zalogowanie");
      }

      // Get the current session
      const {
        data: { session },
        error: sessionError,
      } = await locals.supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        return createErrorResponse(401, "Unauthorized", "Błąd podczas weryfikacji sesji");
      }

      if (!session) {
        return createErrorResponse(401, "Unauthorized", "Wymagane zalogowanie");
      }

      // Check if user is a creator
      const { data: creator, error: creatorError } = await locals.supabase
        .from("creators")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (creatorError) {
        console.error("Creator check error:", creatorError);

        // Check if it's a "not found" error or another type of error
        if (creatorError.code === "PGRST116") {
          // Not found
          return createErrorResponse(403, "Forbidden", "Brak uprawnień twórcy");
        }

        return createErrorResponse(500, "Internal Server Error", "Błąd podczas sprawdzania uprawnień twórcy");
      }

      if (!creator) {
        return createErrorResponse(403, "Forbidden", "Brak uprawnień twórcy");
      }

      creatorId = creator.id;
    }

    // Parse and validate input data
    let jsonData;
    try {
      jsonData = await request.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return createErrorResponse(400, "Bad Request", "Nieprawidłowy format JSON");
    }

    // Validate guide data
    const result = createGuideSchema.safeParse(jsonData);

    if (!result.success) {
      // Format validation errors for better readability
      const formattedErrors: Record<string, string[]> = {};
      const errors = result.error.format();

      // Extract error messages without the Zod metadata
      Object.entries(errors).forEach(([key, value]) => {
        if (key !== "_errors" && typeof value === "object" && value !== null && "_errors" in value) {
          formattedErrors[key] = (value as { _errors: string[] })._errors;
        }
      });

      return createErrorResponse(400, "Bad Request", "Nieprawidłowe dane wejściowe", JSON.stringify(formattedErrors));
    }

    // Prepare guide data with proper type handling
    const guideData: UpsertGuideCommand = {
      title: result.data.title,
      description: result.data.description,
      language: result.data.language,
      price: result.data.price,
      location_name: result.data.location_name,
      recommended_days: result.data.recommended_days ?? 1,
      cover_image_url: result.data.cover_image_url,
      is_published: result.data.is_published,
    };

    try {
      // Create guide
      const newGuide = await guidesService.createGuide(locals.supabase, creatorId, guideData);

      // Return response
      return createSuccessResponse(newGuide, 201);
    } catch (serviceError: unknown) {
      console.error("Guide creation error:", serviceError);

      // Handle specific database constraint errors
      if (serviceError instanceof ApiError) {
        return serviceError.toResponse();
      }

      // Safely type the error for database error codes
      interface DatabaseError {
        code: string;
      }
      const isDatabaseError = (err: unknown): err is DatabaseError =>
        typeof err === "object" && err !== null && "code" in err && typeof (err as any).code === "string";

      // Check for specific Supabase/PostgreSQL error codes
      if (isDatabaseError(serviceError)) {
        switch (serviceError.code) {
          case "23505": // Unique violation
            return createErrorResponse(409, "Conflict", "Przewodnik o takich parametrach już istnieje");
          case "23503": // Foreign key violation
            return createErrorResponse(400, "Bad Request", "Nieprawidłowe odniesienie do innego zasobu");
          case "23502": // Not null violation
            return createErrorResponse(400, "Bad Request", "Brak wymaganego pola");
        }
      }

      // Generic error
      return createErrorResponse(
        500,
        "Internal Server Error",
        "Wystąpił nieoczekiwany błąd podczas tworzenia przewodnika",
        process.env.NODE_ENV === "development" ? String(serviceError) : undefined
      );
    }
  } catch (error) {
    console.error("Unhandled error creating guide:", error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    // Unhandled exceptions should not expose details in production
    return createErrorResponse(
      500,
      "Internal Server Error",
      "Wystąpił nieoczekiwany błąd podczas tworzenia przewodnika",
      process.env.NODE_ENV === "development" ? String(error) : undefined
    );
  }
};

/**
 * Generate a cache key based on query parameters
 * @param query The query parameters
 * @returns A cache key string
 */
function generateCacheKey(query: Record<string, any>): string {
  return Object.entries(query)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");
}
