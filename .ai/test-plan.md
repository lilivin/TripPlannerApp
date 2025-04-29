# Plan Testów dla aplikacji TripPlanner

## 1. Wprowadzenie i cele testowania

Celem niniejszego planu testów jest zapewnienie wysokiej jakości aplikacji TripPlanner przed jej wdrożeniem i podczas dalszego rozwoju. Plan obejmuje kompleksowe podejście do testowania wszystkich komponentów aplikacji, ze szczególnym uwzględnieniem specyfiki stosu technologicznego oraz wyzwań związanych z integracją z usługami zewnętrznymi.

### Cele główne:
- Zapewnienie poprawnego działania funkcjonalności aplikacji zgodnie z wymaganiami
- Weryfikacja responsywności interfejsu użytkownika na różnych urządzeniach
- Testowanie integracji z Supabase oraz API OpenAI
- Sprawdzenie funkcjonalności PWA i możliwości działania offline
- Walidacja mechanizmów autoryzacji i autentykacji użytkowników
- Weryfikacja poprawności generowania planów podróży z wykorzystaniem AI

## 2. Zakres testów

### Zakres funkcjonalny:
- Rejestracja i logowanie użytkowników
- Przeglądanie dostępnych przewodników
- Generowanie planów podróży z wykorzystaniem AI
- Zapisywanie i zarządzanie planami podróży
- Przeglądanie atrakcji i szczegółów przewodników
- Funkcjonalność map i geolokalizacji

### Zakres niefunkcjonalny:
- Wydajność aplikacji
- Responsywność interfejsu
- Dostępność (accessibility)
- Bezpieczeństwo danych
- Funkcjonalność PWA i działanie offline
- Zużycie zasobów

### Środowiska testowe:
- Lokalne środowisko deweloperskie
- Środowisko testowe na DigitalOcean
- Środowisko produkcyjne (testy przedwdrożeniowe)

## 3. Typy testów do przeprowadzenia

### 3.1. Testy jednostkowe
- Testy komponentów React
- Testy funkcji pomocniczych
- Testy schematów Zod
- Testy walidacji danych

**Narzędzia**: Vitest/Jest, React Testing Library

### 3.2. Testy integracyjne
- Testy integracji z Supabase
- Testy integracji z API OpenAI
- Testy komunikacji między komponentami aplikacji
- Testy przepływu danych w aplikacji

**Narzędzia**: Cypress, MSW (Mock Service Worker)

### 3.3. Testy interfejsu użytkownika (E2E)
- Testy pełnych przepływów użytkownika
- Testy responsywności na różnych urządzeniach
- Testy dostępności (a11y)

**Narzędzia**: Cypress, Playwright, Lighthouse

### 3.4. Testy wydajnościowe
- Testy czasu ładowania aplikacji
- Testy wydajności renderowania komponentów
- Testy wydajności generowania planów podróży
- Testy zmian rozmiaru bundle'a

**Narzędzia**: Lighthouse, WebPageTest, Chrome DevTools

### 3.5. Testy bezpieczeństwa
- Testy autoryzacji i autentykacji
- Testy zabezpieczeń API
- Skanowanie zależności pod kątem luk bezpieczeństwa

**Narzędzia**: OWASP ZAP, npm audit, Snyk

### 3.6. Testy PWA
- Testy instalacji aplikacji
- Testy działania offline
- Testy synchronizacji danych

**Narzędzia**: Lighthouse, Workbox, Chrome DevTools

## 4. Scenariusze testowe dla kluczowych funkcjonalności

### 4.1. Rejestracja i logowanie
- **Scenariusz 1.1**: Rejestracja nowego użytkownika z poprawnymi danymi
- **Scenariusz 1.2**: Próba rejestracji z już istniejącym adresem email
- **Scenariusz 1.3**: Próba rejestracji z niepoprawnym formatem adresu email
- **Scenariusz 1.4**: Logowanie z poprawnymi danymi
- **Scenariusz 1.5**: Logowanie z nieprawidłowymi danymi
- **Scenariusz 1.6**: Resetowanie hasła
- **Scenariusz 1.7**: Wylogowanie z aplikacji

### 4.2. Przeglądanie przewodników
- **Scenariusz 2.1**: Wyświetlenie listy wszystkich przewodników
- **Scenariusz 2.2**: Filtrowanie przewodników według lokalizacji
- **Scenariusz 2.3**: Filtrowanie przewodników według języka
- **Scenariusz 2.4**: Filtrowanie przewodników według liczby dni
- **Scenariusz 2.5**: Wyszukiwanie przewodników po frazie
- **Scenariusz 2.6**: Wyświetlenie szczegółów przewodnika
- **Scenariusz 2.7**: Przeglądanie atrakcji w przewodniku

