# API Endpoint Implementation Plan: POST /api/attractions

## 1. Przegląd punktu końcowego
Endpoint POST /api/attractions umożliwia twórcom dodawanie nowych atrakcji do systemu. Atrakcje są podstawowym elementem treści, który może być później dołączany do przewodników. Tylko zarejestrowani i zweryfikowani twórcy mają uprawnienia do tworzenia nowych atrakcji.

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Struktura URL: `/api/attractions`
- Parametry:
  - Wymagane: Brak (dane przekazywane w ciele żądania)
  - Opcjonalne: Brak
- Request Body:
  ```json
  {
    "name": "string",
    "description": "string",
    "address": "string",
    "geolocation": {
      "latitude": "decimal",
      "longitude": "decimal"
    },
    "opening_hours": "object",
    "contact_info": "object",
    "images": ["string"],
    "average_visit_time_minutes": "integer",
    "ticket_price_info": "string",
    "accessibility_info": "string",
    "tag_ids": ["uuid"]
  }
  ```

## 3. Wykorzystywane typy
- **Typy z `src/types.ts`**:
  - `UpsertAttractionCommand` - Model żądania tworzenia nowej atrakcji
  - `AttractionDetailDto` - Format odpowiedzi API
  - `GeolocationDto` - Format danych geolokalizacyjnych
  - `TagDto` - Format informacji o tagach atrakcji

- **Schemat walidacji Zod** (nowy plik `src/schemas/attraction-create.schema.ts`):
  ```typescript
  import { z } from 'zod';

  export const createAttractionSchema = z.object({
    name: z.string().min(1, "Nazwa jest wymagana").max(255),
    description: z.string().min(1, "Opis jest wymagany"),
    address: z.string().min(1, "Adres jest wymagany"),
    geolocation: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
    opening_hours: z.record(z.any()).optional().nullable(),
    contact_info: z.record(z.any()).optional().nullable(),
    images: z.array(z.string().url()).min(1, "Wymagane jest co najmniej jedno zdjęcie"),
    average_visit_time_minutes: z.number().int().positive().optional().nullable(),
    ticket_price_info: z.string().optional().nullable(),
    accessibility_info: z.string().optional().nullable(),
    tag_ids: z.array(z.string().uuid()).min(1, "Wymagany jest co najmniej jeden tag"),
  });
  ```

## 4. Szczegóły odpowiedzi
- **Kod sukcesu**: 201 Created
- **Format odpowiedzi**: Taki sam jak dla GET /api/attractions/{id}
  ```json
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "address": "string",
    "geolocation": {
      "latitude": "decimal",
      "longitude": "decimal"
    },
    "opening_hours": "object",
    "contact_info": "object",
    "images": ["string"],
    "creator": {
      "id": "uuid",
      "display_name": "string"
    },
    "average_visit_time_minutes": "integer",
    "ticket_price_info": "string",
    "accessibility_info": "string",
    "tags": [
      {
        "id": "uuid",
        "name": "string",
        "category": "string"
      }
    ]
  }
  ```

## 5. Przepływ danych
1. **Odbiór żądania**:
   - Przychodzące żądanie POST jest przechwytywane przez endpoint `/api/attractions`
   - JSON z ciała żądania jest parsowany i walidowany za pomocą schematu Zod

2. **Uwierzytelnianie i autoryzacja**:
   - Sprawdzenie czy użytkownik jest zalogowany (poprzez token JWT w middleware Astro)
   - Weryfikacja czy zalogowany użytkownik jest twórcą (pobranie rekordu z tabeli creators)

3. **Walidacja danych**:
   - Sprawdzenie poprawności typów i wartości danych wejściowych
   - Weryfikacja istnienia wszystkich podanych identyfikatorów tagów
   - Walidacja adresu URL obrazów i ich istnienia

4. **Przetwarzanie danych**:
   - Konwersja danych geolokalizacyjnych do formatu POINT dla PostgreSQL
   - Transformacja danych wejściowych do formatu wymaganego przez bazę danych

5. **Operacje bazodanowe**:
   - Wstawienie nowego rekordu do tabeli `attractions`
   - Utworzenie powiązań w tabeli `attraction_tags` dla każdego podanego tag_id
   - Wszystkie operacje powinny być wykonane jako transakcja

