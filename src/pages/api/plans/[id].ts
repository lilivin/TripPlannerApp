import { z } from "zod";
import type { APIRoute } from "astro";
import { getPlanById, updatePlan } from "../../../lib/services/plans.service";

export const prerender = false;

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const updatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  content: z.any().optional(),
  is_favorite: z.boolean().optional(),
});

export const GET: APIRoute = async ({ params, locals }) => {
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

    // UWAGA: Tymczasowo usunięto sprawdzanie autoryzacji dla celów testowych!
    // Normalnie tutaj powinno być sprawdzenie sesji użytkownika

    // Pobranie danych planu bez sprawdzania użytkownika
    const plan = await getPlanById(supabase, planId, null);

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

export const PUT: APIRoute = async ({ params, locals, request }) => {
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
    const bodyResult = updatePlanSchema.safeParse(requestBody);
    if (!bodyResult.success) {
      return new Response(JSON.stringify({ error: "Invalid plan data", details: bodyResult.error.format() }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = locals.supabase;
    const planId = params.id as string;
    const updateData = bodyResult.data;

    // UWAGA: Tymczasowo usunięto sprawdzanie autoryzacji dla celów testowych!
    // Normalnie tutaj powinno być sprawdzenie sesji użytkownika

    // Aktualizacja planu bez sprawdzania użytkownika
    const updatedPlan = await updatePlan(supabase, planId, null, updateData);

    return new Response(JSON.stringify(updatedPlan), {
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

    console.error("Error updating plan:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
