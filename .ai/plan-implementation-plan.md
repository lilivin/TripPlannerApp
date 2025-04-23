# API Endpoint Implementation Plan: GET /api/plans

## 1. Przegląd punktu końcowego
Endpoint GET /api/plans służy do pobierania listy planów użytkownika. Umożliwia filtrowanie planów według przewodnika (guide_id) i oznaczenia ulubionych (is_favorite), a także paginację wyników. Pozwala zalogowanym użytkownikom na zarządzanie swoimi planami podróży.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- Struktura URL: `/api/plans`
- Parametry:
  - Opcjonalne: 
    - `page`: Numer strony (domyślnie: 1)
    - `limit`: Liczba elementów na stronę (domyślnie: 10)
    - `guide_id`: Filtrowanie według przewodnika (UUID)
    - `is_favorite`: Filtrowanie ulubionych (boolean)
- Wymagane nagłówki:
  - Cookies autoryzacyjne (zarządzane przez Supabase)

## 3. Wykorzystywane typy
```typescript
// Z istniejącego pliku src/types.ts
import type { 
  PlanSummaryDto,
  PlanQuery,
  PlanListResponse,
  PaginationInfo
} from '../types';
import type { Database } from '../db/database.types';
import { z } from 'zod';
```

Schemat walidacji:
```typescript
// Schemat do walidacji parametrów wejściowych z Zod
export const plansQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  guide_id: z.string().uuid().optional(),
  is_favorite: z.coerce.boolean().optional()
});
```

## 4. Szczegóły odpowiedzi
- Status 200 OK:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "string",
        "guide": {
          "id": "uuid",
          "title": "string",
          "location_name": "string"
        },
        "created_at": "timestamp",
        "updated_at": "timestamp",
        "is_favorite": "boolean"
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
- Status 401 Unauthorized: Brak informacji o zalogowanym użytkowniku
- Status 500 Internal Server Error: Błąd serwera

## 5. Przepływ danych
1. Odebranie żądania GET z parametrami zapytania
2. Walidacja parametrów zapytania przy użyciu Zod
3. Pobranie ID zalogowanego użytkownika z kontekstu (context.locals.supabase)
4. Wygenerowanie zapytania SQL z uwzględnieniem filtrów i paginacji
5. Wykonanie zapytania do Supabase, pobierającego:
   - Plany należące do zalogowanego użytkownika
   - Powiązane dane przewodników (join z tabelą guides)
   - Zastosowanie filtrów (guide_id, is_favorite)
   - Zastosowanie paginacji (limit, offset)
6. Przekształcenie wyników z bazy danych do odpowiedniego formatu DTO
7. Zwrócenie odpowiedzi w formacie PlanListResponse

## 6. Względy bezpieczeństwa
- Weryfikacja autentykacji: Sprawdzenie, czy użytkownik jest zalogowany przed realizacją zapytania
- Row Level Security: Wykorzystanie wbudowanych polityk RLS w Supabase, zapewniających, że użytkownicy mogą uzyskać dostęp tylko do własnych planów
- Walidacja danych: Pełna walidacja parametrów zapytania przed ich wykorzystaniem
- Parametryzowane zapytania: Zapobieganie atakom SQL Injection

## 7. Obsługa błędów
- 401 Unauthorized: 
  - Scenariusz: Brak zalogowanego użytkownika
  - Obsługa: Zwrócenie kodu 401 bez ujawniania szczegółów
- 500 Internal Server Error:
  - Scenariusz: Błąd bazy danych, błąd przetwarzania danych
  - Obsługa: Logowanie błędu, zwrócenie ogólnego komunikatu bez ujawniania szczegółów technicznych

## 8. Rozważania dotyczące wydajności
- Indeksy bazy danych: Wykorzystanie istniejących indeksów na kolumnach user_id, guide_id, is_favorite
- Paginacja: Ograniczenie liczby pobieranych rekordów za pomocą parametrów limit i offset
- Select tylko niezbędnych kolumn: Minimalizacja ilości pobieranych danych
- Optymalizacja zapytań SQL: Efektywne JOINy i WHERE

