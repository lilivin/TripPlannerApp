import type { APIRoute } from 'astro';
import { z } from 'zod';
import { guidesService } from '../../../lib/services/guides.service';
import { generatePlan } from '../../../lib/services/ai-plan-generation.service';
import { ApiError } from '../../../lib/utils/api-response';
import type { GeneratePlanCommand } from '../../../types';
import { supabaseClient } from '../../../db/supabase.client';

// Zod schema dla GeneratePlanCommand
const generatePlanSchema = z.object({
  guide_id: z.string().uuid(),
  days: z.number().int().min(1).max(30),
  preferences: z.object({
    include_tags: z.array(z.string().uuid()).optional(),
    exclude_tags: z.array(z.string().uuid()).optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    include_meals: z.boolean().optional(),
    transportation_mode: z.string().optional(),
  }).optional(),
});

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    // TODO: Wdrożenie autoryzacji produkcyjnej (userId z sesji lub locals)
    // Tymczasowo mock userId na czas developmentu
    const mockUserId = '00000000-0000-0000-0000-000000000000';
    const userId = mockUserId;
    // ---
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Brak autoryzacji' }), { status: 401 });
    }

    // 2. Walidacja danych wejściowych
    const body = await context.request.json();
    const parseResult = generatePlanSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: 'Nieprawidłowe dane wejściowe', details: parseResult.error.errors }), { status: 400 });
    }
    // Poprawka typowania preferences (wymagane przez GeneratePlanCommand)
    const command: GeneratePlanCommand = {
      guide_id: parseResult.data.guide_id,
      days: parseResult.data.days,
      preferences: parseResult.data.preferences || {},
    };

    // 3. Pobranie przewodnika
    const guide = await guidesService.getGuideDetails(supabaseClient, command.guide_id, true);
    if (!guide) {
      return new Response(JSON.stringify({ error: 'Przewodnik nie został znaleziony' }), { status: 404 });
    }

    // 4. Sprawdzenie uprawnień użytkownika do przewodnika
    if (!guide.is_published && guide.creator.id !== userId) {
      // Sprawdź user_guide_access
      const { data: access } = await supabaseClient
        .from('user_guide_access')
        .select('access_type')
        .eq('guide_id', guide.id)
        .eq('user_id', userId)
        .maybeSingle();
      if (!access) {
        return new Response(JSON.stringify({ error: 'Brak dostępu do przewodnika' }), { status: 404 });
      }
    }

    // 5. Wywołanie serwisu AI do generacji planu
    const plan = await generatePlan(supabaseClient, guide, command, userId);

    // 6. Zwrócenie odpowiedzi
    return new Response(JSON.stringify(plan), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    // 7. Obsługa błędów
    console.error('Błąd endpointu /api/plans/generate:', err);
    if (err instanceof ApiError) {
      return err.toResponse();
    }
    return new Response(JSON.stringify({ error: 'Błąd serwera lub AI' }), { status: 500 });
  }
}; 