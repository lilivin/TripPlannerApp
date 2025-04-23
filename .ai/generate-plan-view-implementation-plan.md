# Plan implementacji widoku "Generowanie planu"

## 1. Przegląd
Widok "Generowanie planu" umożliwia użytkownikom tworzenie spersonalizowanych harmonogramów wycieczek na podstawie wybranego przewodnika. Użytkownik może zdefiniować różne parametry, takie jak liczba dni, godziny zwiedzania, preferencje dotyczące atrakcji oraz środki transportu. System wykorzystuje API OpenAI do generowania optymalnego planu zwiedzania, który następnie jest prezentowany użytkownikowi.

## 2. Routing widoku
Widok dostępny pod ścieżką: `/guides/{id}/generate`, gdzie `{id}` to identyfikator UUID przewodnika.

## 3. Struktura komponentów
```
GuideGeneratePlanView
├── GuideSummaryCard
└── GeneratePlanForm
    ├── DaysInput
    ├── TimeRangeInput
    ├── TagsSelectInput (include)
    ├── TagsSelectInput (exclude)
    ├── TransportationModeSelect
    ├── MealsToggle
    ├── SubmitButton
    └── LoadingOverlay
```

## 4. Szczegóły komponentów

### GuideGeneratePlanView
- **Opis komponentu**: Główny kontener widoku, odpowiedzialny za pobieranie danych przewodnika i zarządzanie stanem formularza.
- **Główne elementy**: Kontener z dwoma sekcjami - informacje o przewodniku oraz formularz generowania planu.
- **Obsługiwane interakcje**: Pobieranie danych przewodnika, obsługa submitu formularza, przekierowanie po wygenerowaniu planu.
- **Obsługiwana walidacja**: Sprawdzanie czy przewodnik istnieje i czy użytkownik ma do niego dostęp.
- **Typy**: GuideDetailDto, GeneratePlanFormData
- **Propsy**: Brak (komponent routingowy)

### GuideSummaryCard
- **Opis komponentu**: Wyświetla podstawowe informacje o wybranym przewodniku.
- **Główne elementy**: Karta zawierająca tytuł, opis, lokalizację, rekomendowaną liczbę dni, zdjęcie okładkowe.
- **Obsługiwane interakcje**: Brak (komponent prezentacyjny).
- **Obsługiwana walidacja**: Brak.
- **Typy**: GuideDetailDto lub GuideMinimalDto
- **Propsy**:
  ```typescript
  {
    guide: GuideDetailDto | GuideMinimalDto;
  }
  ```

### GeneratePlanForm
- **Opis komponentu**: Główny formularz do wprowadzania parametrów generowania planu.
- **Główne elementy**: Formularz z sekcjami na różne parametry, przycisk submit, wskaźnik ładowania.
- **Obsługiwane interakcje**: Zarządzanie stanem formularza, walidacja, wysyłanie żądania, obsługa błędów.
- **Obsługiwana walidacja**:
  - Liczba dni musi być liczbą całkowitą od 1 do 30
  - Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia
  - Tagi muszą być poprawnymi identyfikatorami UUID
  - Środek transportu musi być jednym z dozwolonych wartości
- **Typy**: GeneratePlanFormData, TagDto[], GeneratePlanFormErrors
- **Propsy**:
  ```typescript
  {
    guideId: string;
    availableTags: TagDto[];
    onSubmit: (data: GeneratePlanFormData) => Promise<void>;
    isLoading: boolean;
  }
  ```

### DaysInput
- **Opis komponentu**: Input numeryczny do wyboru liczby dni trwania wycieczki.
- **Główne elementy**: Input typu number z kontrolkami +/-, etykieta, opcjonalny komunikat błędu.
- **Obsługiwane interakcje**: Zmiana wartości, zwiększanie/zmniejszanie przez przyciski.
- **Obsługiwana walidacja**: Wartość między 1 a 30, tylko liczby całkowite.
- **Typy**: number
- **Propsy**:
  ```typescript
  {
    value: number;
    onChange: (value: number) => void;
    error?: string;
    min?: number; // domyślnie 1
    max?: number; // domyślnie 30
    label?: string;
  }
  ```

### TimeRangeInput
- **Opis komponentu**: Dwa powiązane inputy czasowe do wyboru godzin rozpoczęcia i zakończenia zwiedzania.
- **Główne elementy**: Dwa inputy typu time, etykiety, opcjonalne komunikaty błędów.
- **Obsługiwane interakcje**: Zmiana wartości, walidacja zakresu.
- **Obsługiwana walidacja**: Format czasu (HH:MM), zakończenie musi być po rozpoczęciu.
- **Typy**: string (format HH:MM)
- **Propsy**:
  ```typescript
  {
    startTime: string;
    endTime: string;
    onStartTimeChange: (value: string) => void;
    onEndTimeChange: (value: string) => void;
    startError?: string;
    endError?: string;
    rangeError?: string;
  }
  ```

