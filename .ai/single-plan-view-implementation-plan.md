# Plan implementacji widoku szczegółów planu podróży

## 1. Przegląd
Widok szczegółów planu umożliwia użytkownikowi przeglądanie zapisanego planu podróży z podziałem na dni i atrakcje. Głównym celem jest prezentacja kompleksowego harmonogramu wycieczki w formie listy lub mapy, z możliwością modyfikacji, edycji i zapisywania planów do trybu offline.

## 2. Routing widoku
- **Ścieżka:** `/plans/{id}`
- **Parametry URL:** `id` - identyfikator UUID planu

## 3. Struktura komponentów
```
SinglePlanView
├── PlanHeader
│   ├── PlanTitle
│   └── GuideInfo
├── PlanActions
│   ├── ViewToggleButton
│   ├── OfflineModeToggle
│   └── EditButton
├── PlanViewToggle
│   ├── PlanDayList (widok listy)
│   │   ├── PlanDayItem (dla każdego dnia)
│   │   │   └── PlanAttractionItem (dla każdej atrakcji)
│   │   └── PlanMapView (widok mapy)
│   └── EditPlanDialog
```

## 4. Szczegóły komponentów

### SinglePlanView
- **Opis komponentu:** Główny komponent widoku, odpowiedzialny za pobieranie danych planu i zarządzanie stanem.
- **Główne elementy:** Container z nagłówkiem, przyciskami akcji i treścią planu (lista/mapa).
- **Obsługiwane interakcje:** Przełączanie między widokami listy i mapy, edycja planu, zapisywanie do trybu offline.
- **Obsługiwana walidacja:** Sprawdzanie poprawności danych planu, obsługa przypadków braku danych.
- **Typy:** PlanDetailDto, PlanDayViewModel[], GeolocationDto
- **Propsy:** planId (z parametrów routingu)

### PlanHeader
- **Opis komponentu:** Wyświetla tytuł planu, informacje o powiązanym przewodniku i podstawowe statystyki.
- **Główne elementy:** Nagłówek z tytułem planu, nazwa lokalizacji, liczba dni, dane przewodnika.
- **Obsługiwane interakcje:** N/A
- **Typy:** PlanDetailDto
- **Propsy:** plan: PlanDetailDto

### PlanActions
- **Opis komponentu:** Zestaw przycisków do zarządzania planem.
- **Główne elementy:** Przyciski do przełączania widoku, edycji planu, przycisk trybu offline.
- **Obsługiwane interakcje:** Kliknięcia przycisków: edycja, widok listy/mapy, tryb offline.
- **Typy:** N/A
- **Propsy:** 
  - onViewToggle: () => void
  - onEdit: () => void
  - onOfflineToggle: () => void
  - isListView: boolean
  - isOfflineAvailable: boolean

### PlanViewToggle
- **Opis komponentu:** Kontener, który przełącza się między widokiem listy a widokiem mapy.
- **Główne elementy:** Conditional rendering dla PlanDayList lub PlanMapView.
- **Obsługiwane interakcje:** N/A
- **Typy:** PlanDayViewModel[]
- **Propsy:** 
  - planDays: PlanDayViewModel[]
  - isListView: boolean
  - onAttractionChange: (dayId: string, attractions: PlanAttractionViewModel[]) => void
  - onAttractionRemove: (dayId: string, attractionId: string) => void
  - onNoteChange: (dayId: string, attractionId: string, note: string) => void

### PlanDayList
- **Opis komponentu:** Wyświetla listę dni z harmonogramem planu.
- **Główne elementy:** Lista dni w formie accordion lub tabs.
- **Obsługiwane interakcje:** Rozwijanie/zwijanie dni, interakcje z poszczególnymi atrakcjami.
- **Typy:** PlanDayViewModel[]
- **Propsy:** 
  - planDays: PlanDayViewModel[]
  - onAttractionChange: (dayId: string, attractions: PlanAttractionViewModel[]) => void
  - onAttractionRemove: (dayId: string, attractionId: string) => void
  - onNoteChange: (dayId: string, attractionId: string, note: string) => void

### PlanDayItem
- **Opis komponentu:** Reprezentuje pojedynczy dzień planu.
- **Główne elementy:** Nagłówek dnia, lista atrakcji (PlanAttractionItem).
- **Obsługiwane interakcje:** Drag & drop atrakcji, usuwanie atrakcji.
- **Typy:** PlanDayViewModel
- **Propsy:** 
  - day: PlanDayViewModel
  - onAttractionChange: (attractions: PlanAttractionViewModel[]) => void
  - onAttractionRemove: (attractionId: string) => void
  - onNoteChange: (attractionId: string, note: string) => void

