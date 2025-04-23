# API Endpoint Implementation Plan: GET /api/guides/{id}

## 1. Przegląd punktu końcowego
Endpoint służy do pobierania szczegółowych informacji o przewodniku turystycznym na podstawie jego identyfikatora. Opcjonalnie można uwzględnić szczegółowe informacje o atrakcjach powiązanych z przewodnikiem.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- Struktura URL: `/api/guides/{id}`
- Parametry:
  - Wymagane: `id` (UUID) - identyfikator przewodnika w ścieżce
  - Opcjonalne: `include_attractions` (boolean, domyślnie: false) - flaga określająca, czy dołączyć szczegóły atrakcji

## 3. Wykorzystywane typy
- GuideDetailDto - struktura odpowiedzi zawierająca wszystkie szczegóły przewodnika
- CreatorWithImageDto - informacje o twórcy przewodnika
- GuideAttractionDto - szczegóły atrakcji w przewodniku (gdy include_attractions=true)
- TagDto - informacje o tagach powiązanych z atrakcjami

## 4. Szczegóły odpowiedzi
- Kod 200 OK: Szczegóły przewodnika zwrócone jako GuideDetailDto
- Kod 404 Not Found: Przewodnik o podanym ID nie istnieje
- Kod 400 Bad Request: Nieprawidłowy format ID
- Kod 500 Internal Server Error: Błąd serwera podczas przetwarzania żądania

## 5. Przepływ danych
1. Walidacja parametru `id` przewodnika za pomocą Zod
2. Sprawdzenie opcjonalnego parametru `include_attractions`
3. Pobranie danych przewodnika z bazy Supabase
4. Jeśli `include_attractions=true`, pobranie powiązanych atrakcji i ich tagów
5. Obliczenie średniej oceny przewodnika i liczby recenzji
6. Mapowanie danych z bazy do struktury DTO
7. Buforowanie odpowiedzi w pamięci podręcznej dla poprawy wydajności
8. Zwrócenie odpowiedzi z odpowiednimi nagłówkami cache

## 6. Względy bezpieczeństwa
- Walidacja UUID przewodnika przy użyciu Zod, aby zapobiec atakom wstrzykiwania
- Korzystanie z Supabase z context.locals zamiast bezpośredniego importu klienta
- Weryfikacja, czy przewodnik jest opublikowany (is_published=true) dla użytkowników bez specjalnych uprawnień
- Zabezpieczenie przed ujawnieniem szczegółów błędów w środowisku produkcyjnym

## 7. Obsługa błędów
- Brak ID przewodnika: 400 Bad Request z komunikatem "Brak ID przewodnika"
- Nieprawidłowy format ID: 400 Bad Request z komunikatem "Nieprawidłowy format ID"
- Przewodnik nie istnieje: 404 Not Found z komunikatem "Przewodnik nie został znaleziony" 
- Błąd bazy danych: 500 Internal Server Error z komunikatem "Wystąpił błąd wewnętrzny serwera"

## 8. Rozważania dotyczące wydajności
- Implementacja mechanizmu buforowania odpowiedzi z użyciem ResponseCache
- Domyślny czas życia bufora ustawiony na 1 godzinę (3600 sekund)
- Ustawienie nagłówków cache dla przeglądarki ('Cache-Control: public, max-age=3600')
- Warunkowe pobieranie atrakcji tylko gdy `include_attractions=true`
- Zoptymalizowane zapytania do bazy danych minimalizujące liczbę połączeń

## 9. Etapy wdrożenia
1. Aktualizacja schematu walidacji w `src/schemas/guides.schema.ts` o parametr `include_attractions`
```typescript
export const guideQuerySchema = z.object({
  include_attractions: z.coerce.boolean().optional().default(false)
});
```

2. Modyfikacja istniejącej metody `getGuideDetails()` w `src/lib/services/guides.service.ts` w celu obsługi parametru include_attractions
```typescript
async getGuideDetails(
  supabase: SupabaseClient,
  id: string,
  includeAttractions: boolean = false
): Promise<GuideDetailDto | null> {
  // Istniejący kod pobierania podstawowych informacji o przewodniku
  // ...
  
  // Warunkowe pobieranie atrakcji
  let mappedAttractions: GuideAttractionDto[] = [];
  if (includeAttractions) {
    // Istniejąca logika pobierania atrakcji
    // ...
  }
  
  // Zwrócenie kompletnego obiektu z atrakcjami lub bez
  return {
    // ...pozostałe pola
    attractions: includeAttractions ? mappedAttractions : undefined
  };
}
```

3. Aktualizacja pliku `src/pages/api/guides/[id].ts` do obsługi nowego parametru
```typescript
export const GET: APIRoute = async ({ params, locals, url }) => {
  try {
    const { id } = params;
    
    // Sprawdzenie ID i walidacja
    // ...
    
    // Pobierz i przetwórz parametr include_attractions
    const includeAttractions = url.searchParams.get('include_attractions') === 'true';
    
    // Pobierz przewodnik z cache lub bazy danych z uwzględnieniem parametru
    const guide = await cache.getOrSet(
      CACHE_NAME,
      `${id}-${includeAttractions}`, // Uwzględnij parametr w kluczu cache
      () => guidesService.getGuideDetails(locals.supabase, id, includeAttractions),
      CACHE_TTL_SECONDS
    );
    
    // Reszta kodu obsługi odpowiedzi
    // ...
  } catch (error) {
    // Obsługa błędów
    // ...
  }
};
```

4. Dodanie testów w celu sprawdzenia poprawności działania endpointu
   - Test pobierania przewodnika z uwzględnieniem atrakcji
   - Test pobierania przewodnika bez atrakcji
   - Test obsługi nieprawidłowych danych wejściowych
   - Test obsługi przypadków brzegowych

5. Aktualizacja dokumentacji API z informacją o nowym parametrze i jego zachowaniu
   - Dodanie informacji o parametrze w dokumentacji OpenAPI
   - Aktualizacja przykładów użycia API

6. Wdrożenie i monitoring
   - Monitorowanie wydajności endpointu w środowisku produkcyjnym
   - Śledzenie wykorzystania pamięci podręcznej i dostosowanie TTL w razie potrzeby 