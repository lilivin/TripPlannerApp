# API Endpoint Implementation Plan: GET /api/plans/{id}

## 1. Przegląd punktu końcowego
Endpoint GET /api/plans/{id} służy do pobierania szczegółowych informacji o konkretnym planie podróży na podstawie jego identyfikatora. Zwraca kompletny obiekt planu, w tym informacje o przewodniku, parametry generacji i zawartość planu.

## 2. Szczegóły żądania
- **Metoda HTTP**: GET
- **Struktura URL**: `/api/plans/{id}`
- **Parametry**:
  - **Wymagane**: id (UUID) - identyfikator planu w ścieżce URL
  - **Opcjonalne**: brak
- **Request Body**: brak (GET request)

## 3. Wykorzystywane typy
- **DTOs**:
  - `PlanDetailDto` - struktura szczegółów planu zwracana w odpowiedzi
  - `GuideMinimalDto` - zagnieżdżona struktura podstawowych informacji o przewodniku

## 4. Szczegóły odpowiedzi
- **Sukces (200 OK)**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "guide": {
      "id": "uuid",
      "title": "string",
      "location_name": "string"
    },
    "content": "object",
    "generation_params": "object",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "is_favorite": "boolean"
  }
  ```
- **Błędy**:
  - 401 Unauthorized - użytkownik nie jest zalogowany
  - 403 Forbidden - użytkownik nie ma uprawnień do tego planu
  - 404 Not Found - plan o podanym ID nie istnieje
  - 500 Internal Server Error - wewnętrzny błąd serwera

## 5. Przepływ danych
1. Odbierz żądanie GET z parametrem `id` w ścieżce
2. Pobierz ID użytkownika z sesji (Supabase auth)
3. Wykonaj zapytanie do bazy danych Supabase:
   - Pobierz plan o podanym ID
   - Sprawdź, czy plan należy do zalogowanego użytkownika (user_id)
   - Pobierz powiązane podstawowe informacje o przewodniku (id, title, location_name)
4. Zmapuj dane z bazy na odpowiedni format DTO
5. Zwróć odpowiedź w formacie JSON

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**: Wymaga uwierzytelnionego użytkownika (sesja Supabase)
- **Autoryzacja**: Tylko właściciel planu może go przeglądać (sprawdzanie user_id)
- **Walidacja**: Sprawdzenie poprawności formatu UUID dla parametru id
- **Ochrona danych**: Filtrownie danych - zwracanie tylko pól wymaganych w odpowiedzi

## 7. Obsługa błędów
- **Brak uwierzytelnienia**: Zwróć 401 Unauthorized, gdy użytkownik nie jest zalogowany
- **Brak uprawnień**: Zwróć 403 Forbidden, gdy plan nie należy do zalogowanego użytkownika
- **Brak zasobu**: Zwróć 404 Not Found, gdy plan o podanym ID nie istnieje
- **Nieprawidłowy format ID**: Zwróć 400 Bad Request, gdy format ID jest nieprawidłowy
- **Błędy serwera**: Zwróć 500 Internal Server Error z odpowiednim komunikatem przy problemach z bazą danych

## 8. Rozważania dotyczące wydajności
- Wykorzystanie indeksów na kolumnach `id` i `user_id` w tabeli plans
- Ograniczenie pobieranych pól do niezbędnego minimum
- Rozważenie implementacji mechanizmu buforowania dla często pobieranych planów
- Obsługa offline poprzez PWA - wykorzystanie tabeli offline_cache_status

## 9. Etapy wdrożenia
1. **Utworzenie pliku odpowiedzi API** w `src/pages/api/plans/[id].ts`
2. **Implementacja usługi** w `src/lib/services/planService.ts`:
   - Utworzenie metody `getPlanById(id: string, userId: string): Promise<PlanDetailDto>`
   - Implementacja logiki dostępu do bazy danych
3. **Implementacja handlera metody GET**:
   - Walidacja parametru ID z wykorzystaniem Zod
   - Wyodrębnienie ID użytkownika z kontekstu Supabase
   - Obsługa błędów zgodnie z punktem 7
   - Wywołanie metody serwisowej i zwrócenie odpowiedzi
4. **Utworzenie testów**:
   - Testy jednostkowe dla usługi
   - Testy integracyjne dla endpointu
5. **Dokumentacja**:
   - Aktualizacja dokumentacji API
   - Dodanie komentarzy wyjaśniających kluczowe elementy implementacji
6. **Implementacja wsparcia PWA**:
   - Dodanie obsługi trybu offline dla tego endpointu w service workerze
   - Synchronizacja danych po powrocie online

## 10. Przykładowa implementacja

### Handler API

```typescript
// src/pages/api/plans/[id].ts
import { z } from 'zod';
import type { APIRoute } from 'astro';
import { getPlanById } from '../../../lib/services/planService';

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

    // Sprawdzenie uwierzytelnienia
    const supabase = locals.supabase;
    const session = await supabase.auth.getSession();
    if (!session?.data?.session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = session.data.session.user.id;
    const planId = params.id as string;

    // Pobranie danych planu
    const plan = await getPlanById(planId, userId);
    
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
```

### Implementacja usługi

```typescript
// src/lib/services/planService.ts
import type { PlanDetailDto, GuideMinimalDto } from '../../types';
import type { SupabaseClient } from '../../db/supabase.client';

export async function getPlanById(planId: string, userId: string): Promise<PlanDetailDto> {
  const supabase = getSupabaseClient();
  
  // Pobierz plan wraz z podstawowymi danymi przewodnika
  const { data, error } = await supabase
    .from('plans')
    .select(`
      id, 
      name, 
      content, 
      generation_params, 
      created_at, 
      updated_at, 
      is_favorite,
      guides:guide_id (
        id, 
        title, 
        location_name
      )
    `)
    .eq('id', planId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Plan not found');
    }
    throw error;
  }
  
  if (!data) {
    throw new Error('Plan not found');
  }
  
  // Formatowanie odpowiedzi zgodnie z PlanDetailDto
  return {
    id: data.id,
    name: data.name,
    guide: {
      id: data.guides.id,
      title: data.guides.title,
      location_name: data.guides.location_name
    },
    content: data.content,
    generation_params: data.generation_params,
    created_at: data.created_at,
    updated_at: data.updated_at,
    is_favorite: data.is_favorite
  };
}
``` 