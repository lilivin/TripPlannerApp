# Plan implementacji widoku podglądu wygenerowanego planu

## 1. Przegląd
Widok podglądu wygenerowanego planu pozwala użytkownikowi na przejrzenie i edycję planu wycieczki wygenerowanego przez AI przed jego zapisaniem. Użytkownik może modyfikować kolejność atrakcji, usuwać je, dodawać notatki oraz przeglądać plan na mapie. Widok ten jest kluczowym elementem procesu planowania wycieczki, dającym użytkownikowi kontrolę nad finalnym kształtem planu.

## 2. Routing widoku
Ścieżka: `/guides/{id}/generate/preview`

Komponent będzie dostępny po wygenerowaniu planu przez API i będzie wyświetlał dane wygenerowanego planu przechowywane tymczasowo w stanie aplikacji (lub lokalnie w localStorage).

## 3. Struktura komponentów
```
PlanPreviewPage
├── PlanPreviewHeader
├── PlanPreviewActions
├── PlanPreviewView
│   ├── PlanDayList
│   │   └── PlanDayItem
│   │       └── PlanAttractionItem
│   │           ├── AttractionActions
│   │           └── AttractionNotes
│   └── PlanMapView
└── PlanSaveDialog
```

## 4. Szczegóły komponentów

### PlanPreviewPage
- Opis komponentu: Główny kontener dla widoku podglądu planu, zarządza stanem całego widoku
- Główne elementy: Layout zawierający nagłówek, przyciski akcji, widok planu i modalne okno zapisu
- Obsługiwane interakcje: Inicjalizacja danych z API, przełączanie między widokiem listy i mapy
- Obsługiwana walidacja: Sprawdzanie czy plan zawiera przynajmniej jedną atrakcję
- Typy: `GeneratedPlanViewModel`, `PlanDayViewModel`
- Propsy: N/A (komponent główny)

### PlanPreviewHeader
- Opis komponentu: Wyświetla informacje o przewodniku i podstawowe parametry wygenerowanego planu
- Główne elementy: Tytuł przewodnika, lokalizacja, liczba dni, parametry generowania
- Obsługiwane interakcje: N/A (komponent informacyjny)
- Obsługiwana walidacja: N/A
- Typy: `GuideMinimalDto`, `PlanGenerationParams`
- Propsy: `guide: GuideMinimalDto, generationParams: PlanGenerationParams`

### PlanPreviewActions
- Opis komponentu: Pasek przycisków akcji dla planu
- Główne elementy: Przyciski zapisu, modyfikacji parametrów, przełączania widoku
- Obsługiwane interakcje: Kliknięcia na przyciski akcji, wywoływanie odpowiednich funkcji
- Obsługiwana walidacja: Blokowanie zapisu jeśli plan jest pusty
- Typy: N/A
- Propsy: `onSave: () => void, onRegenerateClick: () => void, onModifyParams: () => void, onViewToggle: () => void, isListView: boolean, canSave: boolean`

### PlanPreviewView
- Opis komponentu: Kontener widoku planu, przełączający między widokiem listy i mapy
- Główne elementy: PlanDayList lub PlanMapView zależnie od wybranego widoku
- Obsługiwane interakcje: Przełączanie między widokami
- Obsługiwana walidacja: N/A
- Typy: `PlanDayViewModel[]`
- Propsy: `planDays: PlanDayViewModel[], isListView: boolean, onAttractionChange: (dayId: string, attractions: PlanAttractionViewModel[]) => void, onAttractionRemove: (dayId: string, attractionId: string) => void, onNoteChange: (dayId: string, attractionId: string, note: string) => void`

### PlanDayList
- Opis komponentu: Lista dni planu z ich atrakcjami
- Główne elementy: Lista PlanDayItem
- Obsługiwane interakcje: N/A (kontener)
- Obsługiwana walidacja: N/A
- Typy: `PlanDayViewModel[]`
- Propsy: `planDays: PlanDayViewModel[], onAttractionChange: (dayId: string, attractions: PlanAttractionViewModel[]) => void, onAttractionRemove: (dayId: string, attractionId: string) => void, onNoteChange: (dayId: string, attractionId: string, note: string) => void`