## 9. Etapy wdrożenia

### 1. Utworzenie serwisu dla planów
Utworzenie pliku `src/lib/services/plans.service.ts`:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../db/database.types';
import type { PlanSummaryDto, PlanQuery, PlanListResponse, PaginationInfo } from '../../types';

export async function getUserPlans(
  supabase: SupabaseClient<Database>,
  userId: string,
  query: PlanQuery
): Promise<PlanListResponse> {
  try {
    // Budowanie zapytania bazowego
    let planQuery = supabase
      .from('plans')
      .select(`
        id,
        name,
        created_at,
        updated_at,
        is_favorite,
        guide:guides(id, title, location_name)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .is('deleted_at', null);
    
    // Zastosowanie filtrów
    if (query.guide_id) {
      planQuery = planQuery.eq('guide_id', query.guide_id);
    }
    
    if (query.is_favorite !== undefined) {
      planQuery = planQuery.eq('is_favorite', query.is_favorite);
    }
    
    // Obliczenie offsetu dla paginacji
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    
    // Wykonanie zapytania z paginacją
    const { data, count, error } = await planQuery
      .range(offset, offset + limit - 1)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    // Transformacja wyników do formatu DTO
    const planDtos: PlanSummaryDto[] = data.map(plan => ({
      id: plan.id,
      name: plan.name,
      guide: {
        id: plan.guide.id,
        title: plan.guide.title,
        location_name: plan.guide.location_name
      },
      created_at: plan.created_at,
      updated_at: plan.updated_at,
      is_favorite: plan.is_favorite
    }));
    
    // Przygotowanie informacji o paginacji
    const total = count || 0;
    const pagination: PaginationInfo = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
    
    return {
      data: planDtos,
      pagination
    };
  } catch (error) {
    console.error('Error fetching user plans:', error);
    throw error;
  }
}
```

### 2. Utworzenie schematu walidacji
Utworzenie pliku `src/lib/schemas/plans.schema.ts`:

```typescript
import { z } from 'zod';

export const plansQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  guide_id: z.string().uuid().optional(),
  is_favorite: z.coerce.boolean().optional()
});

export type PlansQuerySchemaType = z.infer<typeof plansQuerySchema>;
```

### 3. Implementacja endpointu
Utworzenie pliku `src/pages/api/plans/index.ts`:

```typescript
import type { APIRoute } from 'astro';
import { getUserPlans } from '../../../lib/services/plans.service';
import { plansQuerySchema } from '../../../lib/schemas/plans.schema';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Sprawdzenie autentykacji
    const { supabase } = locals;
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Pobranie i walidacja parametrów zapytania
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const result = plansQuerySchema.safeParse(queryParams);
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Invalid query parameters', details: result.error.format() }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Pobranie planów użytkownika
    const plans = await getUserPlans(supabase, session.user.id, result.data);
    
    // Zwrócenie odpowiedzi
    return new Response(JSON.stringify(plans), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in plans endpoint:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
```

### 4. Testowanie
1. Utworzenie testów jednostkowych dla serwisu plans.service.ts
2. Utworzenie testów integracyjnych dla endpointu GET /api/plans
3. Manualne testowanie endpointu z różnymi parametrami i scenariuszami
4. Weryfikacja zgodności z wymaganiami specyfikacji API

### 5. Dokumentacja
1. Aktualizacja dokumentacji API z opisem endpointu, parametrów, odpowiedzi
2. Dodanie przykładów użycia
3. Dokumentacja wewnętrzna kodu (komentarze JSDoc)

### 6. Wdrożenie
1. Weryfikacja kodu przed deplojem
2. Deployment kodu do środowiska stagingowego
3. Testy akceptacyjne
4. Deployment na produkcję
