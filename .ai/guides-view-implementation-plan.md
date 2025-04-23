# Plan implementacji widoku /guides

## 1. Przegląd
Widok "Lista przewodników" prezentuje użytkownikowi zbiór dostępnych przewodników, umożliwiając jednocześnie filtrowanie według różnych kryteriów (np. lokalizacja, twórca, język, tagi). Kluczowym celem jest ułatwienie użytkownikowi przeglądania i wybrania interesującego go przewodnika.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką:
- `/guides`

## 3. Struktura komponentów
Poniżej przedstawiono zarys hierarchii komponentów:
```
GuidesView (strona główna widoku)
├── GuidesFiltersPanel
└── GuidesList
    ├── GuideCard (renderowana wielokrotnie)
    └── PaginationControls (opcjonalnie, gdy obsługujemy paginację)
```

## 4. Szczegóły komponentów

### 4.1. Komponent: GuidesView
- Opis komponentu: Jest to komponent najwyższego poziomu obsługujący pobieranie danych z API oraz renderowanie panelu filtrów i listy przewodników.
- Główne elementy: 
  - Sekcja z tytułem strony lub nagłówkiem.
  - Komponent `GuidesFiltersPanel` (opcjonalnie w formie bocznego panela lub wysuwanego menu).
  - Komponent `GuidesList` z wynikami zapytania do endpointu.
- Obsługiwane interakcje:
  - Inicjalizacja filtrowania (np. pobranie domyślnego zestawu filtrów).
  - Przechwytywanie zmian z `GuidesFiltersPanel`.
  - Przekazywanie danych i filtrów do metody pobierającej dane z API.
- Warunki walidacji:
  - Filtrowanie parametrami zdefiniowanymi w endpointach (np. `page`, `limit`, `language` itp.).
- Typy: 
  - Główne typy zapytania i odpowiedzi do API (zawarte w sekcji 5).
  - Specyficzny typ stanu widoku (np. aktualne filtry, dane, stan ładowania).
- Propsy: 
  - Brak bezpośrednich, jest to komponent-strona. Dane pobiera się w nim lub w globalnym store.

### 4.2. Komponent: GuidesFiltersPanel
- Opis komponentu: Umożliwia użytkownikowi wprowadzenie kryteriów filtrowania (twórca, lokalizacja, język, tagi, itp.).
- Główne elementy:
  - Pola selekcji języka, lokalizacji lub twórcy (np. listy rozwijalne).
  - Pole wyszukiwania słownego (np. tytuł, opis).
  - Przycisk "Zastosuj" lub automatyczne zastosowanie zmian.
  - Ewentualnie przełącznik `is_published` czy `is_free` (płatny/bezpłatny).
- Obsługiwane interakcje:
  - Kliknięcie w poszczególne filtry lub pola wybierania wartości.
  - Aktualizacja wybranych filtrów w stanie rodzica (`GuidesView`).
- Warunki walidacji:
  - Weryfikacja poprawnych wartości (np. czy wprowadzona liczba dni jest liczbą dodatnią).
- Typy:
  - ViewModel dla filtrów: { creatorId?: string, location?: string, language?: string, search?: string, ... }.
- Propsy:
  - `initialFilters` (początkowe wartości filtrów).
  - `onFiltersChange` (callback do przekazania zaktualizowanych wartości filtrów).

### 4.3. Komponent: GuidesList
- Opis komponentu: Odpowiada za prezentację listy przewodników oraz obsługę paginacji (lub infinite scroll).
- Główne elementy:
  - Lista przewodników renderowana w pętli, gdzie każdy przewodnik wyświetlany jest jako `GuideCard`.
  - Ewentualny mechanizm paginacji lub infinite scrolla.
  - Komunikat w przypadku braku wyników.
- Obsługiwane interakcje:
  - Przewijanie (w przypadku infinite scroll) lub zmiana strony w przypadku paginacji.
  - Kliknięcie w przewodnik (karta) – przejście do szczegółów.
- Warunki walidacji:
  - Brak szczególnych warunków poza sprawdzeniem dostępności danych (np. pusta lista).
- Typy:
  - Tablica obiektów typu `GuideSummaryDto`.
  - `PaginationInfo` z definicji API.
- Propsy:
  - `guides` (tablica przewodników do wyświetlenia).
  - `pagination` (informacje o paginacji).
  - `onPageChange` (callback do zmiany strony).
  - `loading` (stan ładowania).

### 4.4. Komponent: GuideCard
- Opis komponentu: Renderuje pojedynczy przewodnik z podstawowymi informacjami (tytuł, opis, twórca, ocena, miniatura).
- Główne elementy:
  - Tytuł i krótki opis przewodnika.
  - Informacje o twórcy (nazwa, avatar opcjonalny).
  - Ocena lub jej brak.
  - Cena lub informacja o bezpłatności.
  - Miniatura (cover_image_url) z lazy loadingiem.
- Obsługiwane interakcje:
  - Kliknięcie w kartę, które może kierować do szczegółów wybranego przewodnika.
- Warunki walidacji:
  - Weryfikacja kompletności danych (np. czy jest tytuł, czy jest dostępne `cover_image_url`).
- Typy:
  - `GuideSummaryDto`.
- Propsy:
  - `guide`: Pojedynczy obiekt z informacjami przewodnika.

## 5. Typy
Do wdrożenia widoku wykorzystujemy istniejące typy z pliku `types.ts`, w szczególności:

