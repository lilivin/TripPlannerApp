import type { APIRoute } from "astro";
import { getUserPlans, createPlan } from "../../../lib/services/plans.service";
import { plansQuerySchema, createPlanCommandSchema } from "../../../lib/schemas/plans.schema";
import { ApiError, createSuccessResponse } from "../../../lib/utils/api-response";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Get supabase client from locals
    const { supabase } = locals;

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const result = plansQuerySchema.safeParse(queryParams);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: result.error.format(),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Pobierz ID użytkownika z nagłówka X-User-ID lub query param user_id
    // To tymczasowe rozwiązanie do testów
    let userId = request.headers.get("X-User-ID") || queryParams.user_id;

    // Jeśli brak ID, użyj testowego ID
    if (!userId) {
      userId = "57e6776e-950c-4b0c-8e14-2a9bed080d3a";
      console.log("Using default test user ID:", userId);
    } else {
      console.log("Using provided user ID:", userId);
    }

    // Get user plans
    const plans = await getUserPlans(supabase, userId, result.data);

    // Return response
    return new Response(JSON.stringify(plans), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in plans endpoint:", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // TODO: Zastąp mock userId pobieraniem z sesji po wdrożeniu autoryzacji
    const mockUserId = "57e6776e-950c-4b0c-8e14-2a9bed080d3a";

    // Parsowanie JSON
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      return ApiError.validationError("Nieprawidłowy format JSON").toResponse();
    }

    // Walidacja Zod
    const parseResult = createPlanCommandSchema.safeParse(requestBody);
    if (!parseResult.success) {
      return ApiError.validationError("Nieprawidłowe dane planu", parseResult.error.format()).toResponse();
    }
    const planData = parseResult.data;

    // TODO: Sprawdź autoryzację użytkownika po wdrożeniu auth
    if (!mockUserId) {
      return ApiError.authenticationError().toResponse();
    }

    // TODO: Wywołaj serwis do utworzenia planu, obsłuż błędy domenowe
    try {
      // Jawne przypisanie wymaganych pól, by uniknąć linter error
      const createPlanInput = {
        name: planData.name,
        guide_id: planData.guide_id,
        content: planData.content,
        generation_params: planData.generation_params,
        is_favorite: planData.is_favorite ?? false,
      };
      const result = await createPlan(locals.supabase, mockUserId, createPlanInput);
      return createSuccessResponse(result, 201);
    } catch (serviceError) {
      if (serviceError instanceof ApiError) {
        return serviceError.toResponse();
      }
      console.error("Unexpected service error:", serviceError);
      return ApiError.internalError("Wystąpił nieoczekiwany błąd podczas tworzenia planu").toResponse();
    }
  } catch (error) {
    console.error("Error creating plan:", error);
    return ApiError.internalError("Wystąpił błąd podczas tworzenia planu").toResponse();
  }
};
