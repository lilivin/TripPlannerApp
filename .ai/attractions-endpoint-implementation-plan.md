# API Endpoint Implementation Plan: GET /api/attractions

## 1. Przegląd punktu końcowego
Endpoint pozwala na pobranie listy atrakcji z możliwością filtrowania według różnych kryteriów, w tym lokalizacji, twórcy oraz tagów. Umożliwia też wyszukiwanie tekstowe w nazwie i opisie atrakcji oraz obsługuje paginację wyników.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- Struktura URL: /api/attractions
- Parametry:
  - Opcjonalne:
    - `page`: Numer strony (domyślnie: 1)
    - `limit`: Elementów na stronę (domyślnie: 10)
    - `creator_id`: Filtrowanie według twórcy (UUID)
    - `search`: Wyszukiwanie w nazwie i opisie (string)
    - `latitude`: Filtrowanie według bliskości (decimal, wymaga longitude)
    - `longitude`: Filtrowanie według bliskości (decimal, wymaga latitude)
    - `radius`: Promień w metrach dla wyszukiwania po bliskości (domyślnie: 1000)
    - `tag_id`: Filtrowanie według tagu (UUID)
    - `tag_category`: Filtrowanie według kategorii tagu (string)
- Request Body: Brak (metoda GET)

## 3. Wykorzystywane typy
- **DTO**:
  - `AttractionSummaryDto`: Struktura zwracanych danych atrakcji
  - `GeolocationDto`: Struktura dla danych geolokalizacyjnych
  - `CreatorMinimalDto`: Minimalna struktura danych twórcy
  - `TagDto`: Struktura danych tagu
  - `AttractionListResponse`: Struktura odpowiedzi z listą atrakcji
  - `PaginationInfo`: Struktura informacji o paginacji
- **Query**:
  - `AttractionQuery`: Parametry zapytania dla atrakcji

## 4. Szczegóły odpowiedzi
- Format: JSON
- Struktura:
  ```json
  {
    "data": [AttractionSummaryDto[]],
    "pagination": PaginationInfo
  }
  ```
- Kody statusu:
  - 200 OK: Pomyślne pobranie danych
  - 400 Bad Request: Nieprawidłowe parametry zapytania
  - 500 Internal Server Error: Błąd serwera

## 5. Przepływ danych
1. Walidacja parametrów zapytania za pomocą Zod
2. Pobieranie danych z bazy Supabase:
   - Podstawowe zapytanie: tabela `attractions` połączona z `creators` i `attraction_tags`
   - Dynamiczne dodawanie filtrów na podstawie parametrów zapytania
   - Specjalne przetwarzanie dla wyszukiwania po geolokalizacji (wykorzystanie funkcji PostgreSQL)
   - Pobieranie powiązanych tagów
3. Transformacja danych do formatu odpowiedzi DTO
4. Zwrócenie danych z informacją o paginacji

## 6. Względy bezpieczeństwa
- Publiczny endpoint bez wymagań autoryzacyjnych
- Walidacja wszystkich parametrów wejściowych za pomocą Zod
- Zabezpieczenie przed atakami SQL Injection przez używanie parametryzowanych zapytań Supabase
- Zabezpieczenie przed nadużyciami przez ograniczenie liczby zwracanych elementów
- Filtrowanie usunietych atrakcji (warunek `deleted_at IS NULL`)

## 7. Obsługa błędów
- 400 Bad Request:
  - Nieprawidłowy format parametrów
  - Brak wymaganego parametru longitude przy podanym latitude (i odwrotnie)
  - Wartości parametrów poza dozwolonym zakresem
- 500 Internal Server Error:
  - Błędy połączenia z bazą danych
  - Nieoczekiwane błędy przetwarzania
- Logowanie błędów po stronie serwera
- Zwracanie przyjaznych dla użytkownika komunikatów błędów

## 8. Rozważania dotyczące wydajności
- Indeksy bazy danych:
  - Indeks na kolumnie `creator_id` w tabeli `attractions`
  - Indeks przestrzenny (GIST) na kolumnie `geolocation`
  - Indeks pełnotekstowy dla kolumn `name` i `description` dla optymalizacji wyszukiwania
- Ograniczenie maksymalnej liczby zwracanych elementów
- Wykorzystanie paginacji dla dużych zbiorów danych
- Możliwe cachowanie odpowiedzi dla popularnych zapytań

## 9. Etapy wdrożenia
1. Utworzenie pliku endpointu `src/pages/api/attractions.ts`
2. Utworzenie pliku usługi `src/lib/services/attractions.service.ts`
3. Implementacja schematu walidacji parametrów w oparciu o Zod
4. Implementacja funkcji pobierania atrakcji w serwisie
   - Obsługa podstawowego zapytania
   - Dodanie obsługi parametrów filtrowania
   - Implementacja obsługi geolokalizacji
   - Implementacja paginacji
5. Implementacja handlera endpoint'u GET
6. Mapowanie odpowiedzi do DTO
7. Dodanie obsługi błędów
8. Testy jednostkowe dla funkcji serwisowych
9. Testy integracyjne dla endpointu
10. Dokumentacja endpointu

## 10. Przykładowa implementacja

