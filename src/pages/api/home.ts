import type { APIRoute } from "astro";
import type { SupabaseClient } from "@supabase/supabase-js";
import { homeQuerySchema } from "../../lib/schemas/home.schema";
import { getGuestHomeData, getUserHomeData } from "../../lib/services/home.service";
import { ApiError, createSuccessResponse, createErrorResponse } from "../../lib/utils/api-response";
import { generateMockGuestHomeResponse, generateMockUserHomeResponse } from "../../lib/utils/mock-data";

export const prerender = false;

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

// Define proper type for the locals object
interface RequestLocals {
  supabase: SupabaseClient;
}

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const { supabase } = locals as RequestLocals;

    // Get and validate query parameters
    const url = new URL(request.url);
    const result = homeQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!result.success) {
      console.error("Invalid query parameters:", result.error.format());
      return createErrorResponse(400, "Invalid query parameters", result.error.format());
    }

    // Use mock data for testing if requested
    const useTestMode = url.searchParams.get("testmode") === "true";

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const language = result.data.language || session?.user?.user_metadata?.language_preference || "en";

    if (useTestMode) {
      // Return mock data for testing
      const mockData = session?.user ? generateMockUserHomeResponse() : generateMockGuestHomeResponse();
      return createSuccessResponse(mockData);
    }

    let attempt = 0;
    let lastError = null;

    // Implement retry mechanism
    while (attempt < RETRY_ATTEMPTS) {
      try {
        // Different responses based on authentication state
        if (session?.user) {
          console.log("Fetching user home data for user:", session.user.id);
          // Data for authenticated user
          const userData = await getUserHomeData(supabase, session.user.id, language);
          return createSuccessResponse(userData);
        } else {
          console.log("Fetching guest home data");
          // Data for guest user
          const guestData = await getGuestHomeData(supabase, language);
          return createSuccessResponse(guestData);
        }
      } catch (error) {
        console.error("Error in attempt", attempt + 1, ":", error);
        lastError = error;

        // Only retry on connection/network errors
        if (
          error instanceof Error &&
          (error.message.includes("network") ||
            error.message.includes("connection") ||
            error.message.includes("timeout"))
        ) {
          attempt++;
          if (attempt < RETRY_ATTEMPTS) {
            console.log("Retrying in", RETRY_DELAY, "ms...");
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            continue;
          }
        } else {
          // Don't retry on other errors
          break;
        }
      }
    }

    // Handle error after retries or immediate failure
    console.error("Home API error after all attempts:", lastError);

    if (lastError instanceof ApiError) {
      return lastError.toResponse();
    }

    return createErrorResponse(
      500,
      "An error occurred while fetching homepage data",
      process.env.NODE_ENV === "development" ? { message: (lastError as Error).message } : undefined
    );
  } catch (error) {
    console.error("Unexpected error in home API:", error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return createErrorResponse(
      500,
      "An error occurred while fetching homepage data",
      process.env.NODE_ENV === "development" ? { message: (error as Error).message } : undefined
    );
  }
};
