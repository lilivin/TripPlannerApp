# API Endpoint Implementation Plan: GET /api/attractions/{id}

## 1. Przegląd punktu końcowego
Endpoint służy do pobierania szczegółowych informacji o konkretnej atrakcji turystycznej na podstawie jej unikatowego identyfikatora. Zwraca pełne informacje o atrakcji, w tym dane geolokalizacyjne, informacje o twórcy, tagi, godziny otwarcia oraz inne metadane.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- Struktura URL: `/api/attractions/{id}`
- Parametry:
  - Wymagane: `id` (UUID atrakcji w ścieżce URL)
  - Opcjonalne: brak
- Request Body: brak (metoda GET)

## 3. Wykorzystywane typy
- **AttractionDetailDto**: Główny typ zwracany przez endpoint
- **GeolocationDto**: Reprezentuje dane geolokalizacyjne atrakcji
- **CreatorMinimalDto**: Minimalne informacje o twórcy atrakcji
- **TagDto**: Informacje o tagach przypisanych do atrakcji

## 4. Szczegóły odpowiedzi
- Struktura odpowiedzi:
  ```typescript
  AttractionDetailDto {
    id: string;
    name: string;
    description: string;
    address: string;
    geolocation: GeolocationDto;
    opening_hours: Json | null;
    contact_info: Json | null;
    images: string[];
    creator: CreatorMinimalDto;
    average_visit_time_minutes: number | null;
    ticket_price_info: string | null;
    accessibility_info: string | null;
    tags: TagDto[];
  }
  ```
- Kody statusu:
  - 200 OK: Atrakcja została znaleziona i zwrócona
  - 404 Not Found: Atrakcja o podanym ID nie istnieje lub jest usunięta (soft-deleted)
  - 500 Internal Server Error: Błąd serwera podczas przetwarzania żądania

## 5. Przepływ danych
1. Endpoint odbiera żądanie GET z parametrem `id` w ścieżce URL
2. Endpoint waliduje poprawność formatu ID (UUID)
3. Serwis wyszukuje atrakcję w bazie danych:
   - Odpytuje tabelę `attractions` gdzie `id` = podane ID i `deleted_at` jest null
   - Dołącza dane twórcy z tabeli `creators`
   - Dołącza powiązane tagi z tabel `attraction_tags` i `tags`
4. Jeśli atrakcja nie istnieje, zwraca 404
5. Jeśli atrakcja istnieje, mapuje dane do formatu `AttractionDetailDto` i zwraca z kodem 200

## 6. Względy bezpieczeństwa
- Endpoint jest publicznie dostępny (nie wymaga uwierzytelnienia)
- Konieczne zabezpieczenie przed atakami SQL Injection (zapewnione przez Supabase)
- Walidacja ID atrakcji za pomocą Zod aby zapobiec nieprawidłowym formatom
- Nie należy ujawniać informacji o usuniętych (soft-deleted) atrakcjach

## 7. Obsługa błędów
- Nieprawidłowy format UUID: Zwróć 400 Bad Request z odpowiednim komunikatem
- Atrakcja nie istnieje: Zwróć 404 Not Found
- Atrakcja jest usunięta (soft-deleted): Zwróć 404 Not Found (traktowane jak nieistniejąca)
- Błąd podczas odpytywania bazy danych: Log błędu i zwróć 500 Internal Server Error

## 8. Rozważania dotyczące wydajności
- Implementacja cache'owania odpowiedzi, ponieważ dane atrakcji rzadko się zmieniają
- Ograniczenie ilości zwracanych tagów jeśli ich liczba jest bardzo duża
- Optymalizacja zapytań SQL poprzez selektywne pobieranie pól zamiast SELECT *
- Potencjalne use case dla CDN w przypadku URL-i obrazów

## 9. Etapy wdrożenia
1. Utworzenie pliku `/src/pages/api/attractions/[id].ts`
2. Implementacja walidacji parametru ID za pomocą Zod
3. Utworzenie lub rozszerzenie serwisu `AttractionService` w `/src/lib/services/attraction.service.ts`:
   - Implementacja metody `getAttractionDetails(id: string)`
   - Implementacja mapowania danych z bazy do DTO
4. Implementacja endpointu w pliku `/src/pages/api/attractions/[id].ts`:
   - Wyodrębnienie parametru ID z zapytania
   - Walidacja ID za pomocą Zod
   - Wywołanie usługi do pobrania szczegółów atrakcji
   - Zwrócenie odpowiedniej odpowiedzi HTTP z danymi lub błędem
5. Implementacja obsługi błędów zgodnie z sekcją "Obsługa błędów"
6. Testy jednostkowe dla serwisu i endpointu
7. Testy integracyjne całego przepływu danych
8. Wdrożenie i monitoring 