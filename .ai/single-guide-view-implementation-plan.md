# Plan implementacji widoku szczegółów przewodnika

## 1. Przegląd
Widok szczegółów przewodnika prezentuje kompletne informacje o wybranym przewodniku turystycznym, w tym pełny opis, listę atrakcji, dane twórcy oraz oceny i recenzje. Widok umożliwia użytkownikowi ocenę przydatności przewodnika oraz przejście do generowania planu wycieczki.

## 2. Routing widoku
- Ścieżka: `/guides/{id}`
- Parametry: ID przewodnika (UUID)

## 3. Struktura komponentów
```
GuideDetailPage
├── LoadingState (podczas ładowania)
├── ErrorState (w przypadku błędu)
└── GuideDetailView (gdy dane są dostępne)
    ├── GuideHeader
    │   └── PriceTag
    ├── GuideGallery
    ├── GuideContent
    │   └── CreatorInfo
    ├── TabNavigation
    │   ├── TabAttractions
    │   │   └── AttractionsList
    │   │       └── AttractionItem
    │   │           └── AttractionDetail
    │   │               └── AttractionTags
    │   └── TabReviews
    │       └── ReviewsSection
    │           └── ReviewItem
    └── GeneratePlanButton
```

## 4. Szczegóły komponentów

### GuideDetailPage
- Opis komponentu: Główny komponent strony, zarządza stanem ładowania i wyświetla odpowiedni widok
- Główne elementy: Obsługa stanu ładowania, błędów i warunkowe renderowanie komponentów
- Obsługiwane interakcje: Inicjalizacja pobierania danych
- Obsługiwana walidacja: Weryfikacja poprawności ID przewodnika
- Typy: GuideDetailViewModel
- Propsy: id: string (z parametrów URL)

### GuideHeader
- Opis komponentu: Wyświetla nagłówek przewodnika zawierający tytuł, ocenę, lokalizację, cenę i informacje dodatkowe
- Główne elementy: Tytuł, średnia ocena z gwiazdkami, lokalizacja, język, cena, zalecana liczba dni
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Formatowanie ceny, wyświetlanie gwiazdek dla oceny
- Typy: GuideHeaderViewModel
- Propsy: guide: GuideDetailDto, averageRating: number, recommendedDays: number, price: number

### GuideGallery
- Opis komponentu: Wyświetla galerię zdjęć przewodnika z możliwością ich przeglądania
- Główne elementy: Karuzela zdjęć, powiększanie, nawigacja między zdjęciami
- Obsługiwane interakcje: Przewijanie zdjęć, powiększanie, przesuwanie gestami
- Obsługiwana walidacja: Obsługa błędów ładowania zdjęć, fallback dla braku zdjęć
- Typy: GalleryViewModel
- Propsy: images: string[], coverImage: string

### GuideContent
- Opis komponentu: Wyświetla treść przewodnika i informacje o twórcy
- Główne elementy: Opis, informacje o twórcy, dane lokalizacji
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Formatowanie tekstu, obsługa braku danych
- Typy: GuideContentViewModel
- Propsy: description: string, creator: CreatorWithImageDto, locationName: string

### TabNavigation
- Opis komponentu: Umożliwia nawigację między zakładkami (atrakcje, recenzje)
- Główne elementy: Przyciski zakładek, wskaźnik aktywnej zakładki
- Obsługiwane interakcje: Przełączanie między zakładkami
- Obsługiwana walidacja: Brak
- Typy: TabsViewModel
- Propsy: activeTab: number, onTabChange: (index: number) => void

### AttractionsList
- Opis komponentu: Wyświetla listę atrakcji z możliwością filtrowania i sortowania
- Główne elementy: Lista AttractionItem, filtry (opcjonalnie)
- Obsługiwane interakcje: Filtrowanie atrakcji (opcjonalnie)
- Obsługiwana walidacja: Sortowanie według kolejności (order_index), komunikat o braku atrakcji
- Typy: AttractionsListViewModel
- Propsy: attractions: GuideAttractionDto[], expandedAttractions: Record<string, boolean>, onToggleExpand: (id: string) => void