### TagsSelectInput
- **Opis komponentu**: Multi-select do wyboru tagów atrakcji (do uwzględnienia lub wykluczenia).
- **Główne elementy**: Select z możliwością wielokrotnego wyboru, etykieta, lista wybranych tagów z możliwością usunięcia.
- **Obsługiwane interakcje**: Dodawanie/usuwanie tagów, wyszukiwanie.
- **Obsługiwana walidacja**: Brak duplikatów.
- **Typy**: TagDto[], string[]
- **Propsy**:
  ```typescript
  {
    availableTags: TagDto[];
    selectedTagIds: string[];
    onChange: (tagIds: string[]) => void;
    label: string;
    placeholder?: string;
  }
  ```

### TransportationModeSelect
- **Opis komponentu**: Select do wyboru preferowanego środka transportu.
- **Główne elementy**: Select z predefiniowanymi opcjami, etykieta.
- **Obsługiwane interakcje**: Zmiana wybranej opcji.
- **Obsługiwana walidacja**: Wartość musi być jedną z predefiniowanych.
- **Typy**: string
- **Propsy**:
  ```typescript
  {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    label?: string;
    error?: string;
  }
  ```

### MealsToggle
- **Opis komponentu**: Przełącznik do włączania/wyłączania uwzględniania posiłków w planie.
- **Główne elementy**: Komponent Switch/Toggle, etykieta.
- **Obsługiwane interakcje**: Przełączanie między stanami.
- **Obsługiwana walidacja**: Brak.
- **Typy**: boolean
- **Propsy**:
  ```typescript
  {
    value: boolean;
    onChange: (value: boolean) => void;
    label?: string;
  }
  ```

### LoadingOverlay
- **Opis komponentu**: Nakładka wyświetlana podczas generowania planu.
- **Główne elementy**: Półprzezroczyste tło, animacja ładowania, komunikat.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak.
- **Typy**: boolean
- **Propsy**:
  ```typescript
  {
    isVisible: boolean;
    message?: string;
  }
  ```

## 5. Typy

### GeneratePlanFormData
```typescript
interface GeneratePlanFormData {
  guide_id: string;
  days: number;
  preferences: {
    include_tags: string[];
    exclude_tags: string[];
    start_time: string;
    end_time: string;
    include_meals: boolean;
    transportation_mode: string;
  };
}
```

### GeneratePlanFormErrors
```typescript
interface GeneratePlanFormErrors {
  days?: string;
  start_time?: string;
  end_time?: string;
  timeRange?: string;
  transportation_mode?: string;
  general?: string;
}
```

### TransportationMode
```typescript
type TransportationMode = 'walking' | 'public_transport' | 'car' | 'bicycle';

const TRANSPORTATION_OPTIONS = [
  { value: 'walking', label: 'Pieszo' },
  { value: 'public_transport', label: 'Komunikacja miejska' },
  { value: 'car', label: 'Samochód' },
  { value: 'bicycle', label: 'Rower' },
];
```

## 6. Zarządzanie stanem

### useGeneratePlanForm
Customowy hook zarządzający stanem formularza, walidacją i zapisem w localStorage.

```typescript
const useGeneratePlanForm = (guideId: string, availableTags: TagDto[]) => {
  // Stan formularza
  const [formData, setFormData] = useState<GeneratePlanFormData>(getInitialFormData());
  const [errors, setErrors] = useState<GeneratePlanFormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Funkcje pomocnicze
  const updateField = (field: string, value: any) => {...};
  const updatePreference = (field: string, value: any) => {...};
  const validateForm = (): boolean => {...};
  const submitForm = async (): Promise<GeneratePlanResponse | null> => {...};
  const saveToLocalStorage = () => {...};
  const loadFromLocalStorage = () => {...};
  
  // Efekty
  useEffect(() => {
    // Ładowanie zapisanego stanu z localStorage przy inicjalizacji
    loadFromLocalStorage();
  }, [guideId]);
  
  useEffect(() => {
    // Zapisywanie stanu do localStorage przy zmianach
    saveToLocalStorage();
  }, [formData]);
  
  return {
    formData,
    errors,
    isLoading,
    updateField,
    updatePreference,
    validateForm,
    submitForm
  };
};
```

## 7. Integracja API