### PlanDayItem
- Opis komponentu: Widok pojedynczego dnia z listą atrakcji
- Główne elementy: Nagłówek dnia (dzień, data), lista atrakcji z możliwością drag & drop
- Obsługiwane interakcje: Przeciąganie i upuszczanie atrakcji (DnD)
- Obsługiwana walidacja: N/A
- Typy: `PlanDayViewModel`
- Propsy: `day: PlanDayViewModel, onAttractionChange: (attractions: PlanAttractionViewModel[]) => void, onAttractionRemove: (attractionId: string) => void, onNoteChange: (attractionId: string, note: string) => void`

### PlanAttractionItem
- Opis komponentu: Widok pojedynczej atrakcji w planie dnia
- Główne elementy: Informacje o atrakcji (nazwa, czas zwiedzania, godziny, adres), akcje, notatki
- Obsługiwane interakcje: Usuwanie, dodawanie/edycja notatek, drag (dla DnD)
- Obsługiwana walidacja: N/A
- Typy: `PlanAttractionViewModel`
- Propsy: `attraction: PlanAttractionViewModel, onRemove: () => void, onNoteChange: (note: string) => void, dragHandleProps: any`

### AttractionActions
- Opis komponentu: Przyciski akcji dla atrakcji
- Główne elementy: Przyciski do usuwania, edycji notatek
- Obsługiwane interakcje: Kliknięcia przycisków
- Obsługiwana walidacja: N/A
- Typy: N/A
- Propsy: `onRemove: () => void, onEditNote: () => void`

### AttractionNotes
- Opis komponentu: Formularz i widok notatek do atrakcji
- Główne elementy: Pole tekstowe notatki, przycisk zapisu
- Obsługiwane interakcje: Edycja tekstu, zapisywanie zmian
- Obsługiwana walidacja: Maksymalna długość notatki (np. 500 znaków)
- Typy: N/A
- Propsy: `note: string, onNoteChange: (note: string) => void, isEditing: boolean, onEditingToggle: () => void`

### PlanMapView
- Opis komponentu: Widok mapy z zaznaczonymi atrakcjami planu, zgrupowanymi po dniach
- Główne elementy: Interaktywna mapa (Leaflet), markery atrakcji, linie trasy
- Obsługiwane interakcje: Przesuwanie i przybliżanie mapy, klikanie w markery
- Obsługiwana walidacja: Sprawdzanie czy wszystkie atrakcje mają geolokalizację
- Typy: `PlanDayViewModel[]`
- Propsy: `planDays: PlanDayViewModel[], onMarkerClick: (attractionId: string) => void`

### PlanSaveDialog
- Opis komponentu: Modalne okno do zapisywania planu
- Główne elementy: Formularz z nazwą planu, opcjami i przyciskiem zapisu
- Obsługiwane interakcje: Wprowadzanie nazwy, zaznaczanie opcji, zapis
- Obsługiwana walidacja: Wymagana nazwa planu (min. 3 znaki)
- Typy: `SavePlanFormData`
- Propsy: `isOpen: boolean, onClose: () => void, onSave: (formData: SavePlanFormData) => void`

## 5. Typy

```typescript
// ViewModel do prezentacji wygenerowanego planu
interface GeneratedPlanViewModel {
  guide: GuideMinimalDto;
  generationParams: PlanGenerationParams;
  planDays: PlanDayViewModel[];
  aiGenerationCost: number | null;
}

// Parametry generowania planu
interface PlanGenerationParams {
  days: number;
  preferences: {
    include_tags?: string[];
    exclude_tags?: string[];
    start_time?: string;
    end_time?: string;
    include_meals?: boolean;
    transportation_mode?: string;
  };
}

// Dzień planu
interface PlanDayViewModel {
  id: string;
  date: string;
  dayNumber: number;
  attractions: PlanAttractionViewModel[];
}

// Atrakcja w planie
interface PlanAttractionViewModel {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  visitDuration: number; // w minutach
  address: string;
  geolocation?: GeolocationDto;
  imageUrl?: string;
  note: string;
  transportToNext?: TransportInfoViewModel;
}

// Informacje o transporcie między atrakcjami
interface TransportInfoViewModel {
  mode: string;
  duration: number; // w minutach
  description?: string;
}

// Dane formularza zapisu planu
interface SavePlanFormData {
  name: string;
  isFavorite: boolean;
}
```