### AttractionItem
- Opis komponentu: Wyświetla pojedynczą atrakcję z możliwością rozwinięcia szczegółów
- Główne elementy: Nazwa, miniatura zdjęcia, tags, przycisk rozwijania
- Obsługiwane interakcje: Rozwijanie/zwijanie szczegółów
- Obsługiwana walidacja: Brak
- Typy: AttractionViewModel
- Propsy: attraction: GuideAttractionDto, isExpanded: boolean, onToggleExpand: () => void

### AttractionDetail
- Opis komponentu: Wyświetla szczegóły atrakcji po rozwinięciu
- Główne elementy: Pełny opis, zdjęcia, tagi, adres
- Obsługiwane interakcje: Przeglądanie zdjęć
- Obsługiwana walidacja: Brak
- Typy: AttractionDetailViewModel
- Propsy: attraction: GuideAttractionDto

### ReviewsSection
- Opis komponentu: Wyświetla listę recenzji i ocen przewodnika
- Główne elementy: Lista ReviewItem, paginacja
- Obsługiwane interakcje: Nawigacja między stronami recenzji
- Obsługiwana walidacja: Komunikat o braku recenzji
- Typy: ReviewsViewModel
- Propsy: guideId: string, reviewsCount: number

### ReviewItem
- Opis komponentu: Wyświetla pojedynczą recenzję
- Główne elementy: Avatar użytkownika, ocena (gwiazdki), komentarz, data
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Formatowanie daty
- Typy: ReviewViewModel
- Propsy: review: ReviewDto

### GeneratePlanButton
- Opis komponentu: Przycisk umożliwiający przejście do generowania planu wycieczki
- Główne elementy: Przycisk z ikoną i tekstem
- Obsługiwane interakcje: Kliknięcie (przekierowanie do strony generowania planu)
- Obsługiwana walidacja: Weryfikacja dostępu do przewodnika (jeśli płatny)
- Typy: Prosty, bez złożonych typów
- Propsy: guideId: string, isPaid: boolean, hasAccess: boolean

## 5. Typy

### GuideDetailViewModel
```typescript
interface GuideDetailViewModel {
  id: string;
  title: string;
  description: string;
  language: string;
  price: number;
  creator: CreatorWithImageDto;
  locationName: string;
  recommendedDays: number;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  version: number;
  averageRating: number | null;
  reviewsCount: number;
  attractions?: AttractionViewModel[];
  isLoading: boolean;
  error: ApiError | null;
  activeTabIndex: number;
}
```

### AttractionViewModel
```typescript
interface AttractionViewModel {
  id: string;
  name: string;
  description: string;
  customDescription: string | null;
  orderIndex: number;
  isHighlight: boolean;
  address: string;
  images: string[];
  tags: TagDto[];
  isExpanded: boolean;
  primaryImage: string | null;
  visibleTags: TagDto[];
  hiddenTags: TagDto[];
}
```

### ReviewViewModel
```typescript
interface ReviewViewModel {
  id: string;
  user: {
    id: string;
    avatarUrl: string | null;
  };
  rating: number;
  comment: string | null;
  createdAt: string;
  formattedDate: string;
  stars: number[];
}
```

### ApiError
```typescript
interface ApiError {
  code: number;
  message: string;
  details?: unknown;
}
```

## 6. Zarządzanie stanem

