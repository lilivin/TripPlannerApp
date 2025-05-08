import type { SupabaseClient } from "@supabase/supabase-js";
import type { GeneratePlanCommand, GeneratePlanResponse, GuideDetailDto } from "../../types";
import type { Json } from "../../db/database.types";
import { OpenRouterService } from "./openrouter";

const MODEL = "openai/gpt-4o";

/**
 * Generuje plan podróży na podstawie przewodnika i preferencji użytkownika
 * Wykorzystuje OpenRouterService do komunikacji z API AI
 */
export async function generatePlan(
  supabase: SupabaseClient,
  guide: GuideDetailDto,
  command: GeneratePlanCommand,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: string
): Promise<GeneratePlanResponse> {
  // Extract attractions data to use in the prompt
  const attractions = guide.attractions || [];

  // Sprawdź czy lista atrakcji nie jest pusta
  if (attractions.length === 0) {
    throw new Error("Przewodnik nie zawiera żadnych atrakcji");
  }

  // Prepare attractions data in a structured way for the AI
  const attractionsData = attractions.map((attraction) => ({
    id: attraction.id,
    name: attraction.name,
    description: attraction.description.substring(0, 150) + (attraction.description.length > 150 ? "..." : ""),
    is_highlight: attraction.is_highlight,
    address: attraction.address,
  }));

  // Przygotuj prompt, który wymaga od AI stworzenia struktury JSON z dniami i atrakcjami
  const prompt = `Stwórz szczegółowy plan podróży na ${command.days} dni dla miejsca "${guide.location_name}" na podstawie tylko tych atrakcji:
${attractionsData.map((a) => `- ${a.name} ${a.is_highlight ? "(highlight)" : ""}`).join("\n")}

Uwzględnij preferencje:
- Dni: ${command.days}
${command.preferences.start_time ? `- Początek dnia: ${command.preferences.start_time}` : ""}
${command.preferences.end_time ? `- Koniec dnia: ${command.preferences.end_time}` : ""}
${command.preferences.include_meals ? "- Uwzględnij posiłki" : ""}
${command.preferences.transportation_mode ? `- Transport: ${command.preferences.transportation_mode}` : ""}

Odpowiedź MUSI zawierać strukturę JSON z listą dni i atrakcji w formacie:
{
  "days": [
    {
      "dayNumber": 1,
      "attractions": [
        {
          "id": "[ID atrakcji z listy]",
          "name": "[Nazwa atrakcji]",
          "description": "[Opis atrakcji]",
          "visitDuration": 60, // czas zwiedzania w minutach
          "startTime": "10:00",
          "endTime": "11:00",
          "address": "[Adres atrakcji]"
        }
      ]
    }
  ]
}

NIE DODAWAJ żadnych atrakcji spoza listy. UŻYWAJ tylko istniejących ID atrakcji z podanej powyżej listy.`;

  console.log("AI Prompt:", prompt);

  try {
    // Pobierz klucz API z zmiennych środowiskowych
    const apiKey = import.meta.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("Brak klucza API dla OpenRouter");
      throw new Error("Brak klucza API dla generowania planu");
    }

    // Inicjalizacja serwisu OpenRouter z jawnym podaniem klucza API
    const openRouter = new OpenRouterService({
      apiKey,
      defaultModel: MODEL,
      defaultParams: {
        max_tokens: 1500,
        temperature: 0.7,
      },
    });

    try {
      // Generowanie odpowiedzi tekstowej
      console.log("Generowanie odpowiedzi tekstowej...");
      const response = await openRouter.generateChatCompletion(
        [
          {
            role: "system",
            content: "Jesteś asystentem podróży. Tworzysz plany zwiedzania w formacie JSON zgodnie z podaną strukturą.",
          },
          { role: "user", content: prompt },
        ],
        {
          model: MODEL,
          params: {
            temperature: 0.7,
            max_tokens: 1500,
          },
        }
      );

      console.log("OpenRouter odpowiedział:", response.choices?.length > 0 ? "sukces" : "brak odpowiedzi");

      // Pobierz zawartość z pierwszej odpowiedzi
      const content = response.choices[0]?.message?.content || "Nie udało się wygenerować planu.";

      // Spróbuj znaleźć strukturę JSON w odpowiedzi
      let parsedContent;
      try {
        // Próba wyodrębnienia JSON z odpowiedzi
        const jsonMatch =
          content.match(/```json([\s\S]*?)```/) || content.match(/```([\s\S]*?)```/) || content.match(/({[\s\S]*})/);
        const jsonString = jsonMatch ? jsonMatch[1].trim() : content;
        parsedContent = JSON.parse(jsonString);
        console.log("Sparsowana zawartość JSON:", parsedContent);
      } catch (parseError) {
        console.error("Błąd parsowania JSON z odpowiedzi:", parseError);
        // Jeśli parsowanie się nie powiedzie, utwórz pustą strukturę
        parsedContent = { days: [] };
      }

      // Mapuj odpowiedź do wymaganego formatu
      return {
        content: {
          title: `Plan na ${command.days} dni w ${guide.location_name}`,
          summary: content,
          days: parsedContent.days || [],
        } as Json,
        generation_params: {
          model: MODEL,
          days: command.days,
          guide_id: command.guide_id,
          preferences: command.preferences,
        } as Json,
        ai_generation_cost: null,
      };
    } catch (error) {
      console.error("Błąd generowania odpowiedzi:", error);

      // Zwróć informację o błędzie w formie planu (poprawiony format)
      return {
        content: {
          title: `Plan nie mógł zostać wygenerowany`,
          summary: "Wystąpił problem z serwisem AI. Spróbuj ponownie później lub skontaktuj się z administracją.",
          error: String(error),
          days: [],
        } as Json,
        generation_params: {
          model: MODEL,
          days: command.days,
          guide_id: command.guide_id,
          preferences: command.preferences,
        } as Json,
        ai_generation_cost: null,
      };
    }
  } catch (error: unknown) {
    console.error("Błąd wywołania AI:", error);
    throw new Error("Błąd generowania planu przez AI");
  }
}
