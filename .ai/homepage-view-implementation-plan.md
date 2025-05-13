# Plan implementacji widoku Strony Głównej

## 1. Przegląd
Strona główna aplikacji TripPlanner dostarcza różne widoki w zależności od stanu logowania użytkownika. Dla niezalogowanych użytkowników skupia się na promowaniu rejestracji i prezentacji wyróżnionych przewodników, natomiast dla zalogowanych użytkowników pokazuje spersonalizowane treści, w tym powitanie, ostatnie plany, rekomendowane przewodniki i nowości.

## 2. Routing widoku
Ścieżka: `/` (strona główna aplikacji)

## 3. Struktura komponentów
```
HomePage
├── GuestHomePage (wariant dla niezalogowanego)
│   ├── HeroSection
│   ├── FeaturedGuidesCarousel
│   ├── HowItWorksSteps
│   ├── TestimonialSlider
│   ├── BenefitsList
│   └── RegisterCTA
└── UserHomePage (wariant dla zalogowanego)
    ├── UserWelcome
    ├── RecentPlansGrid
    ├── RecommendedGuidesSlider
    ├── NewGuidesSection
    └── QuickActionsBar
```

## 4. Szczegóły komponentów

### HomePage
- Opis komponentu: Główny komponent strony, który renderuje odpowiedni wariant w zależności od stanu logowania użytkownika
- Główne elementy: Komponent warunkowy wybierający między GuestHomePage a UserHomePage
- Obsługiwane interakcje: Określenie stanu logowania i wybór odpowiedniego widoku
- Obsługiwana walidacja: Weryfikacja stanu sesji użytkownika
- Typy: Brak dodatkowych typów, komponent wykorzystuje wbudowane typy Astro i hooki autoryzacji Supabase
- Propsy: Żadne, to jest komponent główny strony

### GuestHomePage
- Opis komponentu: Wariant strony głównej dla niezalogowanych użytkowników, zachęcający do rejestracji i prezentujący wyróżnione przewodniki
- Główne elementy: HeroSection, FeaturedGuidesCarousel, HowItWorksSteps, TestimonialSlider, BenefitsList, RegisterCTA
- Obsługiwane interakcje: Przejście do rejestracji/logowania, przeglądanie wyróżnionych przewodników
- Obsługiwana walidacja: Nie dotyczy
- Typy: `HomeGuestResponse`, `FeaturedGuideDto`
- Propsy: `featuredGuides: FeaturedGuideDto[]`

### HeroSection
- Opis komponentu: Pełnoekranowy baner z hasłem promocyjnym i przyciskiem CTA
- Główne elementy: Tło, nagłówek, podtytuł, przycisk CTA
- Obsługiwane interakcje: Kliknięcie przycisku "Zarejestruj się" prowadzące do strony rejestracji
- Obsługiwana walidacja: Nie dotyczy
- Typy: Nie wymaga specjalnych typów
- Propsy: Żadne, zawiera statyczne treści marketingowe

### FeaturedGuidesCarousel
- Opis komponentu: Karuzela przewodników wyróżnionych dla niezalogowanych użytkowników
- Główne elementy: Karty przewodników, nawigacja karuzeli (strzałki, kropki)
- Obsługiwane interakcje: Przewijanie karuzeli, kliknięcie w przewodnik prowadzące do jego szczegółów
- Obsługiwana walidacja: Sprawdzenie, czy istnieją wyróżnione przewodniki do wyświetlenia
- Typy: `FeaturedGuideDto`
- Propsy: `guides: FeaturedGuideDto[]`

### HowItWorksSteps
- Opis komponentu: Wizualna prezentacja kroków korzystania z aplikacji
- Główne elementy: Sekcja z ikonami i opisami pokazującymi, jak działa aplikacja
- Obsługiwane interakcje: Brak interakcji, komponent informacyjny
- Obsługiwana walidacja: Nie dotyczy
- Typy: Własny typ `HowItWorksStep` z polami `icon`, `title`, `description`
- Propsy: `steps: HowItWorksStep[]` (statyczna lista kroków)

### TestimonialSlider
- Opis komponentu: Slider z opiniami użytkowników
- Główne elementy: Karty z recenzjami, zdjęcia użytkowników, nawigacja slidera
- Obsługiwane interakcje: Przesuwanie slidera, nawigacja między opiniami
- Obsługiwana walidacja: Nie dotyczy
- Typy: Własny typ `Testimonial` z polami `avatarUrl`, `name`, `text`, `rating`
- Propsy: `testimonials: Testimonial[]` (statyczna lista recenzji)

