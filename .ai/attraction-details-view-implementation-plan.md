# Plan implementacji widoku Szczegóły atrakcji

## 1. Przegląd
Widok Szczegóły atrakcji służy do prezentacji pełnych informacji o wybranej atrakcji. Użytkownik znajdzie tu opis tekstowy, galerię zdjęć, informacje praktyczne (adres, godziny otwarcia, dane kontaktowe), lokalizację na mapie oraz wszelkie dodatkowe detale, takie jak szacowany czas zwiedzania, ceny biletów czy dostępność dla osób z niepełnosprawnościami. Widok jest ważny z perspektywy nawigacji po atrakcji i zapewnienia pełnej wiedzy przed wizytą na miejscu.

## 2. Routing widoku
- Ścieżka: `/attractions/:id`
- Komponent: `AttractionDetailsPage`
- Parametr `:id` przekazuje identyfikator atrakcji w celu pobrania danych z API.

## 3. Struktura komponentów
Poniżej przedstawiono uproszczony diagram hierarchii komponentów:

```
AttractionDetailsPage
 ├─ AttractionHeader
 │   └─ (np. nazwa atrakcji, przycisk powrotu)
 ├─ AttractionGallery
 │   └─ ImageThumbnail
 ├─ AttractionInfoPanel
 │   ├─ AddressSection
 │   ├─ OpeningHoursSection
 │   ├─ ContactInfoSection
 │   ├─ TicketInfoSection
 │   └─ AccessibilityInfoSection
 ├─ TagsList
 └─ MapSection
```

## 4. Szczegóły komponentów

### 4.1. AttractionDetailsPage
- Opis: Główny komponent strony, ładuje dane o atrakcji i zarządza ich prezentacją.  
- Główne elementy:  
  - Kontener na nagłówek i pozostałe sekcje  
  - Wywołanie logiki do pobrania danych z API w momencie montowania  
- Obsługiwane interakcje:  
  - Kliknięcie przycisku powrotu (nawigacja do poprzedniego ekranu lub widoku planu)  
  - Wybór zdjęcia w galerii (otwarcie pełnego widoku zdjęcia)  
- Obsługiwana walidacja:  
  - Sprawdzenie poprawności parametru `id` (np. jeśli nie istnieje lub jest niepoprawne)  
- Typy:  
  - `AttractionDetailDto` (odpowiedź z API)  
- Propsy:  
  - `attractionId: string` – na podstawie parametru `:id`

### 4.2. AttractionHeader
- Opis: Prezentuje podstawowe informacje o atrakcji (np. tytuł) oraz przycisk powrotu.  
- Główne elementy:  
  - Tytuł atrakcji  
  - Przycisk "Wróć"  
- Obsługiwane interakcje:  
  - Kliknięcie przycisku "Wróć" (wywołanie akcji cofania nawigacji)  
- Obsługiwana walidacja: brak (komponent wyświetla tylko otrzymane dane)  
- Typy:  
  - `string` (tytuł)  
- Propsy:  
  - `name: string` – nazwa atrakcji  
  - `onBack: () => void` – callback do obsługi przycisku powrotu

### 4.3. AttractionGallery
- Opis: Wyświetla galerię zdjęć atrakcji z możliwością powiększania wybranego zdjęcia.  
- Główne elementy:  
  - Lista miniaturek zdjęć  
  - Ewentualne modale lub lightbox do wyświetlania powiększonego zdjęcia  
- Obsługiwane interakcje:  
  - Kliknięcie miniatury zdjęcia – otwarcie powiększonego widoku  
- Obsługiwana walidacja:  
  - Sprawdzenie, czy tablica `images` nie jest pusta (gdy brak zdjęć, można wyświetlić komunikat)  
- Typy:  
  - `string[]` (tablica URL-i do zdjęć)  
- Propsy:  
  - `images: string[]`

### 4.4. AttractionInfoPanel
- Opis: Sekcja zawierająca zestaw informacji praktycznych (adres, godziny otwarcia, kontakt, informacje o biletach, dostępność).  
- Główne elementy:  
  - `AddressSection`  
  - `OpeningHoursSection`  
  - `ContactInfoSection`  
  - `TicketInfoSection`  
  - `AccessibilityInfoSection`  
- Obsługiwane interakcje:  
  - Brak akcji wymagających obsługi zdarzeń; sekcje wyświetlają tylko dane  
- Obsługiwana walidacja:  
  - Format adresu i informacji kontaktowych (komponent sprawdza, czy pola nie są puste)  
- Typy:  
  - `AttractionDetailDto` (częściowe)  
- Propsy:  
  - `address: string`  
  - `openingHours: Record<string, any> | null`  
  - `contactInfo: Record<string, any> | null`  
  - `ticketPriceInfo: string | null`  
  - `accessibilityInfo: string | null`  
  - `averageVisitTimeMinutes?: number | null`

### 4.5. TagsList
- Opis: Wyświetla listę tagów kategoryzujących atrakcję.  
- Główne elementy:  
  - Każdy tag jako etykieta (np. stylizowany `span`)  
- Obsługiwane interakcje: brak (komponent tylko prezentuje)  
- Obsługiwana walidacja: brak (puste lub brak tagów)  
- Typy:  
  - `TagDto[]`  
- Propsy:  
  - `tags: TagDto[]`

### 4.6. MapSection
- Opis: Prezentuje mapę z zaznaczoną lokalizacją atrakcji.  
- Główne elementy:  
  - Komponent mapy (np. Leaflet/OpenStreetMap)  
  - Marker z pozycją atrakcji  