### 4.3. Generowanie planów podróży
- **Scenariusz 3.1**: Generowanie planu z domyślnymi preferencjami
- **Scenariusz 3.2**: Generowanie planu z określoną liczbą dni
- **Scenariusz 3.3**: Generowanie planu z określonymi godzinami rozpoczęcia i zakończenia dnia
- **Scenariusz 3.4**: Generowanie planu z wybranymi tagami do uwzględnienia
- **Scenariusz 3.5**: Generowanie planu z wybranymi tagami do wykluczenia
- **Scenariusz 3.6**: Generowanie planu z uwzględnieniem posiłków
- **Scenariusz 3.7**: Generowanie planu z określonym trybem transportu
- **Scenariusz 3.8**: Generowanie planu z maksymalną liczbą dni (30)
- **Scenariusz 3.9**: Próba generowania planu bez dostępu do przewodnika
- **Scenariusz 3.10**: Próba generowania planu dla przewodnika bez atrakcji

### 4.4. Zarządzanie planami podróży
- **Scenariusz 4.1**: Zapisanie wygenerowanego planu podróży
- **Scenariusz 4.2**: Przeglądanie zapisanych planów podróży
- **Scenariusz 4.3**: Filtrowanie planów według przewodnika
- **Scenariusz 4.4**: Filtrowanie planów według ulubionych
- **Scenariusz 4.5**: Oznaczenie planu jako ulubiony
- **Scenariusz 4.6**: Edycja nazwy zapisanego planu
- **Scenariusz 4.7**: Usunięcie zapisanego planu

### 4.5. Przeglądanie i interakcja z atrakcjami
- **Scenariusz 5.1**: Wyświetlenie listy atrakcji w planie
- **Scenariusz 5.2**: Wyświetlenie szczegółów atrakcji
- **Scenariusz 5.3**: Wyświetlenie galerii zdjęć atrakcji
- **Scenariusz 5.4**: Wyświetlenie lokalizacji atrakcji na mapie
- **Scenariusz 5.5**: Wyświetlenie wszystkich atrakcji planu na mapie
- **Scenariusz 5.6**: Dodawanie notatek do atrakcji
- **Scenariusz 5.7**: Wyświetlanie informacji o dostępności i biletach

### 4.6. Funkcje PWA i działanie offline
- **Scenariusz 6.1**: Instalacja aplikacji jako PWA
- **Scenariusz 6.2**: Przeglądanie zapisanych planów w trybie offline
- **Scenariusz 6.3**: Przeglądanie szczegółów atrakcji w trybie offline
- **Scenariusz 6.4**: Synchronizacja danych po przywróceniu połączenia
- **Scenariusz 6.5**: Zapisanie planu w trybie offline i synchronizacja po połączeniu

## 5. Środowisko testowe

### 5.1. Infrastruktura testowa
- Lokalne środowisko deweloperskie z Supabase uruchomionym w Docker
- Testowe środowisko na DigitalOcean z oddzielną bazą danych
- Dostęp do API OpenAI z kluczem testowym (ograniczony budżet)
- Konfiguracja CI/CD z GitHub Actions

### 5.2. Wymagania sprzętowe i programowe
- Maszyny deweloperskie z Node.js 22.14.0
- Przeglądarka Chrome (najnowsza wersja) oraz Firefox, Safari, Edge
- Urządzenia mobilne z systemem iOS i Android
- Docker do lokalnego uruchomienia Supabase

### 5.3. Zarządzanie danymi testowymi
- Przygotowanie zestawu testowych przewodników i atrakcji
- Konta testowe z różnymi poziomami uprawnień
- Skrypty do resetowania środowiska testowego do stanu początkowego
- Zestaw mocków dla odpowiedzi OpenAI API

## 6. Narzędzia do testowania

### 6.1. Narzędzia do testów automatycznych
- **Vitest/Jest**: Testy jednostkowe
- **React Testing Library**: Testy komponentów React
- **Cypress**: Testy E2E i integracyjne
- **Playwright**: Testy na różnych przeglądarkach
- **MSW (Mock Service Worker)**: Mockowanie API

### 6.2. Narzędzia do testów wydajnościowych
- **Lighthouse**: Testy wydajności, dostępności i PWA
- **WebPageTest**: Testy wydajności
- **Chrome DevTools**: Profilowanie i debugowanie

### 6.3. Narzędzia do testów bezpieczeństwa
- **OWASP ZAP**: Skanowanie bezpieczeństwa
- **npm audit/Snyk**: Skanowanie zależności
- **ESLint with security plugins**: Statyczna analiza kodu

### 6.4. Narzędzia do zarządzania testami
- **GitHub Issues/Projects**: Śledzenie błędów i postępów
- **GitHub Actions**: CI/CD i automatyzacja testów
- **Allure/Cypress Dashboard**: Raportowanie wyników testów

## 7. Harmonogram testów

### 7.1. Faza przygotowawcza (2 tygodnie)
- Opracowanie szczegółowych przypadków testowych
- Konfiguracja środowiska testowego
- Przygotowanie danych testowych
- Konfiguracja narzędzi automatyzacji