## 6. Zarządzanie stanem

Do zarządzania stanem widoku potrzebny będzie custom hook `usePlanPreview`:

```typescript
function usePlanPreview(guideId: string, generationResponse: GeneratePlanResponse) {
  // Stan planu
  const [planViewModel, setPlanViewModel] = useState<GeneratedPlanViewModel | null>(null);
  const [isListView, setIsListView] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Inicjalizacja danych
  useEffect(() => {
    // Konwersja danych z API do modelu widoku
    // ...
  }, [guideId, generationResponse]);
  
  // Funkcje do modyfikacji planu
  const handleAttractionOrderChange = (dayId: string, attractions: PlanAttractionViewModel[]) => {
    // Aktualizacja kolejności atrakcji
    // ...
  };
  
  const handleAttractionRemove = (dayId: string, attractionId: string) => {
    // Usuwanie atrakcji
    // ...
  };
  
  const handleNoteChange = (dayId: string, attractionId: string, note: string) => {
    // Aktualizacja notatki
    // ...
  };
  
  const handleSave = async (formData: SavePlanFormData) => {
    // Zapisywanie planu w API
    // ...
  };
  
  // Przechowywanie tymczasowe w localStorage
  useEffect(() => {
    // Zapisywanie stanu do localStorage przy zmianach
    // ...
  }, [planViewModel]);
  
  return {
    planViewModel,
    isListView,
    error,
    isSaving,
    saveDialogOpen,
    setIsListView,
    setSaveDialogOpen,
    handleAttractionOrderChange,
    handleAttractionRemove,
    handleNoteChange,
    handleSave,
  };
}
```

## 7. Integracja API

Integracja z API będzie obejmować dwa główne endpointy:

1. `POST /api/plans/generate` - do generowania planu:
   ```typescript
   const generatePlan = async (command: GeneratePlanCommand): Promise<GeneratePlanResponse> => {
     const response = await fetch('/api/plans/generate', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(command),
     });
     
     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.error || 'Błąd generowania planu');
     }
     
     return response.json();
   };
   ```

2. `POST /api/plans` - do zapisywania planu:
   ```typescript
   const savePlan = async (command: CreatePlanCommand): Promise<string> => {
     const response = await fetch('/api/plans', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(command),
     });
     
     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.error || 'Błąd zapisywania planu');
     }
     
     const data = await response.json();
     return data.id;
   };
   ```

## 8. Interakcje użytkownika

### Modyfikowanie kolejności atrakcji
1. Użytkownik chwyta atrakcję za uchwyt drag & drop
2. Przeciąga ją na nową pozycję w liście atrakcji danego dnia
3. System aktualizuje kolejność atrakcji w modelu widoku
4. Interfejs odświeża się, pokazując nową kolejność

### Usuwanie atrakcji
1. Użytkownik klika przycisk usunięcia przy atrakcji
2. System pokazuje potwierdzenie usunięcia
3. Po potwierdzeniu, atrakcja jest usuwana z modelu widoku
4. Interfejs odświeża się bez usuniętej atrakcji

### Dodawanie/edycja notatek
1. Użytkownik klika przycisk edycji notatki przy atrakcji
2. System wyświetla pole tekstowe do edycji notatki
3. Użytkownik wprowadza lub edytuje tekst notatki
4. Po zatwierdzeniu, notatka jest zapisywana w modelu widoku
5. Interfejs pokazuje zapisaną notatkę przy atrakcji

### Zapisywanie planu
1. Użytkownik klika przycisk zapisu planu
2. System wyświetla modalne okno z formularzem nazwy planu i opcjami
3. Użytkownik wprowadza nazwę i wybiera opcje
4. Po kliknięciu przycisku zapisu, plan jest wysyłany do API
5. System wyświetla potwierdzenie zapisania i przekierowuje do widoku zapisanych planów

### Przełączanie widoków (lista/mapa)
1. Użytkownik klika przycisk przełączania widoku
2. System zmienia tryb wyświetlania między listą a mapą
3. Interfejs odświeża się, pokazując wybrany widok

