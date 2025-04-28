import { z } from "zod";
import type { APIRoute } from "astro";
import { getPlanById } from "../../../../lib/services/plans.service";

export const prerender = false;

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export const GET: APIRoute = async ({ params, locals, request }) => {
  try {
    // Walidacja parametrów
    const result = paramsSchema.safeParse(params);
    if (!result.success) {
      return new Response(JSON.stringify({ error: "Invalid plan ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = locals.supabase;
    const planId = params.id as string;

    // Pobierz ID użytkownika z nagłówka X-User-ID
    // To tymczasowe rozwiązanie do testów
    const userId = request.headers.get("X-User-ID");
    console.log(`Getting plan details for: ${planId}, user: ${userId || "anonymous"}`);

    // Pobranie danych planu
    const plan = await getPlanById(supabase, planId, userId || null);

    return new Response(JSON.stringify(plan), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Forbidden") {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message === "Plan not found") {
        return new Response(JSON.stringify({ error: "Plan not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    console.error("Error fetching plan:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals, request }) => {
  try {
    // Walidacja parametrów
    const result = paramsSchema.safeParse(params);
    if (!result.success) {
      return new Response(JSON.stringify({ error: "Invalid plan ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = locals.supabase;
    const planId = params.id as string;

    // Pobierz ID użytkownika z nagłówka X-User-ID
    const userId = request.headers.get("X-User-ID");
    console.log(`Deleting plan: ${planId}, user: ${userId || "anonymous"}`);

    // W rzeczywistej implementacji należałoby sprawdzić uprawnienia użytkownika do usuwania tego planu
    // W tej wersji symulacyjnej po prostu zezwalamy na usunięcie

    // Soft delete - ustawiamy deleted_at zamiast faktycznego usunięcia
    let query = supabase.from("plans").update({ deleted_at: new Date().toISOString() }).eq("id", planId);

    // Jeśli mamy ID użytkownika, używamy go do filtrowania
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { error } = await query;

    if (error) {
      // Obsługa typowych błędów bazodanowych
      if (error.code === "PGRST116") {
        return new Response(JSON.stringify({ error: "Plan not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw error;
    }

    // Zwracamy pusty sukces (204 No Content)
    return new Response(null, {
      status: 204,
    });
  } catch (error: unknown) {
    console.error("Error deleting plan:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