- `GuideSummaryDto` z polami:  
  - `id: string`  
  - `title: string`  
  - `description: string`  
  - `language: string`  
  - `price: number`  
  - `creator: CreatorMinimalDto`  
  - `location_name: string`  
  - `recommended_days: number`  
  - `cover_image_url: string | null`  
  - `created_at: string`  
  - `average_rating: number | null`
- `PaginationInfo` dla obsługi paginacji:
  - `total: number`
  - `page: number`
  - `limit: number`
  - `pages: number`
- Specyficzne typy do widoku (ViewModel filtrów, np. `GuidesFilterViewModel`):  
  ```ts
  interface GuidesFilterViewModel {
    search?: string;
    creator_id?: string;
    language?: string;
    location?: string;
    min_days?: number;
    max_days?: number;
    is_published?: boolean;
    page?: number;
    limit?: number;
    // ... kolejne pola w zależności od potrzeb
  }
  ```

## 6. Zarządzanie stanem
- Stanem można zarządzać lokalnie w komponencie `GuidesView`, który będzie korzystać z `useState` lub `useReducer`.
- Filtry oraz pobrane dane przechowywane są w stanie rodzica:
  - `filters` (z wartościami, które są przekazywane do `GuidesFiltersPanel`)
  - `guides` (tablica przewodników pobranych z API)
  - `pagination` (struktura do zarządzania paginacją)
  - `loading` (flaga informująca o ładowaniu danych)
- W razie potrzeby można stworzyć customowy hook (np. `useGuides`), który incapsuluje logikę pobierania przewodników i aktualizacji filtrów.

## 7. Integracja API
- Korzystamy z endpointu `GET /api/guides`.
- Zapytanie wysyłamy z parametrami pobieranymi z obiektu `filters` (np. `page`, `limit`, `creator_id`, `language`, `location`, `search`).
- Odpowiedź w formie:
  ```json
  {
    "data": [ GuideSummaryDto... ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "pages": number
    }
  }
  ```
- Po otrzymaniu odpowiedzi ustawiamy dane (tablica `guides`), a także aktualizujemy `pagination`.

## 8. Interakcje użytkownika
- Użytkownik wybiera filtry w `GuidesFiltersPanel` → stan filtrów uaktualniany jest w `GuidesView`.
- `GuidesView` wywołuje metodę do pobrania danych z API z nowymi parametrami.
- Użytkownik może zmienić stronę (w paginacji) → ponowna aktualizacja zapytania.
- Użytkownik klika w `GuideCard` → przejście do ekranu szczegółowego przewodnika (np. `/guides/[guideId]`).

## 9. Warunki i walidacja
- Walidacja wejściowych wartości filtrów (np. `page`, `limit`, `min_days`, `max_days`) – sprawdzamy, czy mieszczą się w logice wymagań (np. `page >= 1`, `limit <= 50`).
- Jeśli serwer zwróci błąd, użytkownikowi wyświetlamy komunikat o błędzie (np. alert lub dedykowany komponent).
- Sprawdzanie braku wyników: jeśli `data` puste, wyświetlamy komunikat "Brak dostępnych przewodników".

## 10. Obsługa błędów
- Błędy sieciowe (np. brak Internetu, błąd serwera 500) – wyświetlamy odpowiedni komunikat i dajemy możliwość ponownego pobrania.
- Błędy walidacji danych filtrów – można wstępnie uniemożliwić wysłanie zapytania o błędnych parametrach.
- W przypadku wystąpienia nieoczekiwanego błędu – wyświetlamy komunikat z możliwością odświeżenia widoku.

## 11. Kroki implementacji

1. Stworzyć ścieżkę `/guides` w routerze aplikacji, zwracając komponent `GuidesView`.
2. Zaimplementować komponent `GuidesView`:
   - Zainicjować stan filtrów, stanu ładowania, błędu i wyników.
   - W metodzie `useEffect` (lub w customowym hoooku) wywoływać zapytanie do `GET /api/guides`.
   - Przekazywać pobrane dane do `GuidesList`.
   - Przekazywać wartość filtrów i callback do `GuidesFiltersPanel`.
3. Stworzyć komponent `GuidesFiltersPanel`:
   - Renderować kontrolki do filtrowania (lista rozwijalna, input tekstowy).
   - Po zmianie wartości wywoływać `onFiltersChange` z aktualnymi filtrami.
4. Stworzyć komponent `GuidesList`:
   - Renderować listę `GuideCard` dla każdego elementu w tablicy `guides`.
   - Obsługiwać paginację (jeśli wymagana) przez wywołanie `onPageChange`.
   - Gdy tablica jest pusta (i brak błędu), wyświetlać komunikat: "Brak dostępnych przewodników".
5. Zaimplementować komponent `GuideCard`:
   - Prezentować dane o przewodniku (tytuł, autor, cena, ocena).
   - Dodać link do szczegółów (np. `<a href="/guides/[guideId]">`).
   - Zapewnić lazy loading obrazka `cover_image_url`.
6. Dodać obsługę błędów i stanów (np. `loading`, `error`) w `GuidesView`.
7. Przetestować zarówno na desktopie, jak i urządzeniach mobilnych (responsywność i dostępność).
8. Wprowadzić ewentualne poprawki oraz przejrzeć całość pod kątem wymagań (np. walidacja filtrów, dostępność klawiatury).
9. Opcjonalnie zaimplementować infinite scroll zamiast paginacji, jeśli będzie to wymagane.
10. Dokonać code review, upewniając się, że całość jest zgodna z wytycznymi PRD. 