### PlanAttractionItem
- **Opis komponentu:** Wyświetla informacje o pojedynczej atrakcji.
- **Główne elementy:** Nazwa, opis, czas odwiedzin, adres, notatka, akcje.
- **Obsługiwane interakcje:** Edycja notatki, usuwanie atrakcji.
- **Typy:** PlanAttractionViewModel
- **Propsy:** 
  - attraction: PlanAttractionViewModel
  - onRemove: () => void
  - onNoteChange: (note: string) => void

### PlanMapView
- **Opis komponentu:** Wyświetla plan w formie interaktywnej mapy.
- **Główne elementy:** Mapa z markerami atrakcji, linie tras dla poszczególnych dni.
- **Obsługiwane interakcje:** Kliknięcie markerów, przybliżanie/oddalanie.
- **Typy:** PlanDayViewModel[], GeolocationDto
- **Propsy:** 
  - planDays: PlanDayViewModel[]
  - onMarkerClick: (attractionId: string) => void

### EditPlanDialog
- **Opis komponentu:** Dialog do edycji nazwy planu i oznaczenia jako ulubionego.
- **Główne elementy:** Formularz z polem nazwy i checkbox do oznaczenia jako ulubiony.
- **Obsługiwane interakcje:** Zmiana nazwy, zmiana stanu ulubiony, zapisanie zmian.
- **Obsługiwana walidacja:** Sprawdzanie długości nazwy (min. 3 znaki).
- **Typy:** UpdatePlanCommand
- **Propsy:** 
  - isOpen: boolean
  - onClose: () => void
  - onSave: (data: UpdatePlanCommand) => void
  - initialData: { name: string, is_favorite: boolean }

## 5. Typy
W oparciu o obecne typy z systemu oraz specyficzne potrzeby tego widoku, wymagane będą:

### Istniejące typy systemowe:
- `PlanDetailDto` - pełne dane planu podróży
- `GeolocationDto` - dane geolokalizacyjne
- `UpdatePlanCommand` - dane do aktualizacji planu
- `OfflineCacheStatusDto` - status zapisania planu w trybie offline

### Nowe typy ViewModeli:
```typescript
/**
 * Plan day view model
 */
export interface PlanDayViewModel {
  id: string;
  date: string;
  dayNumber: number;
  attractions: PlanAttractionViewModel[];
}

/**
 * Plan attraction view model
 */
export interface PlanAttractionViewModel {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  visitDuration: number;
  address: string;
  geolocation?: GeolocationDto;
  imageUrl?: string;
  note: string;
  transportToNext?: {
    mode: string;
    duration: number;
    description?: string;
  };
}

/**
 * Plan view model
 */
export interface PlanViewModel {
  id: string;
  name: string;
  guide: GuideMinimalDto;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  planDays: PlanDayViewModel[];
  generationParams: {
    days: number;
    preferences: {
      start_time?: string;
      end_time?: string;
      include_meals?: boolean;
      transportation_mode?: string;
      include_tags?: string[];
      exclude_tags?: string[];
    };
  };
}
```

## 6. Zarządzanie stanem
Potrzebne będą następujące hooki i zarządzanie stanem:

### useSinglePlan
Hook do pobierania i obsługi danych planu:
```typescript
function useSinglePlan(planId: string) {
  const [plan, setPlan] = useState<PlanViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isListView, setIsListView] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Logika do pobierania planu, mapowania na viewmodel i obsługi błędów
  
  // Funkcje do edycji planu, modyfikacji atrakcji itp.
  
  return {
    plan,
    isLoading,
    error,
    isListView,
    editDialogOpen,
    setIsListView,
    setEditDialogOpen,
    handleAttractionOrderChange,
    handleAttractionRemove,
    handleNoteChange,
    handleEditPlan,
  };
}
```

### usePlanOfflineSync
Hook do zarządzania dostępnością planu offline:
```typescript
function usePlanOfflineSync(planId: string) {
  const [isAvailableOffline, setIsAvailableOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Funkcje do sprawdzania i aktualizacji statusu offline
  
  return {
    isAvailableOffline,
    isLoading,
    error,
    toggleOfflineAvailability,
  };
}
```

## 7. Integracja API
Widok będzie korzystał z następujących endpointów API:

### GET /api/plans/{id}
- **Opis:** Pobieranie szczegółów planu podróży
- **Parametry URL:** `id` - identyfikator planu (UUID)
- **Typ odpowiedzi:** `PlanDetailDto`
- **Kody odpowiedzi:** 200 OK, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

### PUT /api/plans/{id}
- **Opis:** Aktualizacja planu podróży
- **Parametry URL:** `id` - identyfikator planu (UUID)
- **Typ żądania:** `UpdatePlanCommand`
- **Typ odpowiedzi:** `PlanDetailDto`
- **Kody odpowiedzi:** 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

### GET /api/plans/{id}/offline
- **Opis:** Sprawdzanie statusu planu w trybie offline
- **Parametry URL:** `id` - identyfikator planu (UUID)
- **Typ odpowiedzi:** `OfflineCacheStatusDto`
- **Kody odpowiedzi:** 200 OK, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