### useGuideDetail
Hook do pobierania i zarządzania stanem przewodnika:
```typescript
const useGuideDetail = (guideId: string) => {
  const [guide, setGuide] = useState<GuideDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [expandedAttractions, setExpandedAttractions] = useState<Record<string, boolean>>({});

  // Funkcja do pobierania danych
  const fetchGuide = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/guides/${guideId}?include_attractions=true`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGuide(data);
    } catch (e) {
      setError({
        code: e.status || 500,
        message: e.message || 'Nieoczekiwany błąd podczas pobierania przewodnika'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcja przełączająca rozwinięcie atrakcji
  const toggleAttractionExpand = (attractionId: string) => {
    setExpandedAttractions(prev => ({
      ...prev,
      [attractionId]: !prev[attractionId]
    }));
  };

  useEffect(() => {
    fetchGuide();
  }, [guideId]);

  return {
    guide,
    isLoading,
    error,
    activeTabIndex,
    setActiveTabIndex,
    expandedAttractions,
    toggleAttractionExpand,
    refetch: fetchGuide
  };
};
```

### useReviews
Hook do pobierania i zarządzania recenzjami:
```typescript
const useReviews = (guideId: string) => {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Funkcja do pobierania recenzji
  const fetchReviews = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/guides/${guideId}/reviews?page=${page}&limit=${pagination.limit}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReviews(data.data);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        pages: data.pagination.pages
      });
    } catch (e) {
      setError({
        code: e.status || 500,
        message: e.message || 'Nieoczekiwany błąd podczas pobierania recenzji'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [guideId]);

  return {
    reviews,
    isLoading,
    error,
    pagination,
    fetchPage: fetchReviews
  };
};
```

## 7. Integracja API

### Pobieranie szczegółów przewodnika
- **Endpoint**: `GET /api/guides/{id}?include_attractions=true`
- **Typ żądania**: Parametr ścieżki: `id` (UUID), Parametr zapytania: `include_attractions` (boolean)
- **Typ odpowiedzi**: `GuideDetailDto`
- **Kod implementacji**:
```typescript
const fetchGuideDetails = async (id: string, includeAttractions: boolean = true) => {
  const response = await fetch(`/api/guides/${id}?include_attractions=${includeAttractions}`);
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(response.status, error.message);
  }
  return await response.json() as GuideDetailDto;
};
```

### Pobieranie recenzji przewodnika
- **Endpoint**: `GET /api/guides/{guide_id}/reviews?page={page}&limit={limit}`
- **Typ żądania**: Parametry ścieżki: `guide_id` (UUID), Parametry zapytania: `page` (number), `limit` (number)
- **Typ odpowiedzi**: `ReviewListResponse`
- **Kod implementacji**:
```typescript
const fetchGuideReviews = async (guideId: string, page: number = 1, limit: number = 10) => {
  const response = await fetch(`/api/guides/${guideId}/reviews?page=${page}&limit=${limit}`);
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(response.status, error.message);
  }
  return await response.json() as ReviewListResponse;
};
```

## 8. Interakcje użytkownika

1. **Przeglądanie szczegółów przewodnika**
   - Użytkownik wchodzi na stronę `/guides/{id}`
   - System pobiera dane z API i wyświetla szczegóły przewodnika
   - Użytkownik widzi nagłówek, galerię zdjęć, opis i informacje o twórcy

2. **Przeglądanie atrakcji**
   - Użytkownik przechodzi do zakładki "Atrakcje" (jeśli nie jest aktywna)
   - System wyświetla listę atrakcji z podstawowymi informacjami
   - Użytkownik klika na atrakcję, aby rozwinąć szczegóły
   - System rozwija panel z dodatkowymi informacjami o atrakcji (pełny opis, więcej zdjęć, tagi)
   - Użytkownik może ponownie kliknąć, aby zwinąć szczegóły

3. **Przeglądanie recenzji**
   - Użytkownik przechodzi do zakładki "Recenzje"
   - System pobiera i wyświetla recenzje innych użytkowników
   - Użytkownik przegląda recenzje i może nawigować między stronami recenzji (jeśli jest ich więcej)

4. **Generowanie planu**
   - Użytkownik klika przycisk "Generuj plan"
   - System weryfikuje dostęp użytkownika do przewodnika (jeśli jest płatny)
   - System przekierowuje użytkownika do strony generowania planu z predefiniowanym ID przewodnika

## 9. Warunki i walidacja

1. **Weryfikacja ID przewodnika**
   - Komponent `GuideDetailPage` weryfikuje poprawność ID z URL
   - Jeśli ID jest nieprawidłowe, wyświetlany jest komunikat błędu
   - Format UUID jest sprawdzany przed wywołaniem API

2. **Dostęp do płatnych przewodników**
   - Komponent `GuideHeader` wyświetla informację o cenie przewodnika
   - Komponent `GeneratePlanButton` sprawdza, czy użytkownik ma dostęp do przewodnika
   - Jeśli przewodnik jest płatny i użytkownik nie ma dostępu, pokazywana jest informacja o konieczności zakupu

3. **Walidacja stanu publikacji**
   - Komponent `GuideHeader` wyświetla status publikacji (dla niepublikowanych przewodników)
   - Niepublikowane przewodniki są oznaczone odpowiednią informacją ("Wersja robocza" lub "W przygotowaniu")

4. **Walidacja danych atrakcji**
   - Komponent `AttractionsList` sprawdza, czy lista atrakcji istnieje
   - Jeśli przewodnik nie ma atrakcji, wyświetlany jest odpowiedni komunikat
   - Komponenty `AttractionItem` i `AttractionDetail` weryfikują kompletność danych atrakcji

## 10. Obsługa błędów

1. **Błąd 404 - Przewodnik nie istnieje**
   - Komponent `ErrorState` wyświetla komunikat "Przewodnik nie został znaleziony"
   - Oferuje przycisk powrotu do listy przewodników

2. **Błąd 500 - Błąd serwera**
   - Komponent `ErrorState` wyświetla komunikat "Wystąpił błąd podczas pobierania danych przewodnika"
   - Oferuje przycisk ponowienia próby (refetch)

3. **Błąd ładowania zdjęć**
   - Komponenty `GuideGallery` i `AttractionDetail` obsługują błędy ładowania zdjęć
   - W przypadku błędu wyświetlany jest placeholder lub ikona błędu
   - Implementacja obsługi zdarzenia onError dla tagów img

4. **Brak danych**
   - Każdy komponent (AttractionsList, ReviewsSection) obsługuje przypadek braku danych
   - Wyświetlane są odpowiednie komunikaty informacyjne

## 11. Kroki implementacji

1. **Konfiguracja routingu i struktury plików**
   - Utworzenie pliku `src/pages/guides/[id].astro`
   - Dodanie importów niezbędnych komponentów i hooków
   - Skonfigurowanie pobierania parametru ID z URL

2. **Implementacja hooka useGuideDetail**
   - Utworzenie pliku `src/hooks/useGuideDetail.ts`
   - Implementacja logiki pobierania danych i zarządzania stanem

3. **Implementacja hooka useReviews**
   - Utworzenie pliku `src/hooks/useReviews.ts`
   - Implementacja logiki pobierania recenzji i zarządzania paginacją

4. **Implementacja komponentów głównych**
   - Implementacja komponentu `GuideDetailPage`
   - Implementacja komponentów stanu: `LoadingState`, `ErrorState`
   - Implementacja komponentu `TabNavigation`

5. **Implementacja komponentów szczegółów przewodnika**
   - Implementacja komponentów `GuideHeader`, `GuideGallery`, `GuideContent`
   - Implementacja komponentu `CreatorInfo`

6. **Implementacja komponentów atrakcji**
   - Implementacja komponentów `AttractionsList`, `AttractionItem`, `AttractionDetail`
   - Implementacja komponentu `AttractionTags`

7. **Implementacja komponentów recenzji**
   - Implementacja komponentów `ReviewsSection`, `ReviewItem`
   - Implementacja logiki paginacji recenzji

8. **Implementacja komponentu GeneratePlanButton**
   - Utworzenie komponentu z logiką weryfikacji dostępu i nawigacji

9. **Stylowanie komponentów**
   - Implementacja stylów z użyciem Tailwind CSS
   - Dostosowanie responsywności dla różnych urządzeń

10. **Testy i optymalizacja**
    - Testowanie komponentów i interakcji
    - Optymalizacja wydajności (lazy loading, wirtualizacja list)
    - Poprawki dostępności (ARIA, semantyczny HTML, obsługa klawiatury) 