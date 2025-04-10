# Dokument wymagań produktu (PRD) – TripPlanner (MVP)

## 1. Przegląd produktu
Aplikacja TripPlanner umożliwia użytkownikom tworzenie spersonalizowanych planów wycieczek na bazie istniejących przewodników tworzonych przez różnych twórców. W odróżnieniu od rozwiązań opartych wyłącznie na „miastach”, każdy przewodnik może dotyczyć wybranej lokacji (np. Warszawa) i zawierać autorskie, rozbudowane opisy atrakcji oraz sugestie dotyczące zwiedzania. 

Kluczowym elementem aplikacji jest integracja z API OpenAI, która służy do generowania angażujących i zoptymalizowanych tras. Użytkownik dokonuje wyboru przewodnika (np. „Wycieczka śladami historii Warszawy” lub „Warszawa dla fanów street artu”) i na podstawie danych z przewodnika tworzy spersonalizowany plan w aplikacji. 

W ramach MVP aplikacja powinna zapewnić:
- Dostęp do listy dostępnych przewodników twórców (przewodnik = opis atrakcji i innych wskazówek).
- Generowanie planu wycieczki z wykorzystaniem AI, bazując na wybranym przewodniku.
- Intuicyjny, responsywny interfejs webowy (PWA).
- Logowanie użytkowników oraz przechowywanie wygenerowanych planów w backendzie (Supabase).

## 2. Problem użytkownika
- Użytkownicy chcą mieć wybór spośród wielu przewodników (np. kilku różnych twórców, różne podejścia do zwiedzania tego samego miasta).
- Część dostępnych narzędzi turystycznych jest ograniczona do jednej „oficjalnej” wersji trasy — brak różnorodności, która odpowiadałaby potrzebom konkretnych osób.
- Brakuje prostego sposobu na wybranie przewodnika, który najlepiej odpowiada zainteresowaniom użytkownika, a następnie na wygodne dostosowanie i generowanie spersonalizowanego planu.
- Potrzebna jest możliwość przechowywania planów w profilu użytkownika tak, aby można było do nich wrócić w dowolnym momencie.

## 3. Wymagania funkcjonalne
1. Integracja z API OpenAI w celu generowania angażujących opisów tras i automatycznego dobierania atrakcji z wybranego przewodnika.
2. Pobieranie listy dostępnych przewodników (z bazy Supabase):
   - Tytuł przewodnika (np. „Warszawa – Street Art”).
   - Krótkie wprowadzenie i słowo od twórcy.
   - Szczegółowy opis atrakcji (zawartość przewodnika) i ewentualna galeria zdjęć.
3. Generowanie zoptymalizowanego planu na podstawie wybranego przewodnika:
   - Uwzględnienie czasu trwania wycieczki (liczba dni).
   - Użycie danych z przewodnika, np. listy atrakcji, sugerowanych środków transportu.
4. Logowanie i zarządzanie kontem użytkownika:
   - Rejestracja i logowanie.
   - Przechowywanie planów w profilu użytkownika.
5. Prezentacja spersonalizowanego planu:
   - Intuicyjny interfejs mobilny (PWA).
   - Podgląd szczegółów atrakcji, ułożenia trasy czy rekomendacji czasowych.
6. Przechowywanie danych w Supabase:
   - Bezpieczne przechowywanie przewodników twórców i wygenerowanych planów.
   - Skalowalna struktura bazy danych (z myślą o przyszłym wersjonowaniu treści).
7. Podstawowe narzędzia analityczne (w kolejnych etapach rozwoju):
   - Pomiar retencji użytkowników.
   - Pomiar czasu spędzonego w aplikacji.
   - W początkowej wersji wystarczą proste metryki (np. integracja z zewnętrznym narzędziem).

## 4. Granice produktu
- Poza zakresem MVP:
  - Zaawansowana personalizacja planu w czasie rzeczywistym (np. uwzględnianie pogody).
  - Funkcja tekst-na-mowę (generowanie głosowych opisów atrakcji).
  - Integracja z systemami rezerwacyjnymi i płatności (Stripe).
  - Rozbudowany system komunikacji z twórcami przewodników (komentarze, recenzje, moderacja treści).
  - Rozszerzona obsługa trybu offline.
  - Automatyczne testy spójności bazy danych i weryfikacja treści.

## 5. Historyjki użytkowników

### US-001
- Tytuł: Rejestracja nowego użytkownika
- Opis: Jako nowy użytkownik chcę założyć konto w aplikacji, aby móc tworzyć i zapisywać swoje plany wycieczek.
- Kryteria akceptacji:
  - Po wypełnieniu formularza rejestracji system tworzy konto z unikalnym identyfikatorem.
  - System zwraca komunikat potwierdzający pomyślną rejestrację.
  - Dane logowania są bezpiecznie przechowywane w bazie (Supabase).

