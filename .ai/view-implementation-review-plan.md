# API Endpoint Implementation Plan: Create Guide Review

## 1. Przegląd punktu końcowego

Endpoint umożliwia użytkownikom tworzenie recenzji dla konkretnego przewodnika. Każdy użytkownik może utworzyć tylko jedną aktywną recenzję na przewodnik, co zapewnia integralność danych i zapobiega spamowi. Endpoint wymaga uwierzytelnienia użytkownika i zwraca pełne dane recenzji wraz z informacjami o użytkowniku.

## 2. Szczegóły żądania

- **Metoda HTTP**: POST
- **Struktura URL**: `/api/guides/{guide_id}/reviews`
- **Parametry**:
  - **Wymagane**: 
    - `guide_id` (path parameter) - UUID przewodnika
    - `rating` (request body) - Ocena w skali 1-5 (integer)
  - **Opcjonalne**: 
    - `comment` (request body) - Komentarz tekstowy do recenzji (string)
- **Request Body**:
  ```json
  {
    "rating": 5,
    "comment": "Świetny przewodnik, bardzo szczegółowy!"
  }
  ```
- **Headers**: 
  - `Content-Type: application/json`
  - Authorization wymagana poprzez Supabase session

## 3. Wykorzystywane typy

- **UpsertReviewCommand** - Walidacja danych wejściowych z request body
- **ReviewDto** - Struktura odpowiedzi z pełnymi danymi recenzji
- **UserWithAvatarDto** - Informacje o użytkowniku w odpowiedzi (id, avatar_url)
- **ErrorResponse** - Standardowa struktura błędów API

## 4. Szczegóły odpowiedzi

**Sukces (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "avatar_url": "https://example.com/avatar.jpg"
  },
  "rating": 5,
  "comment": "Świetny przewodnik, bardzo szczegółowy!",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Błędy:**
- **400 Bad Request**: Nieprawidłowe dane wejściowe
- **401 Unauthorized**: Brak uwierzytelnienia
- **404 Not Found**: Przewodnik nie istnieje
- **409 Conflict**: Użytkownik już ma recenzję tego przewodnika
- **500 Internal Server Error**: Błąd serwera

## 5. Przepływ danych

1. **Walidacja wstępna**: Sprawdzenie formatu UUID i obecności wymaganych pól
2. **Uwierzytelnienie**: Pobranie danych użytkownika z Supabase session
3. **Walidacja przewodnika**: Sprawdzenie czy przewodnik istnieje i jest opublikowany
4. **Sprawdzenie duplikatów**: Weryfikacja czy użytkownik nie ma już recenzji dla tego przewodnika
5. **Utworzenie recenzji**: Zapis do bazy danych z aktualnym timestampem
6. **Pobranie danych użytkownika**: Uzyskanie avatar_url dla odpowiedzi
7. **Zwrócenie odpowiedzi**: Sformatowanie ReviewDto i wysłanie z kodem 201

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie obowiązkowe**: Endpoint wymaga aktywnej sesji Supabase
- **Autoryzacja**: Użytkownicy mogą tworzyć recenzje tylko pod własnym kontem
- **Walidacja danych**: Wszystkie dane wejściowe są walidowane przez Zod schema
- **Ochrona przed duplikatami**: Constraint na poziomie bazy danych zapobiega wielokrotnym recenzjom
- **Sanityzacja**: Komentarze są przechowywane jako zwykły tekst bez możliwości XSS
- **Rate limiting**: Należy rozważyć implementację ograniczeń częstotliwości

## 7. Obsługa błędów

| Kod | Scenariusz | Obsługa |
|-----|------------|---------|
| 400 | Nieprawidłowy rating (poza zakresem 1-5) | Walidacja Zod, zwrócenie szczegółów błędu |
| 400 | Nieprawidłowy format UUID guide_id | Walidacja Zod, komunikat o błędnym formacie |
| 401 | Brak lub nieprawidłowa sesja użytkownika | Sprawdzenie context.locals.supabase.auth |
| 404 | Przewodnik nie istnieje lub nie jest opublikowany | Query do tabeli guides z filtrem is_published |
| 409 | Duplikat recenzji (użytkownik już recenzował) | Sprawdzenie istniejącej recenzji przed utworzeniem |
| 500 | Błąd bazy danych lub serwera | Logowanie błędu, generyczny komunikat użytkownikowi |

## 8. Rozważania dotyczące wydajności

- **Optymalizacja zapytań**: Użycie pojedynczego zapytania do sprawdzenia istnienia przewodnika i duplikatu recenzji
- **Indeksowanie**: Tabela reviews ma indeks na (user_id, guide_id) dla szybkiego sprawdzania duplikatów
- **Cache**: Rozważenie cache'owania informacji o przewodnikach dla częstych sprawdzeń
- **Transakcje**: Użycie transakcji bazy danych dla atomowości operacji
- **Limity**: Ograniczenie długości komentarza dla optymalnej wydajności

## 9. Etapy wdrożenia

1. **Utworzenie schematu walidacji Zod**
   - Definicja schema dla UpsertReviewCommand
   - Walidacja guide_id jako UUID
   - Walidacja rating w zakresie 1-5
   - Opcjonalna walidacja comment

2. **Implementacja ReviewsService w `src/lib/services/`**
   - Metoda `createReview(userId: string, guideId: string, command: UpsertReviewCommand)`
   - Sprawdzenie istnienia i dostępności przewodnika
   - Weryfikacja braku istniejącej recenzji
   - Utworzenie recenzji w bazie danych
   - Pobranie danych użytkownika dla odpowiedzi

3. **Utworzenie endpointu API `src/pages/api/guides/[guide_id]/reviews.ts`**
   - Export `const prerender = false`
   - Implementacja funkcji POST
   - Walidacja parametrów ścieżki i request body
   - Uwierzytelnienie przez context.locals.supabase

4. **Implementacja obsługi błędów**
   - Try-catch dla wszystkich operacji bazy danych
   - Mapowanie błędów Supabase na odpowiednie kody HTTP
   - Logowanie błędów serwera
   - Zwracanie ErrorResponse dla wszystkich błędów

5. **Testy jednostkowe i integracyjne**
   - Testy walidacji danych wejściowych
   - Testy scenariuszy błędów
   - Testy uwierzytelnienia i autoryzacji
   - Testy integralności danych (duplikaty)

6. **Dokumentacja i walidacja**
   - Aktualizacja dokumentacji API
   - Testy manualne wszystkich scenariuszy
   - Weryfikacja bezpieczeństwa
   - Przegląd kodu zespołu 