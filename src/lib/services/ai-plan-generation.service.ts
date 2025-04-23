import type { SupabaseClient } from '@supabase/supabase-js';
import type { GeneratePlanCommand, GeneratePlanResponse, GuideDetailDto } from '../../types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || import.meta.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o';

export async function generatePlan(
  supabase: SupabaseClient,
  guide: GuideDetailDto,
  command: GeneratePlanCommand,
  userId: string
): Promise<GeneratePlanResponse> {
  // Przygotuj prompt na podstawie przewodnika i preferencji
  const prompt = `Wygeneruj plan podróży na ${command.days} dni na podstawie przewodnika: ${guide.title}. Preferencje: ${JSON.stringify(command.preferences)}.`;

  if (!OPENROUTER_API_KEY) {
    throw new Error('Brak klucza OPENROUTER_API_KEY w zmiennych środowiskowych');
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'Jesteś asystentem podróży. Odpowiadaj w formacie JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2048,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Błąd AI: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    let aiMessage = data.choices[0].message.content.trim();
    // Usuń blokowe znaczniki kodu
    if (aiMessage.startsWith('```json')) {
      aiMessage = aiMessage.slice(7);
    }
    if (aiMessage.startsWith('```')) {
      aiMessage = aiMessage.slice(3);
    }
    if (aiMessage.endsWith('```')) {
      aiMessage = aiMessage.slice(0, -3);
    }
    let content;
    try {
      content = JSON.parse(aiMessage);
    } catch (e) {
      console.error('Nieprawidłowy JSON z AI:', aiMessage);
      throw new Error('AI zwróciło nieprawidłowy JSON');
    }
    // Koszt na podstawie usage (jeśli dostępny)
    const ai_generation_cost = data.usage?.total_cost ?? null;

    return {
      content,
      generation_params: {
        model: MODEL,
        prompt,
        preferences: command.preferences,
        days: command.days,
        guide_id: command.guide_id
      },
      ai_generation_cost
    };
  } catch (err: any) {
    console.error('Błąd wywołania AI:', err);
    throw new Error('Błąd generowania planu przez AI');
  }
} 