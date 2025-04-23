# API Endpoint Implementation Plan: POST /api/plans/generate

## 1. Przegląd punktu końcowego
Punkt końcowy `POST /api/plans/generate` umożliwia autoryzowanemu użytkownikowi wygenerowanie planu podróży na podstawie wybranego przewodnika, liczby dni oraz preferencji. Plan generowany jest przez AI (np. OpenAI) i zwracany bez zapisu w bazie.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** `/api/plans/generate`
- **Parametry:**
  - **Wymagane w body:**
    - `guide_id` (uuid) – identyfikator przewodnika
    - `days` (integer) – liczba dni
    - `preferences` (object):
      - `include_tags` (opcjonalne, array uuid)
      - `exclude_tags` (opcjonalne, array uuid)
      - `start_time` (opcjonalne, string)
      - `end_time` (opcjonalne, string)
      - `include_meals` (opcjonalne, boolean)
      - `transportation_mode` (opcjonalne, string)
- **Request Body:**
  ```json
  {
    "guide_id": "uuid",
    "days": 3,
    "preferences": {
      "include_tags": ["uuid"],
      "exclude_tags": ["uuid"],
      "start_time": "09:00",
      "end_time": "18:00",
      "include_meals": true,
      "transportation_mode": "car"
    }
  }
  ```

## 3. Wykorzystywane typy
- **GeneratePlanCommand** (input):
  ```ts
  export interface GeneratePlanCommand {
    guide_id: string;
    days: number;
    preferences: {
      include_tags?: string[];
      exclude_tags?: string[];
      start_time?: string;
      end_time?: string;
      include_meals?: boolean;
      transportation_mode?: string;
    };
  }
  ```
- **GeneratePlanResponse** (output):
  ```ts
  export interface GeneratePlanResponse {
    content: Json;
    generation_params: Json;
    ai_generation_cost: number | null;
  }
  ```
- **Zod schema** do walidacji wejścia (do utworzenia).

## 4. Szczegóły odpowiedzi
- **Status:** 200 OK (po sukcesie)
- **Body:**
  ```json
  {
    "content": { /* wygenerowany plan */ },
    "generation_params": { /* parametry generacji */ },
    "ai_generation_cost": 0.123456
  }
  ```
- **Kody błędów:**
  - 400 Bad Request – nieprawidłowe dane wejściowe
  - 401 Unauthorized – brak autoryzacji
  - 404 Not Found – nie znaleziono przewodnika lub brak dostępu
  - 500 Internal Server Error – błąd serwera lub AI

## 5. Przepływ danych
1. Klient wysyła żądanie POST z danymi wejściowymi.
2. Endpoint:
   - Weryfikuje autoryzację użytkownika (user_id z sesji/tokena).
   - Waliduje dane wejściowe (Zod).
   - Sprawdza istnienie przewodnika (`guide_id`) i uprawnienia użytkownika.
   - Pobiera dane przewodnika i powiązanych atrakcji.
   - Formatuje dane do promptu AI.
   - Wywołuje usługę AI (np. OpenAI) z odpowiednimi parametrami.
   - Przetwarza odpowiedź AI, wylicza koszt generacji.
   - Zwraca wygenerowany plan, parametry generacji i koszt.
3. Logika generowania powinna być wyodrębniona do serwisu, np. `src/lib/services/ai-plan-generation.service.ts`.

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie:** Wymagane (sprawdzenie user_id w kontekście).
- **Autoryzacja:** Użytkownik może generować plan tylko dla przewodnika, do którego ma dostęp (publiczny lub zakupiony).
- **Walidacja danych:** Użycie Zod do walidacji typów, obecności pól, poprawności UUID.
- **Ochrona przed nadużyciami:** Limit liczby generacji na użytkownika, limit kosztów AI.
- **Ochrona przed injection:** Walidacja i sanityzacja pól wejściowych.

## 7. Obsługa błędów
- **400 Bad Request:** Brak wymaganych pól, nieprawidłowe typy, niepoprawny UUID, nieprawidłowa liczba dni.
- **401 Unauthorized:** Brak autoryzacji (brak user_id w kontekście).
- **404 Not Found:** Nie znaleziono przewodnika lub brak dostępu.
- **500 Internal Server Error:** Błąd serwera, błąd AI, timeout.
- **Logowanie błędów:** Błędy serwera logować do konsoli lub systemu monitoringu.

## 8. Rozważania dotyczące wydajności
- **Ograniczenie liczby generacji:** Limit na użytkownika/dzień.
- **Timeout dla zapytań do AI:** Ograniczenie czasu oczekiwania na odpowiedź.
- **Buforowanie danych przewodnika/atrakcji:** Unikanie wielokrotnych zapytań do bazy.
- **Optymalizacja promptu:** Minimalizacja kosztów i czasu generacji.

## 9. Etapy wdrożenia
1. **Stworzenie Zod schema** dla `GeneratePlanCommand`.
2. **Stworzenie serwisu** `ai-plan-generation.service.ts` z metodą `generatePlan`.
3. **Implementacja endpointu** w `src/pages/api/plans/generate.ts`:
   - Sprawdzenie autoryzacji użytkownika.
   - Walidacja danych wejściowych.
   - Sprawdzenie istnienia przewodnika i uprawnień.
   - Wywołanie serwisu AI do generacji planu.
   - Zwrócenie odpowiedzi 200 z danymi planu.
4. **Obsługa błędów:** Zwracanie odpowiednich kodów i komunikatów.
5. **Testy jednostkowe i integracyjne:** Walidacja, autoryzacja, przypadki brzegowe, obsługa błędów AI.
6. **Logowanie i monitoring:** Dodanie logowania błędów serwera i AI.
7. **Dokumentacja endpointu:** Uzupełnienie OpenAPI/README.
8. **Code review i wdrożenie.** 