### 7.2. Faza implementacji testów (3 tygodnie)
- Implementacja testów jednostkowych
- Implementacja testów integracyjnych
- Implementacja testów E2E
- Konfiguracja CI/CD dla testów automatycznych

### 7.3. Faza wykonywania testów (ciągła)
- Uruchamianie testów automatycznych przy każdym pull requeście
- Regularne testy eksploracyjne (raz w tygodniu)
- Testy wydajnościowe (raz na dwa tygodnie)
- Testy bezpieczeństwa (raz w miesiącu)

### 7.4. Testy akceptacyjne przed wdrożeniem (1 tydzień)
- Testy końcowe wszystkich funkcjonalności
- Testy z udziałem rzeczywistych użytkowników
- Weryfikacja zgodności z wymaganiami
- Testy bezpieczeństwa finalne

## 8. Kryteria akceptacji testów

### 8.1. Kryteria funkcjonalne
- Wszystkie krytyczne funkcjonalności działają poprawnie
- Wszystkie scenariusze testowe z priorytetem wysokim przechodzą pomyślnie
- Brak błędów krytycznych i wysokich
- Zgodność z wymaganiami biznesowymi

### 8.2. Kryteria niefunkcjonalne
- Czas ładowania strony głównej poniżej 3 sekund
- Wynik Lighthouse dla wydajności powyżej 85
- Wynik Lighthouse dla dostępności powyżej 90
- Wynik Lighthouse dla PWA powyżej 90
- Czas generowania planu podróży poniżej 15 sekund
- Aplikacja działa poprawnie na urządzeniach mobilnych

### 8.3. Kryteria regresji
- Brak nowych błędów w istniejących funkcjonalnościach
- Wszystkie testy regresji przechodzą pomyślnie

## 9. Role i odpowiedzialności w procesie testowania

### 9.1. Kierownik testów
- Nadzór nad całym procesem testowania
- Koordynacja działań zespołu testowego
- Raportowanie postępów i problemów

### 9.2. Testerzy funkcjonalni
- Wykonywanie testów funkcjonalnych
- Raportowanie znalezionych błędów
- Weryfikacja poprawek

### 9.3. Testerzy automatyzujący
- Implementacja testów automatycznych
- Utrzymanie infrastruktury testowej
- Identyfikacja obszarów do automatyzacji

### 9.4. Deweloperzy
- Implementacja testów jednostkowych
- Naprawianie znalezionych błędów
- Przegląd kodu testów automatycznych

### 9.5. DevOps
- Konfiguracja i utrzymanie środowiska testowego
- Konfiguracja CI/CD dla testów
- Monitorowanie wydajności i dostępności

## 10. Procedury raportowania błędów

### 10.1. Proces raportowania
1. Znalezienie błędu podczas testowania
2. Dokumentacja błędu (opis, kroki reprodukcji, oczekiwane/rzeczywiste zachowanie)
3. Określenie priorytetu i wagi błędu
4. Utworzenie zgłoszenia w systemie śledzenia błędów (GitHub Issues)
5. Przypisanie błędu do odpowiedzialnej osoby

### 10.2. Klasyfikacja błędów
- **Krytyczny**: Błąd uniemożliwiający działanie kluczowej funkcjonalności, brak obejścia
- **Wysoki**: Błąd znacząco wpływający na funkcjonalność, ale z możliwym obejściem
- **Średni**: Błąd w mniej krytycznej funkcjonalności, z łatwym obejściem
- **Niski**: Drobne problemy kosmetyczne, nie wpływające na funkcjonalność

### 10.3. Metryki i raportowanie
- Dzienne podsumowanie znalezionych błędów
- Tygodniowe raporty statusu testów
- Wskaźniki jakości (defect density, defect leakage)
- Czas od znalezienia do naprawy błędu

### 10.4. Obsługa incydentów
- Procedura szybkiej reakcji na krytyczne błędy
- Komunikacja z zespołem deweloperskim i kierownictwem
- Analiza przyczyn źródłowych (root cause analysis)

## Podsumowanie

Niniejszy plan testów obejmuje kompleksowe podejście do zapewnienia jakości aplikacji TripPlanner. Uwzględnia specyfikę stosu technologicznego (Astro, React, Supabase, OpenAI) oraz kluczowe funkcjonalności aplikacji. Regularne wykonywanie testów zgodnie z tym planem pozwoli na wczesne wykrywanie problemów i zapewnienie wysokiej jakości dostarczanego oprogramowania.

Elastyczność planu pozwala na jego dostosowanie w miarę rozwoju projektu i pojawiania się nowych wymagań. Kluczowym elementem sukcesu będzie ścisła współpraca zespołu testowego z zespołem deweloperskim oraz regularna weryfikacja i aktualizacja samego planu testów. 