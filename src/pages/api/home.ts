import type { APIRoute } from "astro";
import { homeQuerySchema } from "../../lib/schemas/home.schema";
import { getGuestHomeData, getUserHomeData } from "../../lib/services/home.service";
import { ApiError, createSuccessResponse, createErrorResponse } from "../../lib/utils/api-response";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const { supabase } = locals;

    // Pobranie i walidacja parametrów zapytania
    const url = new URL(request.url);
    const result = homeQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!result.success) {
      return createErrorResponse(400, "Nieprawidłowe parametry zapytania", result.error.format());
    }

    // Pobranie sesji użytkownika
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const language = result.data.language || session?.user?.user_metadata?.language_preference || "pl";

    // Różne odpowiedzi w zależności od stanu uwierzytelnienia
    if (session?.user) {
      // Dane dla zalogowanego użytkownika
      const userData = await getUserHomeData(supabase, session.user.id, language);
      return createSuccessResponse(userData);
    } else {
      // Dane dla niezalogowanego gościa
      const guestData = await getGuestHomeData(supabase, language);
      return createSuccessResponse(guestData);
    }
  } catch (error) {
    console.error("Home API error:", error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return createErrorResponse(
      500,
      "Wystąpił błąd podczas pobierania danych strony głównej",
      process.env.NODE_ENV === "development" ? { message: (error as Error).message } : undefined
    );
  }
};