### BenefitsList
- Opis komponentu: Lista korzyści z posiadania konta w aplikacji
- Główne elementy: Sekcja z ikonami i opisami korzyści
- Obsługiwane interakcje: Brak interakcji, komponent informacyjny
- Obsługiwana walidacja: Nie dotyczy
- Typy: Własny typ `Benefit` z polami `icon`, `title`, `description`
- Propsy: `benefits: Benefit[]` (statyczna lista korzyści)

### RegisterCTA
- Opis komponentu: Przyciski zachęcające do rejestracji
- Główne elementy: Przyciski "Zarejestruj się" lub "Zaloguj się"
- Obsługiwane interakcje: Kliknięcie prowadzące do odpowiednich stron (/auth/signup lub /auth/login)
- Obsługiwana walidacja: Nie dotyczy
- Typy: Nie wymaga specjalnych typów
- Propsy: Opcjonalnie `variant: 'primary' | 'secondary'` do stylizacji przycisku

### UserHomePage
- Opis komponentu: Wariant strony głównej dla zalogowanych użytkowników z personalizowanymi treściami
- Główne elementy: UserWelcome, RecentPlansGrid, RecommendedGuidesSlider, NewGuidesSection, QuickActionsBar
- Obsługiwane interakcje: Nawigacja do szczegółów planów i przewodników, wykonywanie szybkich akcji
- Obsługiwana walidacja: Sprawdzenie zalogowania użytkownika
- Typy: `HomeUserResponse`, `UserGreetingDto`, `RecentPlanDto`, `RecommendedGuideDto`, `NewGuideDto`
- Propsy: `userData: HomeUserResponse`

### UserWelcome
- Opis komponentu: Personalizowane powitanie z awatarem użytkownika
- Główne elementy: Awatar, tekst powitalny, godzina dnia
- Obsługiwane interakcje: Opcjonalnie kliknięcie awatara prowadzące do profilu
- Obsługiwana walidacja: Nie dotyczy
- Typy: `UserGreetingDto`
- Propsy: `greeting: UserGreetingDto`

### RecentPlansGrid
- Opis komponentu: Siatka pokazująca ostatnio zapisane plany użytkownika
- Główne elementy: Karty planów z miniaturami, tytułami, datami i akcjami
- Obsługiwane interakcje: Kliknięcie karty prowadzące do szczegółów planu, oznaczanie jako ulubione
- Obsługiwana walidacja: Sprawdzenie, czy użytkownik ma zapisane plany
- Typy: `RecentPlanDto`
- Propsy: `plans: RecentPlanDto[]`, `onToggleFavorite: (planId: string, isFavorite: boolean) => void`

### RecommendedGuidesSlider
- Opis komponentu: Karuzela z przewodnikami rekomendowanymi dla użytkownika
- Główne elementy: Karty przewodników z informacjami, nawigacja karuzeli
- Obsługiwane interakcje: Przewijanie karuzeli, kliknięcie w przewodnik prowadzące do jego szczegółów
- Obsługiwana walidacja: Sprawdzenie, czy istnieją rekomendowane przewodniki
- Typy: `RecommendedGuideDto`
- Propsy: `guides: RecommendedGuideDto[]`

### NewGuidesSection
- Opis komponentu: Sekcja pokazująca nowo dodane przewodniki
- Główne elementy: Lista lub siatka nowych przewodników z datami dodania
- Obsługiwane interakcje: Kliknięcie w przewodnik prowadzące do jego szczegółów
- Obsługiwana walidacja: Sprawdzenie, czy istnieją nowe przewodniki
- Typy: `NewGuideDto`
- Propsy: `guides: NewGuideDto[]`

### QuickActionsBar
- Opis komponentu: Pasek z przyciskami szybkiego dostępu do głównych funkcji
- Główne elementy: Zestaw przycisków z ikonami prowadzącymi do kluczowych sekcji aplikacji
- Obsługiwane interakcje: Kliknięcie przycisków nawigujące do różnych sekcji aplikacji
- Obsługiwana walidacja: Nie dotyczy
- Typy: Własny typ `QuickAction` z polami `icon`, `label`, `path`
- Propsy: `actions: QuickAction[]` (lista akcji z ikonami i ścieżkami)

## 5. Typy
Poza typami zdefiniowanymi w głównym pliku `types.ts`, potrzebne będą dodatkowe typy dla komponentów prezentacyjnych:

```typescript
// Typy dla komponentów prezentacyjnych z danymi statycznymi
export interface HowItWorksStep {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  avatarUrl: string;
  name: string;
  text: string;
  rating: number;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface QuickAction {
  icon: string;
  label: string;
  path: string;
}

// Typy stanu dla obsługi błędów i ładowania
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface HomePageState {
  loadingState: LoadingState;
  error?: string;
  data: HomeGuestResponse | HomeUserResponse | null;
}

// Do obsługi toggle'owania ulubionych planów
export interface ToggleFavoriteState {
  isProcessing: boolean;
  error?: string;
}
```

## 6. Zarządzanie stanem
Strona główna wymaga zarządzania następującymi stanami:

### Hook `useHomePageData`
```typescript
function useHomePageData(isAuthenticated: boolean) {
  const [state, setState] = useState<HomePageState>({ 
    loadingState: 'idle', 
    data: null 
  });
  
  useEffect(() => {
    const fetchHomeData = async () => {
      setState({ ...state, loadingState: 'loading' });
      try {
        const response = await fetch('/api/home');
        
        if (!response.ok) {
          throw new Error('Błąd pobierania danych strony głównej');
        }
        
        const data = await response.json();
        setState({ loadingState: 'success', data });
      } catch (error) {
        setState({ 
          loadingState: 'error', 
          error: error instanceof Error ? error.message : 'Nieznany błąd',
          data: null 
        });
      }
    };
    
    fetchHomeData();
  }, [isAuthenticated]);
  
  return state;
}
```

### Hook `useToggleFavoritePlan`
```typescript
function useToggleFavoritePlan() {
  const [state, setState] = useState<{ [planId: string]: ToggleFavoriteState }>({});
  
  const toggleFavorite = async (planId: string, isFavorite: boolean) => {
    setState({ 
      ...state, 
      [planId]: { isProcessing: true } 
    });
    
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_favorite: isFavorite }),
      });
      
      if (!response.ok) {
        throw new Error('Błąd aktualizacji statusu ulubionego planu');
      }
      
      setState({ 
        ...state, 
        [planId]: { isProcessing: false } 
      });
      
      return true;
    } catch (error) {
      setState({ 
        ...state, 
        [planId]: { 
          isProcessing: false, 
          error: error instanceof Error ? error.message : 'Nieznany błąd' 
        } 
      });
      
      return false;
    }
  };
  
  return { state, toggleFavorite };
}
```

## 7. Integracja API
Strona główna integruje się z endpointem `/api/home`, który zwraca różne odpowiedzi w zależności od stanu logowania użytkownika.

### Żądanie
- **Metoda**: GET
- **URL**: `/api/home`
- **Parametry zapytania**:
  - `language`: opcjonalny parametr określający język treści (domyślnie: preferencja użytkownika lub "pl")

### Odpowiedź dla niezalogowanych użytkowników
Zwraca obiekt typu `HomeGuestResponse` zawierający listę wyróżnionych przewodników:
```typescript
{
  featured_guides: FeaturedGuideDto[]
}
```

### Odpowiedź dla zalogowanych użytkowników
Zwraca obiekt typu `HomeUserResponse` zawierający personalizowane dane:
```typescript
{
  user_greeting: UserGreetingDto;
  recent_plans: RecentPlanDto[];
  recommended_guides: RecommendedGuideDto[];
  new_guides: NewGuideDto[];
}
```

## 8. Interakcje użytkownika
### Dla niezalogowanych użytkowników:
1. **Kliknięcie przycisku "Zarejestruj się"/"Zaloguj się"**:
   - Przekierowanie do odpowiedniej strony uwierzytelniania (/auth/signup lub /auth/login)

2. **Kliknięcie w kartę wyróżnionego przewodnika**:
   - Przekierowanie do strony szczegółów przewodnika (/guides/{id})

3. **Interakcja z karuzelą wyróżnionych przewodników**:
   - Przewijanie karuzeli przy użyciu strzałek lub gestów
   - Wybór konkretnego slajdu za pomocą kropek nawigacyjnych

### Dla zalogowanych użytkowników:
1. **Kliknięcie w kartę ostatniego planu**:
   - Przekierowanie do strony szczegółów planu (/plans/{id})

2. **Oznaczenie planu jako ulubiony**:
   - Kliknięcie ikony gwiazdki/serca przy planie
   - Wysłanie żądania PATCH do `/api/plans/{id}` z aktualizacją statusu
   - Wizualne zaktualizowanie ikony po pomyślnej odpowiedzi

3. **Kliknięcie w kartę rekomendowanego lub nowego przewodnika**:
   - Przekierowanie do strony szczegółów przewodnika (/guides/{id})

