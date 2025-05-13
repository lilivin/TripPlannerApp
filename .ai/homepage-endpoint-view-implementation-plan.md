# API Endpoint Implementation Plan: GET /api/home

## 1. Przegląd punktu końcowego
Endpoint `/api/home` dostarcza spersonalizowane treści dla strony głównej aplikacji TripPlanner. Odpowiedź różni się w zależności od stanu uwierzytelnienia użytkownika: dla zalogowanych użytkowników zwraca personalizowane powitanie, ostatnie plany, rekomendowane przewodniki i nowe przewodniki, natomiast dla niezalogowanych użytkowników zwraca podstawowy zestaw wyróżnionych przewodników.

## 2. Szczegóły żądania
- **Metoda HTTP**: GET
- **Struktura URL**: `/api/home`
- **Parametry**:
  - **Opcjonalne**:
    - `language`: Preferowany język treści (domyślnie: preferencja użytkownika lub "pl")
- **Request Body**: Brak (metoda GET)

## 3. Wykorzystywane typy
- **DTO**:
  - `HomeGuestResponse` - Odpowiedź dla niezalogowanych użytkowników
  - `HomeUserResponse` - Odpowiedź dla zalogowanych użytkowników
  - `FeaturedGuideDto` - Model wyróżnionego przewodnika
  - `UserGreetingDto` - Model powitania użytkownika
  - `RecentPlanDto` - Model ostatnich planów
  - `RecommendedGuideDto` - Model rekomendowanych przewodników
  - `NewGuideDto` - Model nowych przewodników
- **Command Models**:
  - `HomeQuery` - Interfejs parametrów zapytania

## 4. Szczegóły odpowiedzi
### Dla niezalogowanych użytkowników (status 200 OK):
```json
{
  "featured_guides": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "price": "decimal",
      "location_name": "string",
      "cover_image_url": "string",
      "average_rating": "decimal"
    }
  ]
}
```

### Dla zalogowanych użytkowników (status 200 OK):
```json
{
  "user_greeting": {
    "display_name": "string",
    "avatar_url": "string"
  },
  "recent_plans": [
    {
      "id": "uuid",
      "name": "string",
      "guide": {
        "title": "string",
        "location_name": "string"
      },
      "created_at": "timestamp",
      "is_favorite": "boolean",
      "thumbnail_url": "string"
    }
  ],
  "recommended_guides": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "price": "decimal",
      "location_name": "string",
      "cover_image_url": "string",
      "average_rating": "decimal",
      "reason": "string"
    }
  ],
  "new_guides": [
    {
      "id": "uuid",
      "title": "string",
      "price": "decimal",
      "location_name": "string",
      "cover_image_url": "string",
      "added_at": "timestamp"
    }
  ]
}
```

### Kody błędów:
- 400 Bad Request: Nieprawidłowe parametry zapytania
- 500 Internal Server Error: Wewnętrzny błąd serwera

## 5. Przepływ danych
1. **Przetwarzanie żądania**:
   - Ekstrakcja parametrów zapytania (opcjonalny parametr `language`)
   - Walidacja parametrów przy użyciu Zod
   - Sprawdzenie stanu uwierzytelnienia użytkownika

2. **Przetwarzanie dla niezalogowanych użytkowników**:
   - Pobranie wyróżnionych przewodników z bazy danych

3. **Przetwarzanie dla zalogowanych użytkowników**:
   - Pobranie danych profilu użytkownika
   - Pobranie ostatnich planów podróży użytkownika
   - Pobranie rekomendowanych przewodników na podstawie historii interakcji użytkownika
   - Pobranie nowych przewodników dodanych po ostatnim logowaniu użytkownika

4. **Przygotowanie odpowiedzi**:
   - Formatowanie danych w zależności od stanu uwierzytelnienia
   - Obsługa błędów i wyjątków

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**:
  - Dostęp do pełnych danych strony głównej wymaga uwierzytelnienia
  - Niezalogowani użytkownicy otrzymują ograniczony zestaw danych
  
- **Kontrola dostępu**:
  - Ostatnie plany są dostępne tylko dla zalogowanego użytkownika, któremu one należą
  - Interfejs API stosuje Row-Level Security z Supabase, aby zapewnić dostęp tylko do autoryzowanych danych

- **Walidacja danych**:
  - Walidacja parametrów zapytania przy użyciu Zod
  - Sanityzacja danych wyjściowych, aby zapobiec wstrzykiwaniu przez odpowiedź

