# API Endpoint Implementation Plan: POST /api/guides

## 1. Przegląd punktu końcowego
Endpoint `POST /api/guides` umożliwia twórcom (creators) tworzenie nowych przewodników (guides). Tylko zalogowani użytkownicy z uprawnieniami twórcy mogą tworzyć nowe przewodniki. Endpoint zwraca szczegółowe informacje o utworzonym przewodniku, bez danych o atrakcjach.

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Struktura URL: `/api/guides`
- Request Body:
  ```json
  {
    "title": "string",
    "description": "string",
    "language": "string",
    "price": "decimal",
    "location_name": "string",
    "recommended_days": "integer",
    "cover_image_url": "string",
    "is_published": "boolean"
  }
  ```
- Parametry:
  - Wymagane: `title`, `description`, `location_name`
  - Opcjonalne: `language` (domyślnie "pl"), `price` (domyślnie 0.00), `recommended_days` (domyślnie 1), `cover_image_url` (może być null), `is_published` (domyślnie false)

## 3. Wykorzystywane typy
- **Command Models**:
  - `UpsertGuideCommand` - dla walidacji i przetwarzania danych wejściowych
- **Response DTO**:
  - `GuideDetailDto` - do zwracania szczegółów utworzonego przewodnika (bez atrakcji)
- **Pomocnicze typy**:
  - `CreatorMinimalDto` - informacje o twórcy w odpowiedzi
  - `DatabaseGuide` - wewnętrzny typ reprezentujący dane z bazy

## 4. Szczegóły odpowiedzi
- Status Code: 201 Created
- Response Body: GuideDetailDto (taki sam jak zwracany przez GET /api/guides/{id}, ale bez attractions)
  ```json
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "language": "string",
    "price": number,
    "creator": {
      "id": "uuid",
      "display_name": "string"
    },
    "location_name": "string",
    "recommended_days": number,
    "cover_image_url": "string | null",
    "created_at": "string",
    "updated_at": "string",
    "is_published": boolean,
    "version": number,
    "reviews_count": number,
    "average_rating": number | null
  }
  ```

## 5. Przepływ danych
1. Walidacja danych wejściowych za pomocą Zod
2. Sprawdzenie uwierzytelnienia i autoryzacji użytkownika
3. Pobranie danych twórcy dla zalogowanego użytkownika
4. Utworzenie nowego rekordu w tabeli `guides`
5. Pobranie szczegółów utworzonego przewodnika
6. Zwrócenie odpowiedzi z kodem 201 i danymi utworzonego przewodnika

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**: Punkt końcowy wymaga zalogowanego użytkownika (sesja Supabase)
- **Autoryzacja**: Użytkownik musi być zarejestrowanym twórcą (sprawdzenie w tabeli `creators`)
- **Walidacja danych**: Wszystkie dane wejściowe są walidowane przy użyciu Zod
- **Sanityzacja danych**: Zapobieganie atakom XSS przez odpowiednią walidację pól tekstowych
- **Bezpieczne przekazywanie SupabaseClient**: Używanie klienta z `context.locals.supabase`

## 7. Obsługa błędów
- 400 Bad Request:
  - Brak wymaganych pól
  - Nieprawidłowe typy danych
  - Nieprawidłowe wartości (np. ujemna cena)
- 401 Unauthorized:
  - Użytkownik nie jest zalogowany
- 403 Forbidden:
  - Użytkownik jest zalogowany, ale nie jest twórcą
- 500 Internal Server Error:
  - Błąd podczas zapisu do bazy danych
  - Inne nieoczekiwane błędy serwera

## 8. Rozważania dotyczące wydajności
- Ograniczenie długości pól tekstowych w walidacji
- Optymalizacja zapytań do bazy danych
- Zapisywanie URL obrazów z odpowiednimi wymiarami (bez przesyłania zbyt dużych plików)
- Monitorowanie czasu odpowiedzi endpointu

## 9. Etapy wdrożenia

### 1. Utworzenie lub rozszerzenie serwisu dla przewodników

Dodanie metody `createGuide` w `src/lib/services/guides.service.ts`:

```typescript
async createGuide(
  supabase: SupabaseClient,
  creatorId: string,
  data: UpsertGuideCommand
): Promise<GuideDetailDto> {
  // Mapowanie danych wejściowych na strukturę DB
  const guideData = {
    creator_id: creatorId,
    title: data.title,
    description: data.description,
    language: data.language || 'pl',
    price: data.price || 0,
    location_name: data.location_name,
    recommended_days: data.recommended_days || 1,
    cover_image_url: data.cover_image_url || null,
    is_published: data.is_published || false
  };

  // Wstawianie do bazy danych
  const { data: newGuide, error } = await supabase
    .from('guides')
    .insert(guideData)
    .select('id')
    .single();

  if (error) {
    throw new ApiError(
      ApiErrorTypes.INTERNAL_ERROR,
      'Błąd podczas tworzenia przewodnika',
      error
    );
  }

  // Pobieranie pełnych danych nowo utworzonego przewodnika
  const guide = await this.getGuideDetails(supabase, newGuide.id);
  
  if (!guide) {
    throw new ApiError(
      ApiErrorTypes.INTERNAL_ERROR,
      'Nie udało się pobrać utworzonego przewodnika',
      null
    );
  }
  
  return guide;
}
```

### 2. Utworzenie schematu walidacji Zod

Dodanie w `src/lib/schemas/guide.schema.ts`:

```typescript
import { z } from 'zod';

export const createGuideSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(10),
  language: z.string().length(2).default('pl').optional(),
  price: z.number().min(0).default(0).optional(),
  location_name: z.string().min(2).max(255),
  recommended_days: z.number().int().min(1).default(1).optional(),
  cover_image_url: z.string().url().nullable().optional(),
  is_published: z.boolean().default(false).optional()
});
```

