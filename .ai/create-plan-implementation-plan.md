# API Endpoint Implementation Plan: POST /api/plans

## 1. Przegląd punktu końcowego
Punkt końcowy umożliwia zapisanie nowo wygenerowanego planu podróży przez autoryzowanego użytkownika. Plan jest powiązany z wybranym przewodnikiem (`guide_id`) i zawiera szczegółowe dane dotyczące planu oraz parametrów generacji. Po utworzeniu zwracane są szczegóły nowego planu.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** `/api/plans`
- **Parametry:**
  - **Wymagane w body:**
    - `name` (string) – nazwa planu
    - `guide_id` (uuid) – identyfikator przewodnika
    - `content` (object/JSON) – szczegóły planu
    - `generation_params` (object/JSON) – parametry generacji planu
  - **Opcjonalne w body:**
    - `is_favorite` (boolean) – czy plan jest ulubiony (domyślnie false)
- **Request Body:**
  ```json
  {
    "name": "string",
    "guide_id": "uuid",
    "content": { /* dowolny obiekt JSON */ },
    "generation_params": { /* dowolny obiekt JSON */ },
    "is_favorite": true
  }
  ```
- **Wymagane w kontekście:** Uwierzytelniony użytkownik (user_id z sesji lub tokena)

## 3. Wykorzystywane typy
- **CreatePlanCommand** (z `src/types.ts`):
  ```ts
  export interface CreatePlanCommand {
    name: string;
    guide_id: string;
    content: Json;
    generation_params: Json;
    is_favorite?: boolean;
  }
  ```
- **PlanDetailDto** (odpowiedź, z `src/types.ts`):
  ```ts
  export interface PlanDetailDto {
    id: string;
    name: string;
    guide: GuideMinimalDto;
    created_at: string;
    updated_at: string;
    is_favorite: boolean;
    content: Json;
    generation_params: Json;
  }
  ```
- **GuideMinimalDto** (w polu `guide` odpowiedzi)
- **Json** (alias na typ JSON)

## 4. Szczegóły odpowiedzi
- **Status:** 201 Created (po sukcesie)
- **Body:** Szczegóły utworzonego planu w formacie `PlanDetailDto`
- **Kody błędów:**
  - 400 Bad Request – nieprawidłowe dane wejściowe
  - 401 Unauthorized – brak autoryzacji
  - 404 Not Found – nie znaleziono przewodnika
  - 500 Internal Server Error – błąd serwera

## 5. Przepływ danych
1. Klient wysyła żądanie POST z danymi planu.
2. Endpoint:
   - Weryfikuje autoryzację użytkownika (user_id z kontekstu).
   - Waliduje dane wejściowe (Zod).
   - Sprawdza istnienie przewodnika (`guide_id`) i uprawnienia użytkownika.
   - Tworzy nowy rekord w tabeli `plans` z powiązaniem do user_id i guide_id.
   - Zwraca szczegóły nowego planu w formacie `PlanDetailDto`.
3. Logika zapisu i pobierania szczegółów planu powinna być wyodrębniona do serwisu, np. `src/lib/services/plan.service.ts`.

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie:** Wymagane (sprawdzenie user_id w kontekście).
- **Autoryzacja:** Użytkownik może zapisać plan tylko dla przewodnika, do którego ma dostęp (np. publiczny lub jego własny).
- **Walidacja danych:** Użycie Zod do walidacji typów, obecności pól, poprawności UUID.
- **Ochrona przed wstrzyknięciem:** Walidacja i sanityzacja pól JSON.
- **Ograniczenie uprawnień:** Brak możliwości zapisu planu dla innego użytkownika.

## 7. Obsługa błędów
- **400 Bad Request:** Brak wymaganych pól, nieprawidłowe typy, niepoprawny UUID, nieistniejący guide_id.
- **401 Unauthorized:** Brak autoryzacji (brak user_id w kontekście).
- **404 Not Found:** Nie znaleziono przewodnika o podanym guide_id.
- **500 Internal Server Error:** Błąd bazy danych, nieoczekiwany wyjątek.
- **Logowanie błędów:** Błędy serwera logować do konsoli lub systemu monitoringu.

## 8. Rozważania dotyczące wydajności
- **Indeksy:** Upewnić się, że kolumny `user_id`, `guide_id` są zindeksowane.
- **Walidacja JSON:** Ograniczyć rozmiar i głębokość pól `content` i `generation_params`.
- **Transakcje:** Operacje zapisu powinny być atomowe.
- **Ograniczenia ilościowe:** Rozważyć limit liczby planów na użytkownika.

## 9. Etapy wdrożenia
1. **Stworzenie schematu walidacji Zod** dla CreatePlanCommand.
2. **Stworzenie/rozszerzenie serwisu** `plan.service.ts` o metodę `createPlan`.
3. **Implementacja endpointu** w `src/pages/api/plans.ts`:
   - Sprawdzenie autoryzacji użytkownika.
   - Walidacja danych wejściowych.
   - Sprawdzenie istnienia przewodnika i uprawnień.
   - Wywołanie serwisu do utworzenia planu.
   - Zwrócenie odpowiedzi 201 z danymi planu.
4. **Obsługa błędów**: Zwracanie odpowiednich kodów i komunikatów.
5. **Testy jednostkowe i integracyjne**: Walidacja, autoryzacja, przypadki brzegowe.
6. **Logowanie i monitoring**: Dodanie logowania błędów serwera.
7. **Dokumentacja endpointu**: Uzupełnienie OpenAPI/README.
8. **Code review i wdrożenie**. 