### Schema walidacji (Zod):
```typescript
// src/schemas/attraction.schema.ts
import { z } from 'zod';

export const attractionsQuerySchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().max(100).optional().default(10),
  creator_id: z.string().uuid().optional(),
  search: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().optional().default(1000),
  tag_id: z.string().uuid().optional(),
  tag_category: z.string().optional(),
}).refine(data => {
  if ((data.latitude !== undefined && data.longitude === undefined) || 
      (data.latitude === undefined && data.longitude !== undefined)) {
    return false;
  }
  return true;
}, {
  message: "Parametry latitude i longitude muszą być podane razem"
});
```

### Handler endpointu:
```typescript
// src/pages/api/attractions.ts
import type { APIRoute } from 'astro';
import { attractionsService } from '../../lib/services/attractions.service';
import { attractionsQuerySchema } from '../../schemas/attraction.schema';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    const parseResult = attractionsQuerySchema.safeParse(queryParams);
    
    if (!parseResult.success) {
      return new Response(JSON.stringify({
        error: 'Nieprawidłowe parametry zapytania',
        details: parseResult.error.format()
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { data: query } = parseResult;
    const result = await attractionsService.getAttractions(locals.supabase, query);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching attractions:', error);
    return new Response(JSON.stringify({
      error: 'Wystąpił błąd podczas pobierania atrakcji'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Serwis atrakcji:
```typescript
// src/lib/services/attractions.service.ts
import type { SupabaseClient } from '../db/supabase.client';
import type { 
  AttractionQuery, 
  AttractionListResponse,
  AttractionSummaryDto
} from '../../types';

export const attractionsService = {
  async getAttractions(
    supabase: SupabaseClient,
    query: AttractionQuery
  ): Promise<AttractionListResponse> {
    const { 
      page = 1, 
      limit = 10, 
      creator_id, 
      search,
      latitude, 
      longitude, 
      radius = 1000,
      tag_id,
      tag_category
    } = query;
    
    const offset = (page - 1) * limit;
    
    // Budowanie podstawowego zapytania
    let attractionsQuery = supabase
      .from('attractions')
      .select(`
        id,
        name,
        description,
        address,
        geolocation,
        images,
        creator_id,
        average_visit_time_minutes,
        creators!inner(id, display_name)
      `)
      .is('deleted_at', null);
    
    // Dodawanie filtrów
    if (creator_id) {
      attractionsQuery = attractionsQuery.eq('creator_id', creator_id);
    }
    
    if (search) {
      attractionsQuery = attractionsQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Filtrowanie po geolokalizacji
    if (latitude !== undefined && longitude !== undefined) {
      attractionsQuery = attractionsQuery.filter(
        `ST_DWithin(geolocation, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326), ${radius})`
      );
    }
    
    // Pobieranie całkowitej liczby wyników (dla paginacji)
    const countQuery = attractionsQuery.count();
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      throw countError;
    }
    
    const total = count || 0;
    
    // Wykonywanie głównego zapytania z paginacją
    const { data: attractions, error } = await attractionsQuery
      .range(offset, offset + limit - 1)
      .order('name');
      
    if (error) {
      throw error;
    }
    
    // Pobieranie tagów dla atrakcji
    const attractionIds = attractions.map(a => a.id);
    
    const { data: attractionTags, error: tagsError } = await supabase
      .from('attraction_tags')
      .select(`
        attraction_id,
        tags(id, name, category)
      `)
      .in('attraction_id', attractionIds);
      
    if (tagsError) {
      throw tagsError;
    }
    
    // Filtrowanie po tagu lub kategorii tagu
    const filteredAttractions = attractions.filter(attraction => {
      if (!tag_id && !tag_category) return true;
      
      const tags = attractionTags
        .filter(at => at.attraction_id === attraction.id)
        .map(at => at.tags);
      
      if (tag_id) {
        return tags.some(tag => tag.id === tag_id);
      }
      
      if (tag_category) {
        return tags.some(tag => tag.category === tag_category);
      }
      
      return true;
    });
    
    // Mapowanie do DTO
    const mappedData: AttractionSummaryDto[] = filteredAttractions.map(attraction => {
      const tags = attractionTags
        .filter(at => at.attraction_id === attraction.id)
        .map(at => ({
          id: at.tags.id,
          name: at.tags.name,
          category: at.tags.category
        }));
      
      // Ekstrakcja punktu z geometrii GEOGRAPHY
      const geoParts = attraction.geolocation.replace('POINT(', '').replace(')', '').split(' ');
      const longitude = parseFloat(geoParts[0]);
      const latitude = parseFloat(geoParts[1]);
      
      return {
        id: attraction.id,
        name: attraction.name,
        description: attraction.description,
        address: attraction.address,
        geolocation: {
          latitude,
          longitude
        },
        images: attraction.images,
        creator: {
          id: attraction.creators.id,
          display_name: attraction.creators.display_name
        },
        average_visit_time_minutes: attraction.average_visit_time_minutes,
        tags
      };
    });
    
    // Obliczanie informacji o paginacji
    const pages = Math.ceil(total / limit);
    
    return {
      data: mappedData,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    };
  }
};
``` 