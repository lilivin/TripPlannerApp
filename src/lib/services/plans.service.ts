import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type {
  PlanSummaryDto,
  PlanQuery,
  PlanListResponse,
  PaginationInfo,
  PlanDetailDto,
  CreatePlanCommand,
} from "../../types";
import { ApiError } from "../utils/api-response";

export async function getUserPlans(
  supabase: SupabaseClient<Database>,
  userId: string,
  query: PlanQuery
): Promise<PlanListResponse> {
  try {
    // Building the base query
    let planQuery = supabase
      .from("plans")
      .select(
        `
        id,
        name,
        created_at,
        updated_at,
        is_favorite,
        guide:guides(id, title, location_name)
      `,
        { count: "exact" }
      )
      .eq("user_id", userId)
      .is("deleted_at", null);

    // Apply filters
    if (query.guide_id) {
      planQuery = planQuery.eq("guide_id", query.guide_id);
    }

    if (query.is_favorite !== undefined) {
      planQuery = planQuery.eq("is_favorite", query.is_favorite);
    }

    // Calculate pagination offset
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    // Execute query with pagination
    const { data, count, error } = await planQuery
      .range(offset, offset + limit - 1)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    // Transform results to DTO format
    const planDtos: PlanSummaryDto[] = data.map((plan: Record<string, unknown>) => ({
      id: plan.id as string,
      name: plan.name as string,
      guide: {
        id: (plan.guide as Record<string, unknown>).id as string,
        title: (plan.guide as Record<string, unknown>).title as string,
        location_name: (plan.guide as Record<string, unknown>).location_name as string,
      },
      created_at: plan.created_at as string,
      updated_at: plan.updated_at as string,
      is_favorite: plan.is_favorite as boolean,
    }));

    // Prepare pagination info
    const total = count || 0;
    const pagination: PaginationInfo = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };

    return {
      data: planDtos,
      pagination,
    };
  } catch (error) {
    console.error("Error fetching user plans:", error);
    throw error;
  }
}

export async function getPlanById(
  supabase: SupabaseClient<Database>,
  planId: string,
  userId: string | null
): Promise<PlanDetailDto> {
  try {
    // Pobierz plan wraz z podstawowymi danymi przewodnika
    let query = supabase
      .from("plans")
      .select(
        `
        id, 
        name, 
        content, 
        generation_params, 
        created_at, 
        updated_at, 
        is_favorite,
        guide:guides(
          id, 
          title, 
          location_name
        )
      `
      )
      .eq("id", planId)
      .is("deleted_at", null);

    // Dodaj filtr użytkownika tylko gdy userId jest dostępne
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Plan not found");
      }
      throw error;
    }

    if (!data) {
      throw new Error("Plan not found");
    }

    // Formatowanie odpowiedzi zgodnie z PlanDetailDto
    return {
      id: data.id,
      name: data.name,
      guide: {
        id: data.guide.id,
        title: data.guide.title,
        location_name: data.guide.location_name,
      },
      content: data.content,
      generation_params: data.generation_params,
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_favorite: data.is_favorite,
    };
  } catch (error) {
    console.error("Error fetching plan details:", error);
    throw error;
  }
}

export async function createPlan(
  supabase: SupabaseClient<Database>,
  userId: string,
  planData: CreatePlanCommand
): Promise<PlanDetailDto> {
  // 1. Sprawdź istnienie przewodnika (mock: zawsze istnieje)
  // TODO: Zaimplementuj sprawdzenie uprawnień użytkownika do przewodnika
  const { guide_id } = planData;
  const { data: guide, error: guideError } = await supabase
    .from("guides")
    .select("id, title, location_name")
    .eq("id", guide_id)
    .is("deleted_at", null)
    .single();

  if (guideError || !guide) {
    throw ApiError.notFoundError("Przewodnik");
  }

  // TODO: Sprawdź uprawnienia użytkownika do przewodnika (mock: zawsze OK)

  // 2. Utwórz nowy plan
  const { data: newPlan, error: planError } = await supabase
    .from("plans")
    .insert({
      name: planData.name,
      guide_id: planData.guide_id,
      user_id: userId,
      content: planData.content,
      generation_params: planData.generation_params,
      is_favorite: planData.is_favorite ?? false,
    })
    .select("*")
    .single();

  if (planError || !newPlan) {
    throw ApiError.internalError("Błąd podczas tworzenia planu");
  }

  // 3. Zwróć szczegóły planu w formacie PlanDetailDto
  return {
    id: newPlan.id,
    name: newPlan.name,
    guide: {
      id: guide.id,
      title: guide.title,
      location_name: guide.location_name,
    },
    created_at: newPlan.created_at,
    updated_at: newPlan.updated_at,
    is_favorite: newPlan.is_favorite,
    content: newPlan.content,
    generation_params: newPlan.generation_params,
  };
}

export async function updatePlan(
  supabase: SupabaseClient<Database>,
  planId: string,
  userId: string | null,
  updateData: {
    name?: string;
    content?: Record<string, unknown>;
    is_favorite?: boolean;
  }
): Promise<PlanDetailDto> {
  try {
    // Sprawdź, czy plan istnieje - to rzuci błąd, jeśli plan nie istnieje
    await getPlanById(supabase, planId, userId);

    // Przygotuj dane do aktualizacji
    const updatePayload: Record<string, unknown> = {};
    if (updateData.name !== undefined) updatePayload.name = updateData.name;
    if (updateData.content !== undefined) updatePayload.content = updateData.content;
    if (updateData.is_favorite !== undefined) updatePayload.is_favorite = updateData.is_favorite;
    updatePayload.updated_at = new Date().toISOString();

    // Aktualizuj plan
    let query = supabase.from("plans").update(updatePayload).eq("id", planId).is("deleted_at", null);

    // Dodaj filtr użytkownika tylko gdy userId jest dostępne
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { error } = await query;

    if (error) {
      console.error("Error updating plan:", error);
      throw new Error("Failed to update plan");
    }

    // Pobierz zaktualizowany plan
    return await getPlanById(supabase, planId, userId);
  } catch (error) {
    console.error("Error in updatePlan:", error);
    throw error;
  }
}
