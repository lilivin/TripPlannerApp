# Plan implementacji widoku Listy Planów Użytkownika

## 1. Przegląd
Widok Listy Planów Użytkownika wyświetla wszystkie zapisane plany podróży danego użytkownika. Strona umożliwia użytkownikowi przeglądanie, filtrowanie oraz zarządzanie swoimi planami, w tym wyświetlanie szczegółów, usuwanie planów oraz oznaczanie ich do używania w trybie offline.

## 2. Routing widoku
Widok powinien być dostępny pod ścieżką: `/plans`

## 3. Struktura komponentów
```
PlansPage (Astro)
└── PlansView (React)
    ├── PlansHeader
    ├── PlansFilters
    ├── PlansList
    │   └── PlanCard (wielokrotne wystąpienie)
    ├── PlansPagination
    ├── ConfirmDeleteDialog
    └── NoPlansMessage
```

## 4. Szczegóły komponentów

### PlansPage
- Opis komponentu: Główny komponent Astro będący kontenerem dla komponentu React
- Główne elementy: Importuje i renderuje komponent React PlansView z atrybutem client:load
- Obsługiwane interakcje: Brak (komponent Astro)
- Obsługiwana walidacja: Brak (komponent Astro)
- Typy: Brak dodatkowych typów
- Propsy: Brak

### PlansView
- Opis komponentu: Główny kontener widoku zarządzający stanem i logiką biznesową
- Główne elementy: Zawiera nagłówek, filtry, listę planów i paginację
- Obsługiwane interakcje:
  - Pobieranie listy planów użytkownika
  - Filtrowanie planów
  - Usuwanie planów
  - Nawigacja między stronami wyników
- Obsługiwana walidacja:
  - Sprawdzanie poprawności parametrów filtrowania
  - Sprawdzanie stanu autentykacji użytkownika
- Typy:
  - `PlansViewModel` (rozszerza podstawowe typy odpowiedzi API)
  - `PlansViewFilterState`
- Propsy: Brak (komponent główny)

### PlansHeader
- Opis komponentu: Wyświetla nagłówek widoku z tytułem i podstawowymi akcjami
- Główne elementy: Tytuł sekcji, liczba planów, przycisk do tworzenia nowego planu
- Obsługiwane interakcje: Przekierowanie do widoku tworzenia nowego planu
- Obsługiwana walidacja: Brak
- Typy: Brak dodatkowych typów
- Propsy: 
  - `title: string`
  - `totalPlans: number`
  - `onCreateNew: () => void`

### PlansFilters
- Opis komponentu: Panel filtrów umożliwiający zawężanie listy planów
- Główne elementy: Formularz z opcjami filtrowania (ulubione, niedawne)
- Obsługiwane interakcje: Zmiana stanu filtrów z automatycznym odświeżeniem listy
- Obsługiwana walidacja: Poprawność typów danych filtru
- Typy: `PlansViewFilterState`
- Propsy:
  - `filters: PlansViewFilterState`
  - `onFilterChange: (filters: PlansViewFilterState) => void`
  - `isLoading: boolean`

### PlansList
- Opis komponentu: Kontener wyświetlający listę kart planów
- Główne elementy: Lista kart planów lub komunikat o braku wyników
- Obsługiwane interakcje: Delegacja interakcji do komponentów-dzieci
- Obsługiwana walidacja: Brak
- Typy: `PlanSummaryViewModel`
- Propsy:
  - `plans: PlanSummaryViewModel[]`
  - `isLoading: boolean`
  - `onViewPlan: (id: string) => void`
  - `onDeletePlan: (id: string) => void`
  - `onToggleOffline: (id: string, isOfflineAvailable: boolean) => void`

### PlanCard
- Opis komponentu: Reprezentacja pojedynczego planu w formie karty
- Główne elementy: Tytuł planu, nazwa przewodnika, data utworzenia, akcje
- Obsługiwane interakcje:
  - Wyświetlenie szczegółów planu
  - Usunięcie planu
  - Przełączenie dostępności offline