## 9. Warunki i walidacja

### Plan może być zapisany tylko gdy:
- Zawiera przynajmniej jedną atrakcję
- Formularz zapisu ma wypełnione wymagane pola (nazwa planu)

### Notatki do atrakcji:
- Maksymalna długość: 500 znaków
- Walidacja długości w czasie rzeczywistym z licznikiem znaków

### Walidacja dla widoku mapy:
- Sprawdzanie czy wszystkie atrakcje mają geolokalizację
- Wyświetlanie ostrzeżenia dla atrakcji bez geolokalizacji

### Walidacja danych z API:
- Sprawdzanie kompletności i poprawności danych zwróconych z API
- Obsługa sytuacji, gdy dane są niepełne lub w nieoczekiwanym formacie

## 10. Obsługa błędów

### Błędy API
- Wyświetlanie komunikatów błędów zwróconych przez API
- Możliwość ponowienia próby generowania lub zapisywania planu

### Błędy formatu danych
- Graceful fallback w przypadku niepełnych lub błędnych danych
- Pokazywanie placeholderów dla brakujących elementów (np. obrazków)

### Problemy z geolokalizacją
- Obsługa sytuacji, gdy atrakcje nie mają danych geolokalizacyjnych
- Alternatywne wyświetlanie dla atrakcji bez współrzędnych na mapie

### Utrata połączenia
- Automatyczne zapisywanie stanu do localStorage
- Możliwość kontynuowania pracy po przywróceniu połączenia
- Wyraźne informowanie użytkownika o stanie synchronizacji

### Błędy drag & drop
- Obsługa przypadków nieprawidłowego upuszczenia elementu
- Reset stanu w przypadku nieoczekiwanych problemów z funkcjonalnością DnD

## 11. Kroki implementacji

1. Utworzenie podstawowej struktury strony i routingu
   - Stworzenie głównego kontenera `PlanPreviewPage`
   - Implementacja routingu dla ścieżki `/guides/{id}/generate/preview`

2. Implementacja modeli danych i stanu komponentu
   - Definicja typów i interfejsów dla modelu widoku
   - Implementacja hooka `usePlanPreview`
   - Stworzenie funkcji mapujących dane z API do modelu widoku

3. Implementacja komponentów prezentacyjnych
   - Stworzenie komponentu `PlanPreviewHeader`
   - Implementacja komponentu `PlanPreviewActions`

4. Stworzenie widoku listy planu
   - Implementacja komponentu `PlanDayList`
   - Stworzenie komponentu `PlanDayItem`
   - Implementacja komponentu `PlanAttractionItem`
   - Dodanie obsługi drag & drop dla atrakcji (używając biblioteki dnd-kit)

5. Implementacja akcji i interakcji z atrakcjami
   - Stworzenie komponentu `AttractionActions`
   - Implementacja komponentu `AttractionNotes`
   - Dodanie obsługi usuwania i edycji notatek

6. Stworzenie widoku mapy
   - Implementacja komponentu `PlanMapView` z biblioteką Leaflet
   - Dodanie markerów atrakcji i linii łączących
   - Implementacja interakcji z mapą

7. Implementacja zapisywania planu
   - Stworzenie komponentu `PlanSaveDialog`
   - Implementacja integracji z API do zapisywania planu
   - Dodanie obsługi formularza zapisu

8. Implementacja obsługi błędów i walidacji
   - Dodanie walidacji dla formularzy
   - Implementacja obsługi błędów API
   - Stworzenie komponentów komunikatów błędów

9. Implementacja synchronizacji z localStorage
   - Dodanie zapisywania stanu do localStorage
   - Implementacja odczytywania i przywracania stanu

10. Testowanie i optymalizacja
    - Testowanie wszystkich interakcji i przypadków użycia
    - Optymalizacja wydajności renderowania komponentów
    - Upewnienie się, że interfejs jest responsywny

11. Finalizacja i dokumentacja
    - Przegląd i refaktoryzacja kodu
    - Dodanie komentarzy i dokumentacji
    - Upewnienie się, że wszystkie historyjki użytkownika są spełnione 