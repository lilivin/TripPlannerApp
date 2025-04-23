# Architektura UI dla TripPlanner (MVP)

## 1. Przegląd struktury UI

TripPlanner to aplikacja PWA umożliwiająca użytkownikom tworzenie spersonalizowanych planów wycieczek na podstawie przewodników tworzonych przez różnych twórców. Architektura UI została zaprojektowana z myślą o intuicyjnym doświadczeniu użytkownika, dostępności zarówno w trybie online jak i offline oraz zgodności z wymaganiami produktu i planem API.

Ogólna struktura aplikacji składa się z:
- **Widoku publicznego**: dostępnego dla niezalogowanych użytkowników, obejmującego stronę główną, listę przewodników (z ograniczeniami), stronę logowania i rejestracji.
- **Widoku prywatnego**: dostępnego po zalogowaniu, obejmującego pełny dostęp do przewodników, możliwość generowania planów, profil użytkownika z zapisanymi planami.
- **Systemu nawigacji**: menu głównego, nawigacji kontekstowej i przycisków akcji.
- **Komponentów współdzielonych**: używanych w wielu widokach (karty, przyciski, formularze, mapy).

Aplikacja będzie responsywna, z podejściem mobile-first, zapewniając optymalne doświadczenie na różnych urządzeniach, ze szczególnym uwzględnieniem urządzeń mobilnych, jako że będzie funkcjonować jako PWA.

## 2. Lista widoków

### 2.1. Strona Główna
- **Ścieżka**: `/`
- **Główny cel**: Wprowadzenie do aplikacji, zachęcenie do rejestracji/logowania i przedstawienie głównych funkcji
- **Kluczowe informacje**:
  - Banner z hasłem promocyjnym i przyciskiem CTA
  - Skrócona lista polecanych przewodników
  - Krótkie wyjaśnienie działania aplikacji
- **Kluczowe komponenty**:
  - Hero section z przyciskiem rejestracji/logowania
  - Karuzela polecanych przewodników
  - Sekcja "Jak to działa" (krótkie wyjaśnienie procesu)
- **UX/Dostępność/Bezpieczeństwo**:
  - Intuicyjny UX z jasnym CTA
  - Obrazy z alternatywnym tekstem
  - Responsywny design dla różnych urządzeń

### 2.2. Logowanie
- **Ścieżka**: `/login`
- **Główny cel**: Umożliwienie użytkownikom zalogowania się do aplikacji
- **Kluczowe informacje**:
  - Formularz logowania (email, hasło)
  - Link do rejestracji
  - Link do resetowania hasła
- **Kluczowe komponenty**:
  - Formularz logowania z walidacją
  - Przyciski akcji (Zaloguj, Przejdź do rejestracji)
  - Komunikaty o błędach
- **UX/Dostępność/Bezpieczeństwo**:
  - Jasne komunikaty o błędach
  - Zabezpieczone pola hasła
  - Dostępność z klawiatury
  - Integracja z Supabase Auth

### 2.3. Rejestracja
- **Ścieżka**: `/register`
- **Główny cel**: Umożliwienie nowym użytkownikom utworzenia konta
- **Kluczowe informacje**:
  - Formularz rejestracji (email, hasło, powtórz hasło)
  - Link do logowania
  - Informacje o polityce prywatności
- **Kluczowe komponenty**:
  - Formularz rejestracji z walidacją
  - Przyciski akcji (Zarejestruj, Przejdź do logowania)
  - Checkbox akceptacji regulaminu
- **UX/Dostępność/Bezpieczeństwo**:
  - Walidacja siły hasła
  - Weryfikacja email (dwuetapowa rejestracja)
  - Dostępność z klawiatury
  - Integracja z Supabase Auth

### 2.4. Lista przewodników
- **Ścieżka**: `/guides`
- **Główny cel**: Prezentacja dostępnych przewodników z możliwością filtrowania
- **Kluczowe informacje**:
  - Lista przewodników z podstawowymi informacjami
  - System filtrowania (twórcy, lokalizacje, tagi)
  - Oznaczenia statusu (płatny/bezpłatny)