## 7. Obsługa błędów
- **Walidacja parametrów zapytania**:
  - Nieprawidłowy parametr `language` -> 400 Bad Request z informacją o przyczynie błędu
  
- **Błędy bazy danych**:
  - Problem z połączeniem z bazą danych -> 500 Internal Server Error
  - Błąd zapytania -> 500 Internal Server Error
  
- **Obsługa wyjątków**:
  - Nieoczekiwane wyjątki -> Logowanie błędu i zwracanie 500 Internal Server Error

## 8. Rozważania dotyczące wydajności
- **Indeksowanie**:
  - Wykorzystanie indeksów bazy danych:
    - `idx_guides_is_published` dla szybkiego dostępu do opublikowanych przewodników
    - `idx_plans_user_id` dla szybkiego dostępu do planów użytkownika
    - `idx_guides_created_at` dla szybkiego dostępu do nowych przewodników
    - `idx_plans_created_at` dla szybkiego dostępu do ostatnich planów
    - `idx_user_guide_interactions_user_id` dla rekomendacji

- **Buforowanie**:
  - Częściowe buforowanie odpowiedzi dla niezalogowanych użytkowników (możliwość wprowadzenia w przyszłości)
  - Rozważenie buforowania odpowiedzi po stronie klienta dla wydajności PWA

## 9. Etapy wdrożenia
1. **Utworzenie pliku schematu zapytania (`src/lib/schemas/home.schema.ts`)**:
   ```typescript
   import { z } from 'zod';
   
   export const homeQuerySchema = z.object({
     language: z.string().min(2).max(10).optional()
   });
   
   export type HomeQuerySchemaType = z.infer<typeof homeQuerySchema>;
   ```

2. **Utworzenie usługi domowej (`src/lib/services/home.service.ts`)**:
   ```typescript
   import type { SupabaseClient } from '@supabase/supabase-js';
   import type { 
     HomeGuestResponse, 
     HomeUserResponse, 
     FeaturedGuideDto, 
     UserGreetingDto, 
     RecentPlanDto, 
     RecommendedGuideDto, 
     NewGuideDto 
   } from '../../types';
   
   /**
    * Pobiera dane strony głównej dla niezalogowanych użytkowników
    */
   export async function getGuestHomeData(
     supabase: SupabaseClient,
     language: string = 'pl'
   ): Promise<HomeGuestResponse> {
     const { data: featuredGuides, error } = await supabase
       .from('guides')
       .select(`
         id, 
         title, 
         description, 
         price, 
         location_name, 
         cover_image_url,
         (
           SELECT AVG(rating) 
           FROM reviews 
           WHERE guide_id = guides.id AND is_visible = true
         ) as average_rating
       `)
       .eq('is_published', true)
       .eq('language', language)
       .filter('deleted_at', 'is', null)
       .order('created_at', { ascending: false })
       .limit(5);
   
     if (error) throw error;
   
     return {
       featured_guides: featuredGuides as FeaturedGuideDto[]
     };
   }
   
   /**
    * Pobiera dane strony głównej dla zalogowanych użytkowników
    */
   export async function getUserHomeData(
     supabase: SupabaseClient,
     userId: string,
     language: string = 'pl'
   ): Promise<HomeUserResponse> {
     // Pobierz dane powitania użytkownika
     const { data: userData, error: userError } = await supabase
       .from('users')
       .select('avatar_url, display_name')
       .eq('id', userId)
       .single();
   
     if (userError) throw userError;
   
     // Pobierz ostatnie plany użytkownika
     const { data: recentPlans, error: plansError } = await supabase
       .from('plans')
       .select(`
         id, 
         name, 
         created_at, 
         is_favorite,
         guides:guide_id (
           title, 
           location_name,
           cover_image_url
         )
       `)
       .eq('user_id', userId)
       .filter('deleted_at', 'is', null)
       .order('created_at', { ascending: false })
       .limit(3);
   
     if (plansError) throw plansError;
   
     // Pobierz rekomendowane przewodniki
     const { data: interactionData, error: interactionError } = await supabase
       .from('user_guide_interactions')
       .select('guide_id, interaction_type, interaction_count')
       .eq('user_id', userId)
       .order('last_interaction_at', { ascending: false });
   
     if (interactionError) throw interactionError;
   
     // Analiza interakcji dla personalizowanych rekomendacji
     const interactionGuideIds = interactionData.map(i => i.guide_id);
     
     const { data: recommendedGuides, error: recommendedError } = await supabase
       .from('guides')
       .select(`
         id, 
         title, 
         description, 
         price, 
         location_name, 
         cover_image_url,
         (
           SELECT AVG(rating) 
           FROM reviews 
           WHERE guide_id = guides.id AND is_visible = true
         ) as average_rating
       `)
       .eq('is_published', true)
       .eq('language', language)
       .filter('deleted_at', 'is', null)
       .filter('id', 'not.in', `(${interactionGuideIds.join(',')})`)
       .limit(3);
   
     if (recommendedError) throw recommendedError;
   
     // Pobierz nowe przewodniki
     const { data: newGuides, error: newGuidesError } = await supabase
       .from('guides')
       .select(`
         id, 
         title, 
         price, 
         location_name, 
         cover_image_url,
         created_at as added_at
       `)
       .eq('is_published', true)
       .eq('language', language)
       .filter('deleted_at', 'is', null)
       .order('created_at', { ascending: false })
       .limit(5);
   
     if (newGuidesError) throw newGuidesError;
   
     // Przygotowanie rekomendacji z uzasadnieniami
     const recommendedWithReasons = recommendedGuides.map((guide: any): RecommendedGuideDto => ({
       ...guide,
       reason: 'Dopasowane do Twoich preferencji podróży'
     }));
   
     // Przygotowanie ostatnich planów z miniaturami
     const formattedRecentPlans = recentPlans.map((plan: any): RecentPlanDto => ({
       id: plan.id,
       name: plan.name,
       guide: {
         title: plan.guides.title,
         location_name: plan.guides.location_name,
       },
       created_at: plan.created_at,
       is_favorite: plan.is_favorite,
       thumbnail_url: plan.guides.cover_image_url
     }));
   
     return {
       user_greeting: {
         display_name: userData.display_name || 'użytkowniku',
         avatar_url: userData.avatar_url
       },
       recent_plans: formattedRecentPlans,
       recommended_guides: recommendedWithReasons,
       new_guides: newGuides as NewGuideDto[]
     };
   }
   ```

