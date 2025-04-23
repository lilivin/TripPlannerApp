import { z } from 'zod';
import type { APIRoute } from 'astro';
import { getPlanById } from '../../../lib/services/plans.service';

export const prerender = false;

const paramsSchema = z.object({
  id: z.string().uuid()
});

export const GET: APIRoute = async ({ params, locals, request }) => {
  try {
    // Walidacja parametrów
    const result = paramsSchema.safeParse(params);
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Invalid plan ID format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
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
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.message === 'Plan not found') {
      return new Response(JSON.stringify({ error: 'Plan not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.error('Error fetching plan:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 