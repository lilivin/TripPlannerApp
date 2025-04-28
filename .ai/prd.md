# Dokument wymagań produktu (PRD) – TripPlanner (MVP)

## 1. Przegląd produktu
Aplikacja TripPlanner umożliwia użytkownikom tworzenie spersonalizowanych planów wycieczek na bazie istniejących przewodników tworzonych przez różnych twórców. W odróżnieniu od rozwiązań opartych wyłącznie na „miastach", każdy przewodnik może dotyczyć wybranej lokacji (np. Warszawa) i zawierać autorskie, rozbudowane opisy atrakcji oraz sugestie dotyczące zwiedzania. 

Kluczowym elementem aplikacji jest integracja z API OpenAI, która służy do generowania angażujących i zoptymalizowanych tras. Użytkownik dokonuje wyboru przewodnika (np. „Wycieczka śladami historii Warszawy" lub „Warszawa dla fanów street artu") i na podstawie danych z przewodnika tworzy spersonalizowany plan w aplikacji. 

W ramach MVP aplikacja powinna zapewnić:
- Dostęp do listy dostępnych przewodników twórców (przewodnik = opis atrakcji i innych wskazówek).
- Generowanie planu wycieczki z wykorzystaniem AI, bazując na wybranym przewodniku.
- Intuicyjny, responsywny interfejs webowy (PWA) z obsługą trybu offline dla zapisanych planów.
- Logowanie użytkowników oraz przechowywanie wygenerowanych planów w backendzie (Supabase).
- Możliwość oceniania i recenzowania przewodników przez użytkowników.

## 2. Problem użytkownika
- Użytkownicy chcą mieć wybór spośród wielu przewodników (np. kilku różnych twórców, różne podejścia do zwiedzania tego samego miasta).
- Część dostępnych narzędzi turystycznych jest ograniczona do jednej „oficjalnej" wersji trasy — brak różnorodności, która odpowiadałaby potrzebom konkretnych osób.
- Brakuje prostego sposobu na wybranie przewodnika, który najlepiej odpowiada zainteresowaniom użytkownika, a następnie na wygodne dostosowanie i generowanie spersonalizowanego planu.
- Potrzebna jest możliwość przechowywania planów w profilu użytkownika tak, aby można było do nich wrócić w dowolnym momencie.
- Użytkownicy potrzebują dostępu do planów wycieczek w trybie offline podczas podróży, gdy dostęp do internetu może być ograniczony.
- Brak możliwości filtrowania dostępnych przewodników według preferencji i potrzeb użytkownika.