- Obsługiwane interakcje:  
  - Skalowanie mapy, przesuwanie (wbudowane w bibliotekę)  
- Obsługiwana walidacja:  
  - Poprawność współrzędnych geograficznych (sprawdzenie, czy `latitude` i `longitude` istnieją i mieszczą się w sensownym zakresie)  
- Typy:  
  - `GeolocationDto`  
- Propsy:  
  - `geolocation: GeolocationDto`

## 5. Typy
W widoku wykorzystamy następujące typy (z pliku `src/types.ts`):

- `AttractionDetailDto`  
  - `id: string`  
  - `name: string`  
  - `description: string`  
  - `address: string`  
  - `geolocation: GeolocationDto`  
  - `opening_hours: Record<string, any> | null`  
  - `contact_info: Record<string, any> | null`  
  - `images: string[]`  
  - `creator: CreatorMinimalDto`  
  - `average_visit_time_minutes: number | null`  
  - `ticket_price_info: string | null`  
  - `accessibility_info: string | null`  
  - `tags: TagDto[]`
- `TagDto`  
  - `id: string`  
  - `name: string`  
  - `category: string`
- `GeolocationDto`  
  - `latitude: number`  
  - `longitude: number`

Dodatkowo mogą wystąpić struktury pomocnicze do obsługi stanu (np. `LoadingState`, `ErrorState`).

## 6. Zarządzanie stanem
- Główny stan dotyczy danych atrakcji (`AttractionDetailDto` lub wartości pustej w trakcie ładowania).  
- Konieczny jest stan ładowania (np. `isLoading`) i stanu błędu (np. `error`).  
- Rozważ zastosowanie custom hooka `useAttractionDetails(id)` do pobierania i przechowywania aktualnego stanu (dane, błąd, ładowanie).

## 7. Integracja API
- Endpoint: `GET /api/attractions/{id}`  
- Obsługiwane kody statusu:  
  - `200` (sukces)  
  - `404` (atrakcja nie znaleziona)  
  - `500` (błąd serwera)  
- Przykład żądania:  
  ```ts
  const response = await fetch(`/api/attractions/${attractionId}`);
  ```
- Odpowiedź (typ `AttractionDetailDto`):  
  ```json
  {
    "id": "...",
    "name": "...",
    "description": "...",
    ...
  }
  ```
- W przypadku błędu `404` lub `500` należy wyświetlić stosowny komunikat.

## 8. Interakcje użytkownika
1. Użytkownik wchodzi na URL `/attractions/:id` – widok rozpoczyna pobieranie danych.  
2. Użytkownik widzi tytuł, opisy, galerię, panel informacji i tagi.  
3. Użytkownik klika w zdjęcie w `AttractionGallery` – otwiera się pełen widok zdjęcia (modal).  
4. Użytkownik może przesunąć mapę i przybliżyć/oddalić widok.  
5. Użytkownik w razie potrzeby klika "Wróć" – wywołuje callback do poprzedniej strony (np. planu lub listy atrakcji).

## 9. Warunki i walidacja
- Parametr `:id` – musi być zgodny z formatem UUID. Jeśli nie, prezentujemy komunikat błędu.  
- Gdy `images` jest puste, można wyświetlić placeholder lub tekst "Brak grafik".  
- Gdy `TagsList` jest puste, nie pokazujemy sekcji tagów.  
- Gdy brak `geolocation`, ukrywamy mapę lub prezentujemy komunikat "Brak danych lokalizacji".

## 10. Obsługa błędów
- `404 Not Found`: wyświetlamy informację, że atrakcji nie odnaleziono i przycisk do powrotu.  
- `500 Internal Server Error`: wyświetlamy komunikat o błędzie serwera i ewentualną próbę ponownego załadowania.  
- Brak sieci – w przypadku braku łączności można użyć funkcji cache (PWA), jeśli plan został zapisany offline.

## 11. Kroki implementacji
1. Utworzenie pliku widoku `AttractionDetailsPage` w odpowiednim folderze (np. `src/pages/attractions/[id].astro` lub `tsx`).  
2. Zaimportowanie i zdefiniowanie custom hooka `useAttractionDetails(id)`.  
3. Implementacja logiki pobierania danych z API i obsługi stanów (`loading`, `error`, `data`).  
4. Stworzenie i zaimportowanie komponentu `AttractionHeader` z przyciskiem powrotu i nazwą atrakcji.  
5. Stworzenie i zaimportowanie komponentu `AttractionGallery` do obsługi listy zdjęć i modala.  
6. Stworzenie i zaimportowanie komponentu `AttractionInfoPanel` (podkomponenty: `AddressSection`, `OpeningHoursSection`, itp.).  
7. Dodanie komponentu `TagsList` z listą tagów pobranych z `AttractionDetailDto.tags`.  
8. Stworzenie komponentu `MapSection` (np. z użyciem biblioteki Leaflet / Google Maps).  
9. Obsługa błędów: wyświetlanie komunikatów dla `404` i `500`, a także w przypadku braku danych.  
10. Wprowadzenie warunków walidacji danych (np. brak mapy przy braku `geolocation`).  
11. Testy manualne: sprawdzenie widoku z prawidłowym `id`, z nieprawidłowym `id`, przy różnych statusach sieci.  
12. Ewentualna optymalizacja wydajności (np. lazy loading obrazów, pamięć podręczna offline). 