- **Kluczowe komponenty**:
  - Panel filtrów (filtry wielokrotnego wyboru)
  - Karty przewodników z miniaturami
  - Paginacja lub infinite scroll
  - Oznaczenia cenowe
- **UX/Dostępność/Bezpieczeństwo**:
  - Filtry zwijane na mobilnych urządzeniach
  - Lazy loading obrazów
  - Dostępność z klawiatury dla filtrów
  - Wyraźne oznaczenia statusu dostępności

### 2.5. Szczegóły przewodnika
- **Ścieżka**: `/guides/{id}`
- **Główny cel**: Prezentacja szczegółowych informacji o przewodniku
- **Kluczowe informacje**:
  - Pełny opis przewodnika
  - Lista atrakcji z krótkimi opisami
  - Informacje o twórcy
  - Oceny i recenzje
  - Przycisk generowania planu
- **Kluczowe komponenty**:
  - Galeria zdjęć
  - Sekcja opisu
  - Lista atrakcji z możliwością rozwinięcia
  - Sekcja recenzji
  - Przycisk "Generuj plan"
  - Oznaczenie ceny i statusu
- **UX/Dostępność/Bezpieczeństwo**:
  - Dostępna nawigacja między sekcjami
  - Animacje rozwijające szczegóły atrakcji
  - Zabezpieczenie dostępu do płatnych przewodników

### 2.6. Formularz generowania planu
- **Ścieżka**: `/guides/{id}/generate`
- **Główny cel**: Umożliwienie podania preferencji do generowania planu
- **Kluczowe informacje**:
  - Formularz preferencji (liczba dni, godziny, tempo)
  - Opcje filtrowania atrakcji (tagi)
  - Podgląd wybranych parametrów
- **Kluczowe komponenty**:
  - Formularz z polami wyboru
  - Suwaki dla preferencji tempa
  - Wybór dat i godzin
  - Przyciski akcji (Generuj, Anuluj)
- **UX/Dostępność/Bezpieczeństwo**:
  - Intuicyjne kontrolki formularza
  - Walidacja danych wejściowych
  - Zapisywanie stanu formularza (localStorage)
  - Dostępność z klawiatury

### 2.7. Ekran ładowania generowania planu
- **Ścieżka**: `/guides/{id}/generate/loading`
- **Główny cel**: Prezentacja statusu generowania planu przez AI
- **Kluczowe informacje**:
  - Stan procesu generowania
  - Szacowany czas oczekiwania
- **Kluczowe komponenty**:
  - Animowany loader
  - Komunikat o statusie
  - Opcja anulowania (jeśli możliwe)
- **UX/Dostępność/Bezpieczeństwo**:
  - Informacyjne komunikaty o postępie
  - Animacje dostępne (nie bazujące tylko na kolorach)
  - Zabezpieczenie przed wielokrotnym wywołaniem

### 2.8. Podgląd wygenerowanego planu
- **Ścieżka**: `/guides/{id}/generate/preview`
- **Główny cel**: Prezentacja wygenerowanego planu z możliwością edycji przed zapisaniem
- **Kluczowe informacje**:
  - Pełny podgląd wygenerowanego planu
  - Opcje edycji (kolejność, usuwanie, notatki)
  - Przyciski akcji (Zapisz, Modyfikuj, Generuj ponownie)
- **Kluczowe komponenty**:
  - Harmonogram dzienny z atrakcjami
  - Interaktywna mapa z punktami
  - Przyciski edycji kolejności (drag & drop)
  - Formularze notatek
- **UX/Dostępność/Bezpieczeństwo**:
  - Intuicyjny interfejs drag & drop
  - Wyraźne oznaczenia czasu i miejsc
  - Zapisywanie wersji roboczej (localStorage)

### 2.9. Lista zapisanych planów
- **Ścieżka**: `/plans`
- **Główny cel**: Prezentacja wszystkich zapisanych planów użytkownika
- **Kluczowe informacje**:
  - Lista planów z nazwami i datami
  - Filtrowanie (ulubione, niedawne)
  - Oznaczenia dostępności offline