## 3. Wymagania funkcjonalne
1. Integracja z API OpenAI w celu generowania angażujących opisów tras i automatycznego dobierania atrakcji z wybranego przewodnika.
2. Pobieranie listy dostępnych przewodników (z bazy Supabase):
   - Tytuł przewodnika (np. „Warszawa – Street Art").
   - Krótkie wprowadzenie i słowo od twórcy.
   - Szczegółowy opis atrakcji (zawartość przewodnika) i ewentualna galeria zdjęć.
   - Filtrowanie przewodników (twórcy, lokalizacje, języki, tagi tematyczne).
   - Oceny i recenzje innych użytkowników.
3. Generowanie zoptymalizowanego planu na podstawie wybranego przewodnika:
   - Uwzględnienie czasu trwania wycieczki (liczba dni).
   - Użycie danych z przewodnika, np. listy atrakcji, sugerowanych środków transportu.
   - Możliwość określenia godzin rozpoczęcia i zakończenia zwiedzania.
   - Opcja ustawienia tempa zwiedzania.
   - Możliwość filtrowania typów atrakcji (uwzględnianie lub wykluczanie).
4. Logowanie i zarządzanie kontem użytkownika:
   - Rejestracja i logowanie realizowane na dedykowanych stronach (integracja z Supabase Auth).
   - Logowanie wymaga podania wyłącznie adresu email i hasła.
   - Rejestracja wymaga podania adresu email, hasła i potwierdzenia hasła.
   - Możliwość odzyskiwania hasła przez użytkownika.
   - Użytkownik niezalogowany może przeglądać dostępne przewodniki, ale nie może zobaczyć szczegółów atrakcji, kupić przewodników ani stworzyć planu.
   - Przycisk logowania/wylogowania dostępny w prawym górnym rogu interfejsu.
   - Brak integracji z zewnętrznymi serwisami logowania (np. Google, GitHub).
   - Przechowywanie planów w profilu użytkownika.
   - Wybór języka interfejsu (polski/angielski).
   - Zarządzanie dostępem do przewodników (w tym płatnych w przyszłych wersjach).
5. Prezentacja spersonalizowanego planu:
   - Intuicyjny interfejs mobilny (PWA).
   - Podgląd szczegółów atrakcji, ułożenia trasy czy rekomendacji czasowych.
   - Interaktywna mapa z zaznaczonymi punktami i trasami.
   - Możliwość edycji planu (kolejność atrakcji, usuwanie, dodawanie notatek).
   - Oznaczanie ulubionych planów.
6. Obsługa trybu offline:
   - Oznaczanie planów do dostępu offline.
   - Przechowywanie danych w lokalnej pamięci urządzenia.
   - Wskaźnik statusu synchronizacji.
7. System ocen i recenzji:
   - Możliwość wystawiania ocen (1-5) dla przewodników.
   - Dodawanie tekstowych recenzji.
   - Przeglądanie recenzji innych użytkowników.
8. Przechowywanie danych w Supabase:
   - Bezpieczne przechowywanie przewodników twórców i wygenerowanych planów.
   - Skalowalna struktura bazy danych (z myślą o przyszłym wersjonowaniu treści).
   - Implementacja Row-Level Security (RLS) dla zapewnienia bezpieczeństwa danych.
9. Podstawowe narzędzia analityczne (w kolejnych etapach rozwoju):
   - Pomiar retencji użytkowników.
   - Pomiar czasu spędzonego w aplikacji.
   - W początkowej wersji wystarczą proste metryki (np. integracja z zewnętrznym narzędziem).

## 4. Granice produktu
- Poza zakresem MVP:
  - Zaawansowana personalizacja planu w czasie rzeczywistym (np. uwzględnianie pogody).
  - Funkcja tekst-na-mowę (generowanie głosowych opisów atrakcji).
  - Integracja z systemami rezerwacyjnymi i płatności (Stripe).
  - Rozbudowany system komunikacji z twórcami przewodników.
  - Rozbudowany panel administracyjny dla twórców treści.
  - Automatyczne testy spójności bazy danych i weryfikacja treści.
  - Zaawansowane funkcje geolokalizacyjne.

## 5. Historyjki użytkowników

### US-001
- Tytuł: Rejestracja nowego użytkownika
- Opis: Jako nowy użytkownik chcę założyć konto w aplikacji, aby móc tworzyć i zapisywać swoje plany wycieczek.
- Kryteria akceptacji:
  - Aplikacja udostępnia dedykowaną stronę rejestracji z formularzem zawierającym pola: adres email, hasło i potwierdzenie hasła.
  - System waliduje format adresu email oraz zgodność haseł.
  - Po wypełnieniu formularza rejestracji system tworzy konto z unikalnym identyfikatorem.
  - System zwraca komunikat potwierdzający pomyślną rejestrację.
  - Dane logowania są bezpiecznie przechowywane w bazie (Supabase).
  - System weryfikuje adres email użytkownika.
  - Aplikacja nie oferuje rejestracji przez zewnętrzne serwisy jak Google czy GitHub.

### US-002
- Tytuł: Logowanie użytkownika
- Opis: Jako zarejestrowany użytkownik chcę móc się zalogować, aby mieć dostęp do swojego prywatnego konta i zapisanych planów.
- Kryteria akceptacji:
  - Aplikacja udostępnia dedykowaną stronę logowania z formularzem zawierającym pola: adres email i hasło.
  - Przycisk logowania jest widoczny w prawym górnym rogu interfejsu dla niezalogowanych użytkowników.
  - Po wprowadzeniu prawidłowych danych użytkownik zostaje zalogowany.
  - Użytkownik uzyskuje dostęp do sekcji prywatnej aplikacji (np. „Moje plany").
  - W przypadku błędnych danych logowania system wyświetla stosowny komunikat.
  - System oferuje opcję "Zapomniałem hasła" umożliwiającą odzyskanie dostępu do konta.
  - Aplikacja nie oferuje logowania przez zewnętrzne serwisy jak Google czy GitHub.

### US-003
- Tytuł: Przegląd listy dostępnych przewodników
- Opis: Jako użytkownik chcę zobaczyć listę dostępnych przewodników twórców, abym mógł wybrać ten, który mnie najbardziej interesuje.
- Kryteria akceptacji:
  - Po wybraniu opcji „Dostępne przewodniki" aplikacja wyświetla listę pobraną z bazy (Supabase).
  - Każdy przewodnik zawiera podstawowe informacje (tytuł, krótki opis, autor, ocena).
  - System umożliwia filtrowanie przewodników według lokalizacji, języka, twórcy i tagów.
  - System obsługuje paginację listy przewodników.
  - Jeśli lista jest pusta, aplikacja wyświetla komunikat o braku dostępnych przewodników.
  - Niezalogowani użytkownicy mogą przeglądać listę przewodników, ale bez możliwości zobaczenia szczegółów atrakcji, zakupu przewodników ani tworzenia planów.

### US-004
- Tytuł: Wyświetlenie szczegółów wybranego przewodnika
- Opis: Jako użytkownik chcę móc zobaczyć więcej informacji o wybranym przewodniku, aby ocenić, czy będzie dla mnie odpowiedni.
- Kryteria akceptacji:
  - Po kliknięciu wybranego przewodnika aplikacja pobiera i prezentuje szczegółowe informacje (pełny opis, listę atrakcji, zdjęcia).
  - Użytkownik widzi nazwę twórcy przewodnika i może zapoznać się z proponowaną trasą.
  - System wyświetla oceny i recenzje innych użytkowników.
  - Użytkownik może zobaczyć informacje o atrakcjach zawartych w przewodniku.
  - Jeśli dany przewodnik nie posiada szczegółowych danych (np. brak opisów atrakcji), system wyświetla stosowny komunikat.

### US-005
- Tytuł: Generowanie zoptymalizowanego planu wycieczki na bazie przewodnika
- Opis: Jako użytkownik chcę na podstawie wybranego przewodnika uzyskać propozycję harmonogramu zwiedzania (z wykorzystaniem AI), aby w szybki sposób dopasować plan do moich potrzeb.
- Kryteria akceptacji:
  - Użytkownik podaje parametry (np. liczba dni, godziny rozpoczęcia i zakończenia, tempo zwiedzania, preferencje typów atrakcji).
  - Aplikacja wyświetla ekran ładowania podczas generowania planu.
  - Aplikacja, korzystając z API OpenAI, generuje plan zwiedzania w oparciu o szczegóły z przewodnika.
  - Plan prezentowany jest w czytelnej formie (np. z podziałem na dni i sugerowaną kolejnością).
  - Użytkownik może edytować parametry i ponownie wygenerować plan.

### US-006
- Tytuł: Podgląd i edycja wygenerowanego planu
- Opis: Jako użytkownik chcę mieć możliwość przejrzenia i edycji wygenerowanego planu przed jego zapisaniem, aby dostosować go do moich potrzeb.
- Kryteria akceptacji:
  - System wyświetla wygenerowany plan z podziałem na dni i atrakcje.
  - Użytkownik może modyfikować kolejność atrakcji (drag & drop).
  - Użytkownik może usuwać atrakcje z planu.
  - Użytkownik może dodawać notatki do poszczególnych atrakcji.
  - System umożliwia podgląd planu na mapie z zaznaczonymi atrakcjami.

### US-007
- Tytuł: Zapis planu w systemie
- Opis: Jako zalogowany użytkownik chcę zapisać wygenerowany plan, aby móc do niego wrócić w przyszłości.
- Kryteria akceptacji:
  - Po kliknięciu opcji „Zapisz plan" aplikacja przechowuje plan w bazie (Supabase).
  - Użytkownik może nadać własną nazwę swojemu planowi.
  - Zapis zawiera: nazwę wybranego przewodnika, datę utworzenia, szczegóły harmonogramu, parametry generowania.
  - Użytkownik może oznaczyć plan jako ulubiony.
  - W przypadku błędu zapisu (np. brak połączenia z bazą) wyświetlany jest odpowiedni komunikat.

### US-008
- Tytuł: Przegląd i zarządzanie zapisanymi planami
- Opis: Jako zalogowany użytkownik chcę wyświetlić wszystkie swoje zapisane plany oraz mieć opcję ich usunięcia, aby utrzymać porządek w moim profilu.
- Kryteria akceptacji:
  - Aplikacja wyświetla listę planów zapisanych przez użytkownika (nazwa planu, tytuł przewodnika, data utworzenia).
  - Użytkownik może filtrować plany (np. ulubione).
  - Użytkownik może wybrać plan, by zobaczyć szczegóły.
  - Użytkownik może usunąć plan, a system wyświetla komunikat potwierdzający usunięcie.

### US-009
- Tytuł: Szczegółowy widok planu wycieczki
- Opis: Jako użytkownik chcę zobaczyć szczegóły zapisanego planu, aby móc z niego korzystać podczas wycieczki.
- Kryteria akceptacji:
  - System wyświetla szczegółowy harmonogram z podziałem na dni.
  - Użytkownik może przełączać się między widokiem listy i mapy.
  - System pokazuje informacje o poszczególnych atrakcjach (adres, godziny otwarcia, opisy).
  - Użytkownik może edytować zapisany plan i zapisać zmiany.

### US-010
- Tytuł: Zapisanie planu do użytku offline
- Opis: Jako użytkownik chcę zaznaczyć plan jako dostępny offline, aby móc korzystać z niego bez dostępu do internetu podczas podróży.
- Kryteria akceptacji:
  - System umożliwia oznaczenie planu jako dostępnego offline.
  - Dane planu (w tym opisy atrakcji i mapy) są przechowywane lokalnie na urządzeniu.
  - Aplikacja wyświetla wskaźnik statusu synchronizacji.
  - Użytkownik ma dostęp do zapisanych planów offline nawet bez połączenia z internetem.

### US-011
- Tytuł: Dodawanie recenzji przewodnika
- Opis: Jako użytkownik chcę móc ocenić i zrecenzować przewodnik, aby podzielić się swoją opinią z innymi użytkownikami.
- Kryteria akceptacji:
  - System umożliwia wystawienie oceny (1-5 gwiazdek).
  - Użytkownik może dodać tekstowy komentarz do oceny.
  - System weryfikuje, czy użytkownik nie dodał już recenzji do tego przewodnika.
  - Po wysłaniu recenzji jest ona widoczna dla innych użytkowników.

### US-012
- Tytuł: Wyświetlenie szczegółów atrakcji
- Opis: Jako użytkownik chcę zobaczyć szczegółowe informacje o konkretnej atrakcji, aby lepiej zaplanować jej zwiedzanie i poznać jej specyfikę.
- Kryteria akceptacji:
  - System wyświetla pełny opis atrakcji.
  - Użytkownik widzi galerię zdjęć atrakcji z możliwością powiększania.
  - System prezentuje praktyczne informacje (adres, godziny otwarcia, ceny biletów, dostępność).
  - Na ekranie widoczna jest lokalizacja atrakcji na mapie.
  - Użytkownik może zobaczyć tagi kategoryzujące atrakcję.
  - System wyświetla szacowany czas zwiedzania.
  - Użytkownik może wrócić do widoku planu lub szczegółów przewodnika.

### US-013
- Tytuł: Zarządzanie profilem użytkownika
- Opis: Jako użytkownik chcę mieć możliwość zarządzania swoim profilem i preferencjami, aby dostosować aplikację do swoich potrzeb.
- Kryteria akceptacji:
  - System umożliwia zmianę danych profilu (awatar, preferencje językowe).
  - Użytkownik może przeglądać historię swoich aktywności.
  - System umożliwia zarządzanie dostępem do przewodników.

### US-014
- Tytuł: Wylogowanie z aplikacji
- Opis: Jako zalogowany użytkownik chcę mieć możliwość bezpiecznego wylogowania się z aplikacji, aby zakończyć sesję i chronić dane mojego konta.
- Kryteria akceptacji:
  - Przycisk wylogowania jest widoczny w prawym górnym rogu interfejsu dla zalogowanych użytkowników.
  - Po wybraniu opcji „Wyloguj" aplikacja unieważnia sesję (token) i przekierowuje do ekranu logowania.
  - Dane sesji są usuwane z pamięci aplikacji.
  - Po wylogowaniu użytkownik nie ma dostępu do sekcji prywatnej aplikacji.
  - System wyświetla komunikat potwierdzający pomyślne wylogowanie.

## 6. Architektura techniczna

### 6.1. Frontend
- Progressive Web App (PWA) zbudowana z wykorzystaniem nowoczesnego frameworka (np. React, Vue).
- Responsywny design działający na różnych urządzeniach, z podejściem mobile-first.
- Wykorzystanie lokalnego cache'u do obsługi trybu offline.
- Integracja z mapami (np. Leaflet/OpenStreetMap lub Google Maps).
- Komponenty UI zgodne z zasadami dostępności (a11y).

### 6.2. Backend
- API REST zbudowane zgodnie z najlepszymi praktykami.
- Integracja z Supabase dla zarządzania danymi i uwierzytelniania.
- Implementacja Row-Level Security (RLS) dla zapewnienia bezpieczeństwa danych.
- Endpointy do zarządzania użytkownikami, przewodnikami, atrakcjami i planami.
- Obsługa generowania i zarządzania planami z wykorzystaniem API OpenAI.

### 6.3. Baza danych
- Struktura bazy danych w Supabase obejmująca tabele:
  - users - dane użytkowników
  - creators - profile twórców
  - guides - przewodniki
  - attractions - atrakcje
  - guide_attractions - powiązania między przewodnikami i atrakcjami
  - tags - tagi kategoryzujące atrakcje
  - attraction_tags - powiązania między atrakcjami i tagami
  - plans - zapisane plany użytkowników
  - user_guide_access - dostęp użytkowników do przewodników
  - reviews - recenzje przewodników
  - offline_cache_status - status dostępności offline planów

### 6.4. Integracja z AI
- Wykorzystanie OpenRouter jako serwisu pośredniczącego w komunikacji z modelami AI
- Implementacja mechanizmu cache'owania odpowiedzi AI dla optymalizacji kosztów i wydajności
- Wsparcie dla zaawansowanych zapytań w formie chatu dla uzyskiwania dodatkowych informacji o atrakcjach i miejscach
- Możliwość personalizacji planów wycieczek z wykorzystaniem różnych modeli AI dostępnych przez OpenRouter

## 7. Metryki sukcesu
1. Liczba wygenerowanych planów dziennie (i zapisywanych) na bazie różnych przewodników.
2. Retencja użytkowników (powroty, korzystanie z przewodników).
3. Średni czas spędzony w aplikacji, w szczególności na przeglądaniu treści przewodników i generowanych planów.
4. Stabilność działania: minimalny wskaźnik błędów komunikacji z OpenAI oraz błędów zapisu/odczytu w Supabase.
5. Liczba planów zapisanych do użytku offline i częstotliwość ich użycia.
6. Różnorodność filtrów używanych przy wyszukiwaniu przewodników.
7. W dalszej perspektywie (poza MVP): 
   - Liczba płatnych przewodników (gdy zostanie wdrożona obsługa płatności).
   - Analiza popularności konkretnych przewodników i atrakcji.
   - Zaangażowanie użytkowników w system ocen i recenzji.
