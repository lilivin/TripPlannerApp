import { z } from "zod";
import type { APIRoute } from "astro";

export const prerender = false;

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const updateOfflineStatusSchema = z.object({
  is_cached: z.boolean(),
});

// Symulowane dane o statusie offline
const offlineStatusCache: Record<string, { is_cached: boolean; last_synced_at: string }> = {};

export const GET: APIRoute = async ({ params, request }) => {
  try {
    // Walidacja parametrów
    const result = paramsSchema.safeParse(params);
    if (!result.success) {
      return new Response(JSON.stringify({ error: "Invalid plan ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const planId = params.id as string;

    // Pobierz ID użytkownika z nagłówka X-User-ID
    const userId = request.headers.get("X-User-ID");
    console.log(`Fetching offline status for plan: ${planId}, user: ${userId || "anonymous"}`);

    // Pobranie danych o statusie offline (symulacja)
    // W rzeczywistej implementacji powinniśmy sprawdzić bazę danych
    const cacheKey = `${userId || "anonymous"}_${planId}`;
    const status = offlineStatusCache[cacheKey] || {
      is_cached: false,
      last_synced_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error fetching offline status:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    // Walidacja parametrów URL
    const paramsResult = paramsSchema.safeParse(params);
    if (!paramsResult.success) {
      return new Response(JSON.stringify({ error: "Invalid plan ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parsowanie body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja body
    const bodyResult = updateOfflineStatusSchema.safeParse(requestBody);
    if (!bodyResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid offline status data", details: bodyResult.error.format() }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const planId = params.id as string;
    const updateData = bodyResult.data;

    // Pobierz ID użytkownika z nagłówka X-User-ID
    const userId = request.headers.get("X-User-ID");
    console.log(
      `Updating offline status for plan: ${planId}, user: ${userId || "anonymous"}, status: ${updateData.is_cached}`
    );

    // Symulacja aktualizacji statusu offline
    // W rzeczywistej implementacji powinniśmy zaktualizować bazę danych
    const cacheKey = `${userId || "anonymous"}_${planId}`;
    offlineStatusCache[cacheKey] = {
      is_cached: updateData.is_cached,
      last_synced_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(offlineStatusCache[cacheKey]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error updating offline status:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