- **Kluczowe komponenty**:
  - Karty planów
  - Panel filtrów
  - Przyciski akcji (Wyświetl, Usuń, Dostęp offline)
  - Oznaczenia statusu offline
- **UX/Dostępność/Bezpieczeństwo**:
  - Możliwość sortowania planów
  - Potwierdzenie przed usunięciem
  - Wskaźniki statusu synchronizacji

### 2.10. Szczegóły planu
- **Ścieżka**: `/plans/{id}`
- **Główny cel**: Prezentacja szczegółów zapisanego planu z możliwością modyfikacji
- **Kluczowe informacje**:
  - Szczegółowy harmonogram dzienny
  - Lista atrakcji w kolejności zwiedzania
  - Interaktywna mapa
  - Opcje edycji
- **Kluczowe komponenty**:
  - Tabs/Accordion dla poszczególnych dni
  - Lista atrakcji z czasami
  - Mapa z zaznaczonymi punktami
  - Przyciski edycji i zapisywania zmian
  - Przycisk zapisywania do użytku offline
- **UX/Dostępność/Bezpieczeństwo**:
  - Przełączanie między widokiem listy i mapy
  - Offline caching dla zapisanych planów
  - Dostępność komponentów interaktywnych

### 2.11. Szczegóły atrakcji
- **Ścieżka**: `/attractions/{id}`
- **Główny cel**: Prezentacja szczegółowych informacji o konkretnej atrakcji
- **Kluczowe informacje**:
  - Pełny opis atrakcji
  - Galeria zdjęć
  - Metadane (adres, godziny otwarcia, kontakt)
  - Lokalizacja na mapie
- **Kluczowe komponenty**:
  - Galeria zdjęć
  - Sekcja opisu
  - Panel z metadanymi
  - Mapa z lokalizacją
  - Przycisk powrotu do planu
- **UX/Dostępność/Bezpieczeństwo**:
  - Możliwość powiększania zdjęć
  - Wyraźne wyświetlanie informacji praktycznych
  - Dostępność z offline cache (jeśli zapisane)

### 2.12. Profil użytkownika
- **Ścieżka**: `/profile`
- **Główny cel**: Zarządzanie profilem i preferencjami
- **Kluczowe informacje**:
  - Dane użytkownika
  - Ustawienia (język, preferencje)
  - Lista ulubionych planów
- **Kluczowe komponenty**:
  - Formularz edycji profilu
  - Ustawienia językowe (polski/angielski)
  - Tabela z dostępem do przewodników
  - Zarządzanie dostępem offline
- **UX/Dostępność/Bezpieczeństwo**:
  - Przejrzyste formularze edycji
  - Potwierdzenie zmian
  - Bezpieczne przechowywanie preferencji

### 2.13. Profil twórcy
- **Ścieżka**: `/creators/{id}`
- **Główny cel**: Prezentacja informacji o twórcy i jego przewodnikach
- **Kluczowe informacje**:
  - Biografia twórcy
  - Lista stworzonych przewodników
  - Dane kontaktowe (jeśli udostępnione)
- **Kluczowe komponenty**:
  - Sekcja opisu twórcy
  - Galeria przewodników
  - Statystyki twórcy (liczba przewodników, średnia ocena)
- **UX/Dostępność/Bezpieczeństwo**:
  - Przejrzysty układ profilu
  - Ochrona danych kontaktowych
  - Dostępność informacji

### 2.14. Formularz recenzji
- **Ścieżka**: `/guides/{id}/review`
- **Główny cel**: Umożliwienie dodania recenzji przewodnika
- **Kluczowe informacje**:
  - Formularz oceny (1-5)
  - Pole komentarza
  - Informacja o wymaganiach
- **Kluczowe komponenty**:
  - Kontrolka gwiazdek (rating)
  - Pole tekstowe komentarza
  - Przyciski akcji (Wyślij, Anuluj)
- **UX/Dostępność/Bezpieczeństwo**:
  - Intuicyjny system ocen
  - Walidacja danych wejściowych
  - Zapobieganie duplikatom recenzji