4. **Interakcja z paskiem szybkich akcji**:
   - Kliknięcie przycisku prowadzi do odpowiedniej sekcji aplikacji (np. /guides, /plans, /profile)

## 9. Warunki i walidacja
### Walidacja stanu sesji:
- Komponent `HomePage` weryfikuje stan logowania użytkownika przy użyciu hooka Supabase
- Na podstawie weryfikacji wybiera odpowiedni widok (GuestHomePage lub UserHomePage)

### Walidacja dostępności danych:
- Sprawdzenie, czy dane zostały poprawnie pobrane z API przed ich wyświetleniem
- Wyświetlenie stanu ładowania, gdy dane są pobierane
- Wyświetlenie komunikatu o błędzie, gdy wystąpi problem z pobieraniem danych

### Warunki dla widoku zalogowanego użytkownika:
- Sprawdzenie, czy użytkownik ma zapisane plany przed renderowaniem RecentPlansGrid
- Wyświetlenie komunikatu, gdy użytkownik nie ma jeszcze żadnych planów
- Sprawdzenie, czy istnieją rekomendowane i nowe przewodniki przed renderowaniem odpowiednich sekcji

## 10. Obsługa błędów
### Obsługa błędów pobierania danych:
- Wyświetlenie komunikatu o błędzie, gdy nie udało się pobrać danych z API
- Możliwość ponowienia próby pobierania danych poprzez przycisk "Spróbuj ponownie"
- Logowanie błędów do systemu monitoringu (np. Sentry) w przypadku produkcji

### Obsługa błędów aktualizacji statusu ulubionego planu:
- Wyświetlenie dyskretnego powiadomienia o błędzie, gdy nie udało się zaktualizować statusu
- Automatyczne przywrócenie poprzedniego stanu interfejsu (toggle wraca do poprzedniej pozycji)
- Ponowienie próby po kliknięciu przez użytkownika

### Obsługa pustych danych:
- Wyświetlenie przyjaznych komunikatów, gdy brak danych w poszczególnych sekcjach
- Wyświetlenie sugestii działań, które użytkownik może podjąć, aby uzupełnić dane (np. "Przejrzyj przewodniki, aby znaleźć inspirację")

## 11. Kroki implementacji
1. **Przygotowanie typów i hookow**:
   - Utworzenie pliku `src/types/home-page.ts` z typami specyficznymi dla strony głównej
   - Implementacja hookow `useHomePageData` i `useToggleFavoritePlan` w `src/hooks/home-page.ts`

2. **Implementacja głównego komponentu strony**:
   - Utworzenie komponentu `HomePage.tsx` wybierającego wariant widoku
   - Implementacja logiki weryfikacji sesji użytkownika
   - Obsługa pobierania i renderowania danych

3. **Implementacja komponentów dla niezalogowanych użytkowników**:
   - Implementacja `GuestHomePage.tsx` jako kontenera
   - Implementacja komponentów prezentacyjnych: `HeroSection`, `FeaturedGuidesCarousel`, `HowItWorksSteps`, `TestimonialSlider`, `BenefitsList`, `RegisterCTA`
   - Dodanie statycznych treści marketingowych

4. **Implementacja komponentów dla zalogowanych użytkowników**:
   - Implementacja `UserHomePage.tsx` jako kontenera
   - Implementacja komponentów prezentacyjnych: `UserWelcome`, `RecentPlansGrid`, `RecommendedGuidesSlider`, `NewGuidesSection`, `QuickActionsBar`
   - Dodanie logiki obsługi interakcji z planami i przewodnikami

5. **Integracja API**:
   - Implementacja klienta API dla endpointu `/api/home` w `src/api/home.ts`
   - Integracja z hookiem `useHomePageData`

6. **Implementacja obsługi błędów**:
   - Dodanie komponentów informacyjnych dla stanów błędów i pustych danych
   - Implementacja mechanizmu ponawiania próby pobierania danych

7. **Testy**:
   - Napisanie testów jednostkowych dla komponentów przy użyciu React Testing Library
   - Dodanie testów integracyjnych dla głównego widoku strony
   - Testy e2e z użyciem Playwright sprawdzające kluczowe interakcje

8. **Optymalizacja wydajności**:
   - Implementacja lazy loading dla obrazów
   - Optymalizacja renderu warunkowo renderowanych komponentów
   - Dodanie preloadu dla kluczowych zasobów

9. **Obsługa trybu offline (PWA)**:
   - Konfiguracja cache'owania odpowiedzi API dla dostępu offline
   - Testowanie działania w trybie offline 