- Obsługiwana walidacja: Brak
- Typy: `PlanSummaryViewModel`
- Propsy:
  - `plan: PlanSummaryViewModel`
  - `onView: () => void`
  - `onDelete: () => void`
  - `onToggleOffline: (isOfflineAvailable: boolean) => void`
  - `isOfflineAvailable: boolean`

### PlansPagination
- Opis komponentu: Nawigacja do przełączania między stronami wyników
- Główne elementy: Przyciski do nawigacji, licznik stron
- Obsługiwane interakcje: Zmiana strony
- Obsługiwana walidacja: Brak
- Typy: Brak dodatkowych typów
- Propsy:
  - `currentPage: number`
  - `totalPages: number`
  - `onPageChange: (page: number) => void`
  - `isLoading: boolean`

### ConfirmDeleteDialog
- Opis komponentu: Dialog potwierdzenia usunięcia planu
- Główne elementy: Komunikat ostrzegawczy, przyciski potwierdzenia i anulowania
- Obsługiwane interakcje: Potwierdzenie lub anulowanie usunięcia
- Obsługiwana walidacja: Brak
- Typy: Brak dodatkowych typów
- Propsy:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onConfirm: () => void`
  - `planName: string`

### NoPlansMessage
- Opis komponentu: Komunikat wyświetlany gdy użytkownik nie ma jeszcze planów
- Główne elementy: Informacja tekstowa, przycisk tworzenia nowego planu
- Obsługiwane interakcje: Przekierowanie do widoku tworzenia planu
- Obsługiwana walidacja: Brak
- Typy: Brak dodatkowych typów
- Propsy:
  - `onCreateNew: () => void`
  - `isFiltered: boolean`

## 5. Typy

### PlanSummaryViewModel
```typescript
interface PlanSummaryViewModel {
  id: string;
  name: string;
  guide: {
    id: string;
    title: string;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  formattedDate: string; // Format przyjazny dla użytkownika
}
```

### PlansViewModel
```typescript
interface PlansViewModel {
  plans: PlanSummaryViewModel[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  isLoading: boolean;
  error: string | null;
}
```

### PlansViewFilterState
```typescript
interface PlansViewFilterState {
  isFavorite?: boolean;
  guideId?: string;
  page: number;
  limit: number;
}
```

### OfflineStatusViewModel
```typescript
interface OfflineStatusViewModel {
  planId: string;
  isAvailableOffline: boolean;
  lastSynced: string | null;
}
```

## 6. Zarządzanie stanem
Stan widoku będzie zarządzany za pomocą customowych hooków:

### usePlansView
```typescript
function usePlansView() {
  // Stan danych
  const [plans, setPlans] = useState<PlanSummaryViewModel[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stan filtrów
  const [filters, setFilters] = useState<PlansViewFilterState>({
    page: 1,
    limit: 10,
  });
  
  // Stan dialogu usuwania
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{id: string; name: string} | null>(null);
  
  // Metody do pobierania, filtrowania, usuwania planów...
  
  return {
    plans,
    pagination,
    isLoading,
    error,
    filters,
    deleteDialogOpen,
    planToDelete,
    // Metody do obsługi akcji...
  };
}
```

### usePlanOfflineStatus
```typescript
function usePlanOfflineStatus(planId: string) {
  const [isAvailableOffline, setIsAvailableOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Metody pobierania i aktualizacji statusu offline...
  
  return {
    isAvailableOffline,
    isLoading,
    error,
    toggleOfflineAvailability,
  };
}
```

## 7. Integracja API

### Pobieranie listy planów
- Endpoint: `GET /api/plans`
- Parametry zapytania:
  - `page`: numer strony (domyślnie: 1)
  - `limit`: liczba elementów na stronie (domyślnie: 10)
  - `guide_id`: filtrowanie po przewodniku (opcjonalne)
  - `is_favorite`: filtrowanie ulubionych (opcjonalne)
- Odpowiedź:
  - Obiekt zawierający tablicę planów i informacje o paginacji
  - Typy odpowiedzi zgodne z `PlanListResponse` z definicji typów

### Usuwanie planu
- Endpoint: `DELETE /api/plans/:id`
- Odpowiedź:
  - Kod 204 No Content w przypadku powodzenia
  - Odpowiednie kody błędów w przypadku niepowodzenia

### Pobieranie/aktualizacja statusu offline
- Endpoint: `GET /api/plans/:id/offline`
- Endpoint: `PUT /api/plans/:id/offline`
  - Body: `{ is_cached: boolean }`
- Odpowiedź:
  - Obiekt zawierający status offline planu
  - Typy zgodne z `OfflineCacheStatusDto`

## 8. Interakcje użytkownika

1. **Przeglądanie planów**
   - Użytkownik wchodzi na ścieżkę `/plans`
   - System wyświetla listę wszystkich planów użytkownika z paginacją
   
2. **Filtrowanie planów**
   - Użytkownik wybiera opcje filtrowania (ulubione)
   - System aktualizuje listę wyświetlanych planów zgodnie z filtrami
   
3. **Wyświetlanie szczegółów planu**
   - Użytkownik klika przycisk "Wyświetl" na karcie planu
   - System przekierowuje użytkownika do szczegółów planu (`/plans/:id`)
   
4. **Usuwanie planu**
   - Użytkownik klika przycisk "Usuń" na karcie planu
   - System wyświetla dialog potwierdzenia
   - Po potwierdzeniu, plan jest usuwany z bazy danych i z widoku
   
5. **Oznaczanie planu do dostępu offline**
   - Użytkownik klika przycisk "Dostęp offline" na karcie planu
   - System aktualizuje status offline planu i wizualnie oznacza kartę

## 9. Warunki i walidacja

1. **Walidacja filtrów**
   - Filtr `is_favorite` może przyjmować tylko wartości boolean
   - Filtr `guide_id` musi być prawidłowym UUID
   - Parametry paginacji muszą być poprawnymi liczbami całkowitymi
   
2. **Walidacja autentykacji**
   - Dostęp do listy planów wymaga autentykacji
   - Nieautoryzowany dostęp przekierowuje do strony logowania
   
3. **Walidacja operacji na planach**
   - Użytkownik może zarządzać tylko własnymi planami
   - Operacje na nieistniejących planach zwracają odpowiednie błędy

## 10. Obsługa błędów

1. **Błędy pobierania danych**
   - Wyświetlenie komunikatu o błędzie z opcją ponowienia próby
   - Obsługa błędów sieciowych, przekroczenia limitu czasu, błędów serwera
   
2. **Błędy autentykacji**
   - Przekierowanie do strony logowania z odpowiednim komunikatem
   
3. **Błędy operacji**
   - Wyświetlenie powiadomienia o błędzie z opisem problemu
   - Możliwość ponowienia operacji
   
4. **Brak wyników**
   - Wyświetlenie przyjaznego komunikatu gdy lista planów jest pusta
   - Różne komunikaty dla braku planów ogólnie i braku wyników filtrowania

## 11. Kroki implementacji

1. **Utworzenie widoku Astro**
   - Stworzenie pliku `src/pages/plans/index.astro`
   - Importowanie i renderowanie głównego komponentu React

2. **Implementacja komponentów React**
   - Utworzenie głównego komponentu `PlansView`
   - Implementacja hooków zarządzających stanem i komunikacją z API
   - Implementacja pozostałych komponentów w kolejności od podstawowych do złożonych

3. **Integracja z API**
   - Stworzenie funkcji fetch do pobierania i modyfikacji planów
   - Integracja z endpointami, obsługa odpowiedzi i błędów

4. **Stylizacja komponentów**
   - Wykorzystanie komponentów Shadcn/UI
   - Dostosowanie stylów do designu aplikacji
   - Zapewnienie responsywności widoku

5. **Implementacja filtrowania i paginacji**
   - Dodanie logiki do filtrowania planów
   - Implementacja mechanizmu paginacji
   
6. **Obsługa funkcji offline**
   - Implementacja mechanizmu synchronizacji z pamięcią lokalną
   - Wizualizacja statusu dostępności offline

7. **Testowanie i poprawki**
   - Testowanie widoku na różnych urządzeniach i rozdzielczościach
   - Implementacja obsługi przypadków brzegowych i błędów 