## 3. Mapa podróży użytkownika

### 3.1. Przepływ podstawowy: Generowanie i zapisywanie planu

1. **Rejestracja i logowanie**
   - Użytkownik wchodzi na stronę główną
   - Klika "Zarejestruj się" lub "Zaloguj się"
   - Wypełnia formularz i przesyła dane
   - System autoryzuje użytkownika i przekierowuje na stronę główną

2. **Przeglądanie i wybór przewodnika**
   - Użytkownik przechodzi do listy przewodników
   - Filtruje wyniki według preferencji (lokalizacja, twórca, tagi)
   - Przegląda dostępne przewodniki
   - Wybiera interesujący przewodnik, klikając na jego kartę

3. **Przeglądanie szczegółów przewodnika**
   - Użytkownik zapoznaje się z pełnym opisem
   - Przegląda listę atrakcji
   - Czyta recenzje innych użytkowników
   - Decyduje się na generowanie planu i klika "Generuj plan"

4. **Konfiguracja i generowanie planu**
   - Użytkownik wypełnia formularz preferencji:
     - Wybiera liczbę dni
     - Określa godziny rozpoczęcia i zakończenia
     - Wybiera tempo zwiedzania
     - Opcjonalnie filtruje typy atrakcji
   - Klika "Generuj plan"
   - System wyświetla ekran ładowania
   - AI generuje plan na podstawie preferencji

5. **Przeglądanie i modyfikacja wygenerowanego planu**
   - Użytkownik widzi podgląd wygenerowanego planu
   - Może modyfikować kolejność atrakcji (drag & drop)
   - Może usuwać lub dodawać atrakcje
   - Może dodawać notatki do poszczególnych atrakcji
   - Po zakończeniu modyfikacji klika "Zapisz plan"

6. **Zarządzanie zapisanym planem**
   - Użytkownik nadaje nazwę planowi
   - Opcjonalnie oznacza plan jako ulubiony
   - Opcjonalnie zapisuje plan do użytku offline
   - System potwierdza zapisanie planu
   - Użytkownik zostaje przekierowany do widoku szczegółów planu

### 3.2. Przepływ alternatywny: Korzystanie z zapisanego planu

1. **Dostęp do zapisanych planów**
   - Użytkownik loguje się do aplikacji
   - Przechodzi do sekcji "Moje plany"
   - Widzi listę wszystkich zapisanych planów
   - Może filtrować plany (ulubione, dostępne offline)

2. **Przeglądanie szczegółów planu**
   - Użytkownik wybiera plan z listy
   - System wyświetla szczegółowy harmonogram
   - Użytkownik może przełączać się między widokiem listy i mapy
   - Może rozwijać poszczególne dni harmonogramu

3. **Korzystanie z planu podczas wycieczki**
   - Użytkownik przegląda plan dzień po dniu
   - Klika na atrakcje, aby zobaczyć szczegóły
   - Używa mapy do lokalizacji atrakcji
   - W trybie offline korzysta z wcześniej zapisanych danych

### 3.3. Przepływ alternatywny: Dodawanie recenzji

1. **Przeglądanie przewodnika**
   - Użytkownik przegląda szczegóły przewodnika
   - Przewija do sekcji recenzji
   - Klika "Dodaj recenzję"

2. **Dodawanie recenzji**
   - Użytkownik wybiera ocenę (1-5 gwiazdek)
   - Wpisuje komentarz (opcjonalnie)
   - Klika "Wyślij recenzję"
   - System zapisuje recenzję i odświeża widok

## 4. Układ i struktura nawigacji

### 4.1. Główna nawigacja (Nagłówek)

- **Lewy obszar**:
  - Logo aplikacji (link do strony głównej)
  - Przełącznik języka (polski/angielski)

- **Centralny obszar** (adaptacyjny, zależny od szerokości ekranu):
  - Link do listy przewodników
  - Link do zapisanych planów (tylko dla zalogowanych)
  - Wyszukiwarka (na większych ekranach)