### Pobieranie szczegółów przewodnika
```typescript
const fetchGuideDetails = async (guideId: string): Promise<GuideDetailDto | null> => {
  try {
    const response = await fetch(`/api/guides/${guideId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Błąd podczas pobierania danych przewodnika:', error);
    return null;
  }
};
```

### Pobieranie dostępnych tagów
```typescript
const fetchTags = async (): Promise<TagDto[]> => {
  try {
    const response = await fetch('/api/tags');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data; // Zgodnie z TagListResponse
  } catch (error) {
    console.error('Błąd podczas pobierania tagów:', error);
    return [];
  }
};
```

### Wysyłanie żądania generowania planu
```typescript
const generatePlan = async (data: GeneratePlanFormData): Promise<GeneratePlanResponse | null> => {
  try {
    const response = await fetch('/api/plans/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Błąd podczas generowania planu:', error);
    return null;
  }
};
```

## 8. Interakcje użytkownika

### Wypełnianie formularza
1. Użytkownik określa liczbę dni trwania wycieczki
2. Wybiera godziny rozpoczęcia i zakończenia zwiedzania każdego dnia
3. Opcjonalnie wybiera tagi atrakcji do uwzględnienia lub wykluczenia
4. Wybiera preferowany środek transportu
5. Decyduje czy uwzględniać posiłki w planie
6. Klika przycisk "Generuj plan"

### Podczas generowania planu
1. System waliduje formularz
2. Jeśli walidacja przechodzi pomyślnie:
   - Wyświetla nakładkę LoadingOverlay
   - Wysyła żądanie do API
   - Po otrzymaniu odpowiedzi przekierowuje do widoku planu
3. Jeśli walidacja nie przechodzi:
   - Wyświetla komunikaty błędów przy odpowiednich polach
   - Umożliwia poprawienie danych

### Zapisywanie stanu formularza
1. System automatycznie zapisuje stan formularza w localStorage przy każdej zmianie
2. Przy ponownym otwarciu formularza dla tego samego przewodnika, dane są odtwarzane

## 9. Warunki i walidacja

### Walidacja liczby dni
- Pole musi zawierać liczbę całkowitą
- Wartość musi być większa lub równa 1
- Wartość musi być mniejsza lub równa 30
- Walidacja jest przeprowadzana w komponencie DaysInput oraz w hook'u useGeneratePlanForm

### Walidacja godzin zwiedzania
- Godzina musi być w formacie HH:MM
- Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia
- Walidacja jest przeprowadzana w komponencie TimeRangeInput oraz w hook'u useGeneratePlanForm

### Walidacja tagów
- Wartości muszą być poprawnymi UUID
- Tagi wybrane do uwzględnienia nie mogą występować na liście tagów do wykluczenia
- Walidacja jest przeprowadzana w komponencie TagsSelectInput oraz w hook'u useGeneratePlanForm

### Walidacja środka transportu
- Wartość musi być jedną z predefiniowanych opcji
- Walidacja jest przeprowadzana w komponencie TransportationModeSelect oraz w hook'u useGeneratePlanForm

## 10. Obsługa błędów

### Błędy formularza
- Każdy błąd walidacji jest wyświetlany przy odpowiednim polu
- Przycisk "Generuj plan" jest aktywny tylko gdy formularz jest poprawny
- System wyświetla ogólny komunikat błędu w przypadku niepowodzenia walidacji na poziomie formularza

### Błędy API
- 400 Bad Request: Wyświetlenie szczegółowych komunikatów błędów z API
- 401 Unauthorized: Przekierowanie do strony logowania
- 404 Not Found: Wyświetlenie komunikatu o braku dostępu do przewodnika
- 500 Internal Server Error: Wyświetlenie komunikatu o błędzie serwera z możliwością ponowienia próby
- Timeout: Wykrywanie zbyt długiego oczekiwania i wyświetlanie odpowiedniego komunikatu

### Błędy połączenia
- Wykrywanie utraty połączenia podczas generowania planu
- Zapisywanie parametrów lokalnie i umożliwienie ponowienia po przywróceniu połączenia

## 11. Kroki implementacji

1. **Przygotowanie typów i interfejsów**
   - Zdefiniowanie interfejsów GeneratePlanFormData, GeneratePlanFormErrors
   - Zdefiniowanie typu TransportationMode i stałej TRANSPORTATION_OPTIONS

2. **Implementacja customowego hook'a useGeneratePlanForm**
   - Zarządzanie stanem formularza
   - Implementacja walidacji
   - Integracja z localStorage
   - Obsługa wysyłania żądania

3. **Implementacja komponentów bazowych**
   - DaysInput
   - TimeRangeInput
   - TagsSelectInput
   - TransportationModeSelect
   - MealsToggle
   - LoadingOverlay

4. **Implementacja komponentu GeneratePlanForm**
   - Złożenie komponentów bazowych
   - Podłączenie hook'a useGeneratePlanForm
   - Obsługa walidacji
   - Obsługa submitu

5. **Implementacja komponentu GuideSummaryCard**
   - Wyświetlanie podstawowych informacji o przewodniku

6. **Implementacja głównego widoku GuideGeneratePlanView**
   - Pobieranie danych przewodnika
   - Pobieranie dostępnych tagów
   - Przekazanie propów do komponentów potomnych
   - Obsługa routingu i przekierowania po wygenerowaniu planu

7. **Testowanie**
   - Sprawdzenie poprawności renderowania komponentów
   - Testowanie walidacji formularza
   - Testowanie integracji z API
   - Testowanie obsługi błędów

8. **Optymalizacja i dostępność**
   - Dodanie aria-labels dla dostępności
   - Optymalizacja kolejności tabulacji
   - Testowanie na różnych urządzeniach 