### 3. Implementacja endpointu API

Utworzenie lub aktualizacja `src/pages/api/guides/index.ts`:

```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { guidesService } from '../../../lib/services/guides.service';
import { createGuideSchema } from '../../../lib/schemas/guide.schema';
import { ApiError, ApiErrorTypes, errorResponse, successResponse } from '../../../lib/utils/api-response';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Sprawdzenie uwierzytelnienia
    if (!locals.session) {
      return errorResponse(401, 'Unauthorized', 'Wymagane zalogowanie');
    }

    // Sprawdzenie, czy użytkownik jest twórcą
    const { data: creator, error: creatorError } = await locals.supabase
      .from('creators')
      .select('id')
      .eq('user_id', locals.session.user.id)
      .single();

    if (creatorError || !creator) {
      return errorResponse(403, 'Forbidden', 'Brak uprawnień twórcy');
    }

    // Walidacja danych wejściowych
    const jsonData = await request.json();
    const result = createGuideSchema.safeParse(jsonData);

    if (!result.success) {
      return errorResponse(
        400,
        'Bad Request',
        'Nieprawidłowe dane wejściowe',
        result.error.format()
      );
    }

    // Utworzenie przewodnika
    const newGuide = await guidesService.createGuide(
      locals.supabase,
      creator.id,
      result.data
    );

    // Zwrócenie odpowiedzi
    return successResponse(201, newGuide);

  } catch (error) {
    console.error('Error creating guide:', error);
    
    if (error instanceof ApiError) {
      return errorResponse(
        error.statusCode,
        error.type,
        error.message,
        error.details
      );
    }
    
    return errorResponse(
      500,
      'Internal Server Error',
      'Wystąpił nieoczekiwany błąd podczas tworzenia przewodnika'
    );
  }
};
```

### 4. Dodanie testów jednostkowych

Utworzenie testów w `src/tests/api/guides/create-guide.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../pages/api/guides/index';
import { guidesService } from '../../../lib/services/guides.service';

// Mock supabase i guidesService
vi.mock('../../../lib/services/guides.service', () => ({
  guidesService: {
    createGuide: vi.fn()
  }
}));

describe('POST /api/guides', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    const request = new Request('http://localhost/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const response = await POST({
      request,
      locals: { supabase: {}, session: null }
    } as any);

    expect(response.status).toBe(401);
  });

  it('should return 403 if user is not a creator', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
    };

    const request = new Request('http://localhost/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const response = await POST({
      request,
      locals: { 
        supabase: mockSupabase, 
        session: { user: { id: 'user-id' } } 
      }
    } as any);

    expect(response.status).toBe(403);
  });

  it('should return 400 if input data is invalid', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'creator-id' }, error: null })
    };

    const request = new Request('http://localhost/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Missing required fields
      })
    });

    const response = await POST({
      request,
      locals: { 
        supabase: mockSupabase, 
        session: { user: { id: 'user-id' } } 
      }
    } as any);

    expect(response.status).toBe(400);
  });

  it('should create a guide and return 201 with guide data', async () => {
    const guideData = {
      title: 'Test Guide',
      description: 'Test description',
      location_name: 'Test Location',
      recommended_days: 3,
      price: 10.99
    };

    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'creator-id' }, error: null })
    };

    const mockCreatedGuide = {
      id: 'guide-id',
      ...guideData,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      version: 1,
      is_published: false,
      creator: { id: 'creator-id', display_name: 'Test Creator' },
      reviews_count: 0,
      average_rating: null
    };

    vi.mocked(guidesService.createGuide).mockResolvedValue(mockCreatedGuide);

    const request = new Request('http://localhost/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guideData)
    });

    const response = await POST({
      request,
      locals: { 
        supabase: mockSupabase, 
        session: { user: { id: 'user-id' } } 
      }
    } as any);

    expect(response.status).toBe(201);
    const responseData = await response.json();
    expect(responseData.data).toEqual(mockCreatedGuide);
    expect(guidesService.createGuide).toHaveBeenCalledWith(
      mockSupabase,
      'creator-id',
      expect.objectContaining(guideData)
    );
  });
});
```

### 5. Dokumentacja i aktualizacja API Docs

Aktualizacja dokumentacji API w `docs/api/guides.md` lub innym odpowiednim miejscu:

```markdown
## POST /api/guides

Tworzy nowy przewodnik. Wymaga uwierzytelnienia i uprawnień twórcy.

### Parametry żądania
| Nazwa | Typ | Wymagane | Opis |
|-------|-----|----------|------|
| title | string | Tak | Tytuł przewodnika (5-255 znaków) |
| description | string | Tak | Opis przewodnika (min. 10 znaków) |
| language | string | Nie | Kod języka (domyślnie "pl") |
| price | number | Nie | Cena przewodnika (domyślnie 0) |
| location_name | string | Tak | Nazwa lokalizacji (2-255 znaków) |
| recommended_days | integer | Nie | Zalecana liczba dni (domyślnie 1) |
| cover_image_url | string | Nie | URL obrazu okładki (może być null) |
| is_published | boolean | Nie | Czy przewodnik jest opublikowany (domyślnie false) |

### Odpowiedź
Zwraca szczegóły utworzonego przewodnika (GuideDetailDto) bez danych o atrakcjach.

### Kody odpowiedzi
- 201: Przewodnik utworzony pomyślnie
- 400: Nieprawidłowe dane wejściowe
- 401: Wymagane zalogowanie
- 403: Brak uprawnień twórcy
- 500: Błąd wewnętrzny serwera