3. **Utworzenie endpointu (`src/pages/api/home.ts`)**:
   ```typescript
   import type { APIRoute } from 'astro';
   import { homeQuerySchema } from '../../lib/schemas/home.schema';
   import { getGuestHomeData, getUserHomeData } from '../../lib/services/home.service';
   import { ApiError, createSuccessResponse, createErrorResponse } from '../../lib/utils/api-response';
   
   export const prerender = false;
   
   export const GET: APIRoute = async ({ request, locals }) => {
     try {
       const { supabase } = locals;
       
       // Pobranie i walidacja parametrów zapytania
       const url = new URL(request.url);
       const result = homeQuerySchema.safeParse(Object.fromEntries(url.searchParams));
       
       if (!result.success) {
         return createErrorResponse(
           400, 
           'Nieprawidłowe parametry zapytania', 
           result.error.format()
         );
       }
       
       // Pobranie sesji użytkownika
       const { data: { session } } = await supabase.auth.getSession();
       const language = result.data.language || (session?.user?.user_metadata?.language_preference || 'pl');
       
       // Różne odpowiedzi w zależności od stanu uwierzytelnienia
       if (session?.user) {
         // Dane dla zalogowanego użytkownika
         const userData = await getUserHomeData(supabase, session.user.id, language);
         return createSuccessResponse(userData);
       } else {
         // Dane dla niezalogowanego gościa
         const guestData = await getGuestHomeData(supabase, language);
         return createSuccessResponse(guestData);
       }
     } catch (error) {
       console.error('Home API error:', error);
       
       if (error instanceof ApiError) {
         return error.toResponse();
       }
       
       return createErrorResponse(
         500, 
         'Wystąpił błąd podczas pobierania danych strony głównej', 
         process.env.NODE_ENV === 'development' ? { message: error.message } : undefined
       );
     }
   };
   ```

4. **Aktualizacja middleware (`src/middleware/index.ts`)**:
   - Dodanie `/api/home` do listy API_PATHS, aby zapewnić obsługę JSON:
   ```typescript
   const API_PATHS = ["/api/auth/session", "/api/guides", "/api/plans", "/api/ai", "/api/attractions", "/api/home"];
   ```

5. **Testowanie endpointu**:
   - Test dla niezalogowanych użytkowników
   - Test dla zalogowanych użytkowników
   - Test z różnymi parametrami językowymi
   - Testy obsługi błędów

6. **Dokumentacja**:
   - Aktualizacja dokumentacji API z informacjami o nowym endpoincie
   - Przykłady użycia dla front-endu 