### PUT /api/plans/{id}/offline
- **Opis:** Aktualizacja statusu planu w trybie offline
- **Parametry URL:** `id` - identyfikator planu (UUID)
- **Typ żądania:** `UpdateOfflineCacheStatusCommand`
- **Typ odpowiedzi:** `OfflineCacheStatusDto`
- **Kody odpowiedzi:** 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

## 8. Interakcje użytkownika
Widok obsługuje następujące interakcje użytkownika:

1. **Przełączanie widoku listy/mapy**
   - Kliknięcie przycisku "List View" / "Map View" przełącza między widokami
   - W widoku listy można rozwijać/zwijać poszczególne dni
   - W widoku mapy można klikać markery, aby zobaczyć informacje o atrakcjach

2. **Edycja planu**
   - Kliknięcie przycisku "Edit" otwiera dialog edycji
   - W dialogu można zmienić nazwę planu i oznaczyć go jako ulubiony
   - Po zapisaniu, zmiany są przesyłane do API i aktualizowane w UI

3. **Zarządzanie atrakcjami w planie**
   - Zmiana kolejności atrakcji za pomocą drag & drop
   - Usuwanie atrakcji z planu
   - Dodawanie/edycja notatek do atrakcji

4. **Tryb offline**
   - Przełącznik do zapisywania planu do trybu offline
   - Po włączeniu, dane planu są cache'owane w przeglądarce
   - Wskaźnik statusu synchronizacji planu

## 9. Warunki i walidacja
Widok obsługuje następujące warunki i walidacje:

1. **Walidacja dostępu do planu**
   - Jeśli użytkownik nie ma uprawnień do planu (403) lub plan nie istnieje (404), wyświetlany jest odpowiedni komunikat
   - Jeśli wystąpi błąd serwera (500), wyświetlany jest komunikat o błędzie

2. **Walidacja edycji planu**
   - Nazwa planu musi mieć minimalną długość 3 znaków
   - Pola formularza są walidowane przed wysłaniem

3. **Walidacja trybu offline**
   - Sprawdzanie, czy przeglądarka wspiera funkcje PWA i Service Worker
   - Wskaźnik dostępności planu offline jest aktualizowany w oparciu o rzeczywisty stan cache

4. **Walidacja geolokalizacji atrakcji**
   - Sprawdzanie, czy atrakcje mają poprawne dane geolokalizacyjne
   - Wyświetlanie ostrzeżenia, jeśli niektóre atrakcje nie mają lokalizacji

## 10. Obsługa błędów
Widok obsługuje następujące przypadki błędów:

1. **Błędy API**
   - 401 Unauthorized: Przekierowanie do strony logowania
   - 403 Forbidden: Komunikat o braku dostępu do planu
   - 404 Not Found: Komunikat o nieistniejącym planie
   - 500 Internal Server Error: Ogólny komunikat błędu

2. **Błędy walidacji**
   - Błędy walidacji formularza są wyświetlane obok odpowiednich pól
   - Ogólne błędy walidacji są wyświetlane na górze formularza

3. **Błędy trybu offline**
   - Jeśli przeglądarka nie wspiera funkcji PWA, wyświetlany jest odpowiedni komunikat
   - Błędy synchronizacji są obsługiwane, z możliwością ponownej próby

4. **Błędy mapowania danych**
   - Zabezpieczenia przed brakiem lub nieprawidłowymi danymi w odpowiedzi API
   - Domyślne wartości dla pól, które mogą być undefined

## 11. Kroki implementacji
1. **Przygotowanie struktury plików**
   - Utworzenie pliku strony `/src/pages/plans/[id].astro`
   - Utworzenie komponentów w `/src/components/plan-details/`

2. **Implementacja widoku strony**
   - Utworzenie głównego komponentu `SinglePlanView.tsx`
   - Dodanie potrzebnych importów

3. **Implementacja komponentów pomocniczych**
   - Implementacja PlanHeader
   - Implementacja PlanActions
   - Implementacja PlanViewToggle
   - Integracja PlanDayList i PlanMapView

4. **Implementacja hooków**
   - Utworzenie useSinglePlan
   - Utworzenie usePlanOfflineSync

5. **Implementacja dialogu edycji**
   - Utworzenie EditPlanDialog
   - Dodanie walidacji formularza

6. **Integracja z API**
   - Dodanie obsługi pobierania danych planu
   - Dodanie obsługi aktualizacji planu
   - Dodanie obsługi statusu offline

7. **Testowanie**
   - Testowanie różnych przypadków użycia
   - Obsługa błędów i przypadków brzegowych

8. **Finalizacja**
   - Dodanie dokumentacji
   - Optymalizacja wydajności
   - Code review 