- **Prawy obszar**:
  - Przyciski logowania/rejestracji (dla niezalogowanych)
  - Menu użytkownika (dla zalogowanych):
    - Avatar użytkownika
    - Dropdown z linkami do:
      - Profilu użytkownika
      - Zapisanych planów
      - Wylogowania

### 4.2. Nawigacja kontekstowa

- **Breadcrumbs**: wyświetlane na podstronach dla łatwej nawigacji wstecz
- **Tabs/Segmenty**: na stronach z wieloma kategoriami informacji (np. szczegóły przewodnika)
- **Przyciski powrotu**: na stronach szczegółowych, umożliwiające powrót do widoku nadrzędnego

### 4.3. Bottom Navigation (Mobile)

Na urządzeniach mobilnych dodatkowy pasek nawigacyjny na dole ekranu:
- Ikona strony głównej
- Ikona przewodników
- Ikona moich planów
- Ikona profilu

### 4.4. Struktura zagnieżdżenia widoków

1. **Poziom główny**:
   - Strona główna
   - Lista przewodników
   - Logowanie/Rejestracja
   - Lista planów (zalogowani)
   - Profil użytkownika (zalogowani)

2. **Poziom szczegółów**:
   - Szczegóły przewodnika
   - Szczegóły planu
   - Szczegóły atrakcji
   - Profil twórcy

3. **Poziom akcji**:
   - Formularz generowania planu
   - Ekran ładowania
   - Podgląd planu
   - Formularz recenzji

## 5. Kluczowe komponenty

### 5.1. Komponenty nawigacyjne
- **MainHeader**: główny nagłówek z logo, nawigacją i menu użytkownika
- **BottomNavigation**: dolna nawigacja dla urządzeń mobilnych
- **Breadcrumbs**: ścieżka nawigacji dla zagnieżdżonych widoków
- **TabNavigation**: nawigacja zakładkowa dla widoków z wieloma sekcjami
- **LanguageSwitcher**: przełącznik języka (polski/angielski)

### 5.2. Komponenty prezentacyjne
- **GuideCard**: karta prezentująca podstawowe informacje o przewodniku
- **PlanCard**: karta prezentująca podstawowe informacje o zapisanym planie
- **AttractionItem**: element listy atrakcji z możliwością rozwinięcia
- **ImageGallery**: galeria zdjęć z możliwością powiększania
- **ReviewItem**: element listy recenzji
- **DaySchedule**: harmonogram dzienny w planie
- **PriceTag**: oznaczenie ceny przewodnika

### 5.3. Komponenty funkcjonalne
- **FilterPanel**: panel filtrów dla listy przewodników
- **RatingControl**: kontrolka oceny (gwiazdki)
- **SearchBar**: pasek wyszukiwania
- **SortingControl**: kontrolka sortowania list
- **DragDropList**: lista z możliwością przeciągania elementów
- **OfflineSwitch**: przełącznik dostępności offline

### 5.4. Komponenty formularzy
- **LoginForm**: formularz logowania
- **RegisterForm**: formularz rejestracji
- **PlanGenerationForm**: formularz preferencji generowania planu
- **ReviewForm**: formularz dodawania recenzji
- **NotesField**: pole dodawania notatek do atrakcji

### 5.5. Komponenty kontekstowe
- **UserContext**: kontekst przechowujący dane zalogowanego użytkownika
- **LanguageContext**: kontekst obsługujący tłumaczenia
- **ToastNotifications**: system powiadomień (sukces, błąd, info)
- **ErrorBoundary**: obsługa błędów w komponentach

### 5.6. Komponenty mapy
- **InteractiveMap**: interaktywna mapa (Leaflet/OpenStreetMap lub Google Maps)
- **AttractionMarker**: marker atrakcji na mapie
- **RoutePolyline**: linia trasy między atrakcjami
- **MapControls**: kontrolki mapy (zoom, centring)

### 5.7. Komponenty stanu
- **LoadingIndicator**: wskaźnik ładowania dla operacji asynchronicznych
- **EmptyState**: widok pustego stanu (brak wyników, pusta lista)
- **ErrorState**: widok błędu
- **OfflineIndicator**: wskaźnik trybu offline 