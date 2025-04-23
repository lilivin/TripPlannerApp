# API Endpoint Implementation Plan: GET /api/guides

## 1. Przegląd punktu końcowego
Endpoint GET /api/guides udostępnia listę przewodników (guides) z różnymi opcjami filtrowania i paginacją. Umożliwia wyszukiwanie, filtrowanie i przeglądanie przewodników w sposób wydajny, dostarczając podstawowe informacje o każdym przewodniku wraz z informacjami o paginacji.

## 2. Szczegóły żądania
- **Metoda HTTP**: GET
- **Struktura URL**: `/api/guides`
- **Parametry**:
  - Wymagane: Brak (wszystkie parametry są opcjonalne)
  - Opcjonalne:
    - `page`: Numer strony (domyślnie: 1)
    - `limit`: Liczba elementów na stronę (domyślnie: 10)
    - `creator_id`: Filtrowanie według twórcy
    - `language`: Filtrowanie według języka
    - `location`: Filtrowanie według nazwy lokalizacji
    - `min_days`: Filtrowanie według minimalnej liczby rekomendowanych dni
    - `max_days`: Filtrowanie według maksymalnej liczby rekomendowanych dni
    - `is_published`: Filtrowanie według statusu publikacji (domyślnie: true)
    - `search`: Wyszukiwanie w tytule i opisie
- **Request Body**: Brak (metoda GET)

## 3. Wykorzystywane typy
```typescript
// Wykorzystywane istniejące typy z src/types.ts:
// GuideQuery - parametry zapytania
// GuideSummaryDto - format danych przewodnika
// PaginationInfo - informacje o paginacji
// GuideListResponse - format odpowiedzi z listą przewodników
// CreatorMinimalDto - minimalne informacje o twórcy

// Nowy schemat walidacji do zaimplementowania:
export const guidesQuerySchema = {
  safeParse: (data: Record<string, any>) => {
    // Implementacja z użyciem biblioteki Zod
  }
};
```

## 4. Szczegóły odpowiedzi
- **Status Code**: 
  - 200 OK - sukces
  - 500 Internal Server Error - błąd serwera
- **Format odpowiedzi**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "language": "string",
      "price": "decimal",
      "creator": {
        "id": "uuid",
        "display_name": "string"
      },
      "location_name": "string",
      "recommended_days": "integer",
      "cover_image_url": "string",
      "created_at": "timestamp",
      "average_rating": "decimal"
    }
  ],
  "pagination": {
    "total": "integer",
    "page": "integer",
    "limit": "integer",
    "pages": "integer"
  }
}
```

## 5. Przepływ danych
1. Odbiór żądania GET z parametrami zapytania
2. Walidacja parametrów zapytania przy użyciu Zod
3. Pobranie klienta Supabase z kontekstu Astro
4. Wywołanie metody `guidesService.getGuides()` z klientem Supabase i parametrami
5. Składanie zapytania SQL do bazy danych:
   - Podstawowe zapytanie do tabeli `guides` z JOIN do tabeli `creators`
   - Dodanie warunków filtrowania na podstawie przekazanych parametrów
   - Wykonanie zapytania zliczającego całkowitą liczbę rekordów
   - Dodanie paginacji i sortowania
6. Opcjonalne obliczenie średniej oceny dla każdego przewodnika
7. Mapowanie wyników z bazy danych na DTO
8. Zwrócenie sformatowanej odpowiedzi z paginacją

## 6. Względy bezpieczeństwa
- Walidacja wszystkich parametrów wejściowych przy użyciu Zod
- Unikanie SQL injection poprzez używanie parametryzowanych zapytań Supabase
- Uwzględnienie domyślnej wartości `is_published=true`, aby nieautoryzowani użytkownicy widzieli tylko opublikowane przewodniki
- Zabezpieczenie przed atakami DoS poprzez limitowanie rozmiaru odpowiedzi (paginacja)
- Obsługa uwierzytelniania (jeśli wymagana) przez middleware Astro
- Sanityzacja danych wyjściowych, aby uniknąć XSS

## 7. Obsługa błędów
- **400 Bad Request**: Nieprawidłowe parametry zapytania
  - Nieprawidłowy format `page` lub `limit` (nie są liczbami dodatnimi)
  - Nieprawidłowy format `min_days` lub `max_days` (nie są liczbami dodatnimi)
  - `min_days` większe niż `max_days`
- **500 Internal Server Error**: Błędy po stronie serwera
  - Problemy z połączeniem z bazą danych
  - Wyjątki podczas wykonywania zapytań
  - Nieoczekiwane błędy przetwarzania

## 8. Rozważania dotyczące wydajności
- Indeksowanie kolumn używanych do filtrowania w bazie danych (np. `language`, `location_name`, `recommended_days`)
- Optymalizacja zapytań z użyciem `LIKE` dla parametru `search`
- Efektywne pobieranie średnich ocen z tabeli `reviews`
- Optymalizacja zapytań COUNT dla dużych zbiorów danych
- Ograniczenie liczby zwracanych pól do niezbędnego minimum
- Cachowanie odpowiedzi dla popularnych zapytań przy użyciu PWA
- Implementacja rozwiązań anty-throttling dla często używanych zapytań

## 9. Etapy wdrożenia
1. Utworzenie pliku `/src/pages/api/guides/index.ts` dla obsługi endpointu GET
2. Zaimplementowanie schematu walidacji `guidesQuerySchema` przy użyciu Zod
3. Utworzenie nowego serwisu w `/src/lib/services/guides.service.ts` z metodą `getGuides`
4. Zaimplementowanie logiki obsługi zapytania w serwisie:
   - Budowa zapytania bazowego
   - Dodanie filtrów na podstawie parametrów
   - Obsługa paginacji i liczenia rekordów
   - Mapowanie wyników do DTO
5. Zaimplementowanie punktu końcowego w Astro z obsługą błędów
6. Dodanie właściwych nagłówków odpowiedzi (Content-Type, caching, itp.)
7. Testowanie punktu końcowego z różnymi parametrami zapytania
8. Optymalizacja wydajności na podstawie wyników testów
9. Dokumentacja endpointu w README serwisu

## 10. Przykładowy kod endpointu
```typescript
// src/pages/api/guides/index.ts
import type { APIRoute } from 'astro';
import { guidesService } from '../../../lib/services/guides.service';
import { guidesQuerySchema } from '../../../lib/validation/guides.schema';
import { ApiError } from '../../../lib/utils/api-response';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Pobierz parametry zapytania
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    // Walidacja parametrów zapytania
    const validationResult = guidesQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid query parameters', 
          details: validationResult.error 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Przetworzenie parametrów do odpowiedniego typu
    const query = validationResult.data;
    
    // Dostęp do Supabase
    const supabase = locals.supabase;
    
    // Wywołanie serwisu
    const response = await guidesService.getGuides(supabase, query);
    
    // Zwrócenie odpowiedzi
    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching guides:', error);
    
    if (error instanceof ApiError) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: error.statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 