6. **Formowanie odpowiedzi**:
   - Pobranie utworzonej atrakcji wraz z powiązanymi danymi
   - Konwersja do formatu DTO
   - Zwrócenie odpowiedzi z kodem 201 Created

## 6. Względy bezpieczeństwa
1. **Uwierzytelnianie**:
   - Wymagane uwierzytelnienie użytkownika (token JWT)
   - Wykorzystanie Supabase dla weryfikacji sesji użytkownika

2. **Autoryzacja**:
   - Sprawdzenie czy użytkownik ma rolę twórcy
   - Zapisanie creator_id użytkownika jako właściciela atrakcji

3. **Walidacja danych wejściowych**:
   - Sanityzacja wszystkich danych wejściowych
   - Walidacja typów i formatów za pomocą Zod
   - Unikanie injekcji SQL poprzez parametryzowane zapytania Supabase

4. **Bezpieczeństwo adresów URL obrazów**:
   - Walidacja poprawności adresów URL
   - Sprawdzenie czy obrazy są hostowane w dozwolonych domenach (opcjonalnie)

5. **Ograniczenie wielkości danych**:
   - Limit rozmiaru żądania
   - Limity długości pól tekstowych zgodnie ze schematem bazy danych

## 7. Obsługa błędów
- **400 Bad Request**:
  - Nieprawidłowe dane wejściowe (brak wymaganych pól, niepoprawny format)
  - Nieprawidłowe identyfikatory tagów
  - Nieprawidłowy format geolokalizacji
  - Nieprawidłowe adresy URL obrazów

- **401 Unauthorized**:
  - Brak tokenu uwierzytelniającego
  - Wygasły token uwierzytelniający

- **403 Forbidden**:
  - Użytkownik nie ma uprawnień twórcy

- **500 Internal Server Error**:
  - Błędy bazy danych
  - Błędy walidacji, które nie zostały obsłużone wcześniej
  - Nieoczekiwane wyjątki

## 8. Rozważania dotyczące wydajności
1. **Optymalizacja bazy danych**:
   - Wykorzystanie indeksów dla szybkiego wyszukiwania tagów
   - Wykonanie operacji dodawania tagów w jednym zapytaniu zamiast wielu pojedynczych

2. **Przetwarzanie obrazów**:
   - Rozważenie asynchronicznego przetwarzania dla walidacji obrazów
   - Potencjalne dodanie usługi CDN do zarządzania obrazami

3. **Buforowanie**:
   - Implementacja pamięci podręcznej dla często używanych tagów
   - Korzystanie z buforowania po stronie klienta dla odpowiedzi

## 9. Etapy wdrożenia
1. **Przygotowanie schematu walidacji**:
   - Utworzenie pliku `src/schemas/attraction-create.schema.ts` z definicją schematu Zod
   - Implementacja walidacji dla wszystkich pól zgodnie ze specyfikacją

2. **Rozszerzenie serwisu atrakcji**:
   - Dodanie metody `createAttraction` w pliku `src/lib/services/attractions.service.ts`
   - Implementacja logiki transakcji dla tworzenia atrakcji i powiązań z tagami

3. **Implementacja endpointu API**:
   - Dodanie metody POST w pliku `src/pages/api/attractions/index.ts`
   - Integracja z serwisem atrakcji
   - Implementacja obsługi błędów i formowania odpowiedzi

4. **Testy jednostkowe**:
   - Napisanie testów dla walidacji danych wejściowych
   - Testy dla obsługi różnych scenariuszy błędów
   - Testy dla poprawnego tworzenia atrakcji

5. **Testy integracyjne**:
   - Testy dla całego przepływu od żądania do odpowiedzi
   - Weryfikacja poprawności tworzenia rekordów w bazie danych
   - Sprawdzenie integralności odniesień do tagów

6. **Dokumentacja**:
   - Aktualizacja dokumentacji API
   - Dodanie przykładów użycia dla front-end developerów

7. **Wdrożenie**:
   - Code review
   - Wdrożenie do środowiska testowego
   - Wdrożenie do produkcji 