### US-002
- Tytuł: Logowanie użytkownika
- Opis: Jako zarejestrowany użytkownik chcę móc się zalogować, aby mieć dostęp do swojego prywatnego konta i zapisanych planów.
- Kryteria akceptacji:
  - Po wprowadzeniu prawidłowych danych użytkownik zostaje zalogowany.
  - Użytkownik uzyskuje dostęp do sekcji prywatnej aplikacji (np. „Moje plany”).
  - W przypadku błędnych danych logowania system wyświetla stosowny komunikat.

### US-003
- Tytuł: Przegląd listy dostępnych przewodników
- Opis: Jako użytkownik chcę zobaczyć listę dostępnych przewodników twórców, abym mógł wybrać ten, który mnie najbardziej interesuje.
- Kryteria akceptacji:
  - Po wybraniu opcji „Dostępne przewodniki” aplikacja wyświetla listę pobraną z bazy (Supabase).
  - Każdy przewodnik zawiera podstawowe informacje (tytuł, krótki opis, autor).
  - Jeśli lista jest pusta, aplikacja wyświetla komunikat o braku dostępnych przewodników.

### US-004
- Tytuł: Wyświetlenie szczegółów wybranego przewodnika
- Opis: Jako użytkownik chcę móc zobaczyć więcej informacji o wybranym przewodniku, aby ocenić, czy będzie dla mnie odpowiedni.
- Kryteria akceptacji:
  - Po kliknięciu wybranego przewodnika aplikacja pobiera i prezentuje szczegółowe informacje (pełny opis, listę atrakcji, zdjęcia).
  - Użytkownik widzi nazwę twórcy przewodnika i może zapoznać się z proponowaną trasą.
  - Jeśli dany przewodnik nie posiada szczegółowych danych (np. brak opisów atrakcji), system wyświetla stosowny komunikat.

### US-005
- Tytuł: Generowanie zoptymalizowanego planu wycieczki na bazie przewodnika
- Opis: Jako użytkownik chcę na podstawie wybranego przewodnika uzyskać propozycję harmonogramu zwiedzania (z wykorzystaniem AI), aby w szybki sposób dopasować plan do moich potrzeb.
- Kryteria akceptacji:
  - Użytkownik podaje parametry (np. liczba dni, preferencje typów atrakcji).
  - Aplikacja, korzystając z API OpenAI, generuje plan zwiedzania w oparciu o szczegóły z przewodnika.
  - Plan prezentowany jest w czytelnej formie (np. z podziałem na dni i sugerowaną kolejnością).
  - Użytkownik może edytować parametry (np. liczbę dni) i ponownie wygenerować plan.

### US-006
- Tytuł: Zapis planu w systemie
- Opis: Jako zalogowany użytkownik chcę zapisać wygenerowany plan, aby móc do niego wrócić w przyszłości.
- Kryteria akceptacji:
  - Po kliknięciu opcji „Zapisz plan” aplikacja przechowuje plan w bazie (Supabase).
  - Zapis zawiera: nazwę wybranego przewodnika, datę utworzenia, szczegóły harmonogramu.
  - W przypadku błędu zapisu (np. brak połączenia z bazą) wyświetlany jest odpowiedni komunikat.

### US-007
- Tytuł: Przegląd i zarządzanie zapisanymi planami
- Opis: Jako zalogowany użytkownik chcę wyświetlić wszystkie swoje zapisane plany oraz mieć opcję ich usunięcia, aby utrzymać porządek w moim profilu.
- Kryteria akceptacji:
  - Aplikacja wyświetla listę planów zapisanych przez użytkownika (tytuł przewodnika, data utworzenia).
  - Użytkownik może wybrać plan, by zobaczyć szczegóły.
  - Użytkownik może usunąć plan, a system wyświetla komunikat potwierdzający usunięcie.

### US-008
- Tytuł: Wylogowanie z aplikacji
- Opis: Jako zalogowany użytkownik chcę mieć możliwość bezpiecznego wylogowania się z aplikacji, aby zakończyć sesję i chronić dane mojego konta.
- Kryteria akceptacji:
  - Po wybraniu opcji „Wyloguj” aplikacja unieważnia sesję (token) i przekierowuje do ekranu logowania.
  - Dane sesji są usuwane z pamięci aplikacji.
  - Po wylogowaniu użytkownik nie ma dostępu do sekcji prywatnej.

## 6. Metryki sukcesu
1. Liczba wygenerowanych planów dziennie (i zapisywanych) na bazie różnych przewodników.
2. Retencja użytkowników (powroty, korzystanie z przewodników).
3. Średni czas spędzony w aplikacji, w szczególności na przeglądaniu treści przewodników i generowanych planów.
4. Stabilność działania: minimalny wskaźnik błędów komunikacji z OpenAI oraz błędów zapisu/odczytu w Supabase.
5. W dalszej perspektywie (poza MVP): 
   - Liczba płatnych przewodników (gdy zostanie wdrożona obsługa płatności).
   - Analiza popularności konkretnych przewodników i atrakcji.
