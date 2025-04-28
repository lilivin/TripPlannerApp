# Specyfikacja architektury modułu autentykacji dla TripPlanner

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1. Struktura stron autentykacji

#### 1.1.1. Strona logowania (/login)
- **Ścieżka**: `/src/pages/login.astro`
- **Opis**: Dedykowana strona logowania zawierająca formularz logowania oraz linki do rejestracji i odzyskiwania hasła
- **Komponenty**:
  - `LoginForm.tsx` - Interaktywny formularz React obsługujący logowanie
  - Link do rejestracji ("/register")
  - Link do odzyskiwania hasła ("/forgot-password")
- **Zachowanie**:
  - Po pomyślnym zalogowaniu przekierowanie do strony głównej (/) lub ostatnio odwiedzanej strony
  - Wyświetlanie komunikatów błędów walidacji
  - Blokowanie formularza podczas oczekiwania na odpowiedź serwera

#### 1.1.2. Strona rejestracji (/register)
- **Ścieżka**: `/src/pages/register.astro`
- **Opis**: Dedykowana strona rejestracji dla nowych użytkowników
- **Komponenty**:
  - `RegisterForm.tsx` - Interaktywny formularz React do rejestracji
  - Link do logowania dla istniejących użytkowników ("/login")
- **Zachowanie**:
  - Walidacja wprowadzonych danych przed wysłaniem formularza
  - Po pomyślnej rejestracji wyświetlenie komunikatu sukcesu i przekierowanie do strony logowania
  - Wyświetlanie komunikatów błędów walidacji

#### 1.1.3. Strona odzyskiwania hasła (/forgot-password)
- **Ścieżka**: `/src/pages/forgot-password.astro`
- **Opis**: Strona umożliwiająca użytkownikowi zresetowanie hasła przez wysłanie linku resetującego na adres email
- **Komponenty**:
  - `ForgotPasswordForm.tsx` - Formularz do wprowadzenia adresu email
- **Zachowanie**:
  - Po wprowadzeniu adresu email i wysłaniu formularza, system wyświetla komunikat potwierdzający wysłanie linku resetującego
  - Przekierowanie na stronę logowania po potwierdzeniu

#### 1.1.4. Strona resetowania hasła (/reset-password)
- **Ścieżka**: `/src/pages/reset-password.astro`
- **Opis**: Strona resetowania hasła dostępna z linku otrzymanego na email
- **Komponenty**:
  - `ResetPasswordForm.tsx` - Formularz do wprowadzenia nowego hasła i jego potwierdzenia
- **Zachowanie**:
  - Walidacja tokenu resetującego hasło w parametrze URL
  - Po pomyślnym resetowaniu hasła przekierowanie do strony logowania
  - Wyświetlanie odpowiednich komunikatów błędów

### 1.2. Komponenty UI dla autentykacji

#### 1.2.1. LoginForm.tsx
- **Ścieżka**: `/src/components/auth/LoginForm.tsx`
- **Opis**: Interaktywny formularz React do logowania użytkownika
- **Pola formularza**:
  - Email (wymagane, walidacja formatu)
  - Hasło (wymagane, minimalna długość 6 znaków)
  - Przycisk "Zaloguj się"
- **Zachowanie**:
  - Obsługa walidacji formularza w czasie rzeczywistym
  - Wykorzystanie Zod do walidacji danych formularza
  - Wyświetlanie komunikatów błędów pod polami formularza
  - Obsługa stanu ładowania podczas uwierzytelniania
  - Przekazywanie danych do Supabase Auth poprzez API

#### 1.2.2. RegisterForm.tsx
- **Ścieżka**: `/src/components/auth/RegisterForm.tsx`
- **Opis**: Interaktywny formularz React do rejestracji nowego użytkownika
- **Pola formularza**:
  - Email (wymagane, walidacja formatu)
  - Hasło (wymagane, minimalna długość 6 znaków)
  - Potwierdzenie hasła (wymagane, musi być zgodne z hasłem)
  - Przycisk "Zarejestruj się"
- **Zachowanie**:
  - Obsługa walidacji formularza w czasie rzeczywistym
  - Wykorzystanie Zod do walidacji danych formularza
  - Wyświetlanie komunikatów błędów pod polami formularza
  - Obsługa stanu ładowania podczas rejestracji
  - Przekazywanie danych do Supabase Auth poprzez API

#### 1.2.3. ForgotPasswordForm.tsx
- **Ścieżka**: `/src/components/auth/ForgotPasswordForm.tsx`
- **Opis**: Formularz React do wprowadzenia adresu email dla odzyskiwania hasła
- **Pola formularza**:
  - Email (wymagane, walidacja formatu)
  - Przycisk "Wyślij link resetujący"
- **Zachowanie**:
  - Walidacja adresu email
  - Obsługa stanu ładowania podczas wysyłania zgłoszenia
  - Wyświetlanie komunikatu potwierdzającego wysłanie linku resetującego

#### 1.2.4. ResetPasswordForm.tsx
- **Ścieżka**: `/src/components/auth/ResetPasswordForm.tsx`
- **Opis**: Formularz React do wprowadzenia nowego hasła podczas resetowania
- **Pola formularza**:
  - Nowe hasło (wymagane, minimalna długość 6 znaków)
  - Potwierdzenie nowego hasła (wymagane, musi być zgodne z hasłem)
  - Przycisk "Zresetuj hasło"
- **Zachowanie**:
  - Walidacja zgodności haseł
  - Obsługa stanu ładowania podczas resetowania hasła
  - Wyświetlanie komunikatu potwierdzającego pomyślne zresetowanie hasła

#### 1.2.5. AuthLayout.astro
- **Ścieżka**: `/src/layouts/AuthLayout.astro`
- **Opis**: Wspólny layout dla wszystkich stron związanych z autentykacją
- **Struktura**:
  - Logo aplikacji
  - Nagłówek strony
  - Kontener formularza z miejscem na formularz (slot)
  - Stopka z linkami do regulaminu i polityki prywatności
- **Style**: Minimalistyczny, responsywny design z wykorzystaniem Tailwind CSS

### 1.3. Integracja z istniejącym interfejsem

#### 1.3.1. Modyfikacja MainLayout.astro
- **Zmiany**:
  - Dodanie warunkowej logiki sprawdzającej status autentykacji użytkownika
  - Dynamiczne wyświetlanie przycisku "Zaloguj się" / "Wyloguj się" w prawym górnym rogu
  - Dodanie menu rozwijanego dla zalogowanego użytkownika z opcjami: "Mój profil", "Moje plany", "Wyloguj się"

#### 1.3.2. Komponent UserMenuDropdown.tsx
- **Ścieżka**: `/src/components/auth/UserMenuDropdown.tsx`
- **Opis**: Rozwijane menu użytkownika dostępne po zalogowaniu
- **Funkcje**:
  - Wyświetlanie nazwy użytkownika (email) i awatara
  - Odnośniki do sekcji użytkownika (profil, plany)
  - Przycisk wylogowania
  - Przełączanie języka interfejsu (polski/angielski) z zapisem preferencji w profilu użytkownika

#### 1.3.3. Komponent AuthButton.tsx
- **Ścieżka**: `/src/components/auth/AuthButton.tsx`
- **Opis**: Komponent wyświetlający odpowiedni przycisk logowania/wylogowania
- **Warianty**:
  - Dla niezalogowanego: przycisk "Zaloguj się" kierujący do strony logowania
  - Dla zalogowanego: komponent UserMenuDropdown

#### 1.3.4. Ochrona tras wymagających autentykacji
- Podejście middlewarowe do ochrony tras wymagających zalogowania użytkownika
- Mechanizm automatycznego przekierowania na stronę logowania dla nieautoryzowanych użytkowników

## 2. LOGIKA BACKENDOWA

### 2.1. Endpointy API dla autentykacji

#### 2.1.1. Endpoint logowania
- **Ścieżka**: `/src/pages/api/auth/login.ts`
- **Metoda**: POST
- **Parametry wejściowe**:
  - email (string)
  - password (string)
- **Odpowiedź**:
  - Status 200: Dane zalogowanego użytkownika i token JWT
  - Status 400: Błędne dane wejściowe
  - Status 401: Nieprawidłowe dane logowania
  - Status 500: Błąd serwera
- **Funkcje**:
  - Walidacja danych wejściowych za pomocą Zod
  - Logowanie użytkownika przez Supabase Auth
  - Aktualizacja pola `last_login_at` w tabeli `users`
  - Zwracanie tokenu JWT i danych użytkownika

#### 2.1.2. Endpoint rejestracji
- **Ścieżka**: `/src/pages/api/auth/register.ts`
- **Metoda**: POST
- **Parametry wejściowe**:
  - email (string)
  - password (string)
  - passwordConfirm (string)
- **Odpowiedź**:
  - Status 201: Potwierdzenie utworzenia konta
  - Status 400: Błędne dane wejściowe lub konto już istnieje
  - Status 500: Błąd serwera
- **Funkcje**:
  - Walidacja danych wejściowe za pomocą Zod
  - Rejestracja użytkownika przez Supabase Auth
  - Utworzenie rekordu w tabeli `users` z powiązanym id

#### 2.1.3. Endpoint wylogowania
- **Ścieżka**: `/src/pages/api/auth/logout.ts`
- **Metoda**: POST
- **Odpowiedź**:
  - Status 200: Potwierdzenie wylogowania
  - Status 500: Błąd serwera
- **Funkcje**:
  - Wylogowanie użytkownika z Supabase Auth
  - Usunięcie danych sesji

#### 2.1.4. Endpoint odzyskiwania hasła
- **Ścieżka**: `/src/pages/api/auth/forgot-password.ts`
- **Metoda**: POST
- **Parametry wejściowe**:
  - email (string)
- **Odpowiedź**:
  - Status 200: Potwierdzenie wysłania linku resetującego
  - Status 400: Błędny format adresu email
  - Status 500: Błąd serwera
- **Funkcje**:
  - Walidacja adresu email
  - Generowanie i wysyłanie linku resetującego hasło przez Supabase Auth

#### 2.1.5. Endpoint resetowania hasła
- **Ścieżka**: `/src/pages/api/auth/reset-password.ts`
- **Metoda**: POST
- **Parametry wejściowe**:
  - token (string)
  - password (string)
  - passwordConfirm (string)
- **Odpowiedź**:
  - Status 200: Potwierdzenie zresetowania hasła
  - Status 400: Błędny token lub dane wejściowe
  - Status 500: Błąd serwera
- **Funkcje**:
  - Walidacja danych wejściowych
  - Resetowanie hasła użytkownika przez Supabase Auth

#### 2.1.6. Endpoint statusu sesji
- **Ścieżka**: `/src/pages/api/auth/session.ts`
- **Metoda**: GET
- **Odpowiedź**:
  - Status 200: Dane sesji użytkownika lub null
  - Status 500: Błąd serwera
- **Funkcje**:
  - Pobieranie informacji o aktualnej sesji użytkownika
  - Zwracanie danych sesji lub null, jeśli użytkownik nie jest zalogowany

### 2.2. Middleware autentykacji

#### 2.2.1. Middleware dla chronionych stron
- **Ścieżka**: `/src/middleware/auth.ts`
- **Opis**: Middleware sprawdzające autentykację użytkownika dla chronionych ścieżek
- **Funkcje**:
  - Weryfikacja tokenu JWT z Supabase Auth
  - Przekierowanie niezalogowanych użytkowników na stronę logowania
  - Przekazywanie danych użytkownika do kontekstu strony

#### 2.2.2. Modyfikacja istniejącego middleware Supabase
- **Ścieżka**: `/src/middleware/index.ts`
- **Opis**: Rozszerzenie istniejącego middleware o dodatkową logikę autentykacji
- **Funkcje**:
  - Dodanie obsługi sprawdzania sesji użytkownika
  - Weryfikacja ważności sesji
  - Przekazywanie informacji o użytkowniku do context.locals

### 2.3. Walidacja danych

#### 2.3.1. Schematy walidacji
- **Ścieżka**: `/src/schemas/auth.schema.ts`
- **Opis**: Zdefiniowane schematy Zod do walidacji danych dla endpointów autentykacji
- **Schematy**:
  - `loginSchema` - walidacja danych logowania
  - `registerSchema` - walidacja danych rejestracji
  - `forgotPasswordSchema` - walidacja adresu email do odzyskiwania hasła
  - `resetPasswordSchema` - walidacja nowego hasła i tokenu resetującego

## 3. SYSTEM AUTENTYKACJI

### 3.1. Wykorzystanie Supabase Auth

#### 3.1.1. Konfiguracja Supabase Auth
- **Kluczowe ustawienia**:
  - Czas ważności tokenu (1 godzina)
  - Minimalna długość hasła (6 znaków)
  - Włączona rejestracja przez email
  - Włączona rotacja tokenów odświeżania
  - Włączone potwierdzanie adresu email zgodnie z wymaganiami z PRD

#### 3.1.2. Integracja z bazą danych
- **Mechanizm**:
  - Automatyczne tworzenie rekordu w tabeli `users` po rejestracji
  - Wykorzystanie polityk bezpieczeństwa Row-Level Security (RLS) dla wszystkich tabel
  - Przypisywanie uprawnień na podstawie roli (auth.role()) i identyfikatora użytkownika (auth.uid())

#### 3.1.3. Obsługa tokenów sesji
- **Mechanizm**:
  - Automatyczna wymiana tokenów JWT przez Supabase Client
  - Przechowywanie tokenów w bezpiecznych ciasteczkach HTTP-only
  - Obsługa wygasania i odświeżania tokenów

### 3.2. Serwisy autentykacji

#### 3.2.1. AuthService
- **Ścieżka**: `/src/lib/services/auth.service.ts`
- **Opis**: Główny serwis obsługujący funkcje autentykacji
- **Metody**:
  - `login(email: string, password: string): Promise<AuthResponse>` - logowanie użytkownika
  - `register(email: string, password: string): Promise<AuthResponse>` - rejestracja użytkownika
  - `logout(): Promise<void>` - wylogowanie użytkownika
  - `forgotPassword(email: string): Promise<void>` - inicjowanie procesu resetowania hasła
  - `resetPassword(token: string, password: string): Promise<void>` - resetowanie hasła
  - `getSession(): Promise<Session | null>` - pobieranie aktualnej sesji użytkownika
  - `updateUserProfile(data: ProfileUpdateData): Promise<UserProfile>` - aktualizacja profilu
  - `verifyEmail(token: string): Promise<void>` - weryfikacja adresu email użytkownika

#### 3.2.2. UserService
- **Ścieżka**: `/src/lib/services/user.service.ts`
- **Opis**: Serwis do operacji na danych użytkownika
- **Metody**:
  - `getUserProfile(userId: string): Promise<UserProfile>` - pobieranie profilu użytkownika
  - `updateUserProfile(userId: string, data: ProfileUpdateData): Promise<UserProfile>` - aktualizacja profilu
  - `updateLastLoginTimestamp(userId: string): Promise<void>` - aktualizacja czasu ostatniego logowania
  - `updateUserLanguagePreference(userId: string, language: 'pl' | 'en'): Promise<void>` - aktualizacja preferencji językowych
  - `updateUserAvatar(userId: string, avatarUrl: string): Promise<void>` - aktualizacja awatara użytkownika

### 3.3. Hooki i utility dla komponentów React

#### 3.3.1. Hook useAuth
- **Ścieżka**: `/src/components/hooks/useAuth.tsx`
- **Opis**: Hook React dostarczający informacje o stanie autentykacji i metody do zarządzania autentykacją
- **Funkcje**:
  - Udostępnianie aktualnego stanu autentykacji
  - Metody login, logout, register
  - Obsługa stanu ładowania i błędów
  - Automatyczna aktualizacja stanu przy zmianach sesji

#### 3.3.2. Komponent AuthProvider
- **Ścieżka**: `/src/components/providers/AuthProvider.tsx`
- **Opis**: Provider kontekstu autentykacji dla komponentów React
- **Funkcje**:
  - Udostępnianie kontekstu autentykacji dla wszystkich komponentów w drzewie
  - Zarządzanie globalnym stanem autentykacji
  - Automatyczne odświeżanie informacji o sesji

#### 3.3.3. Komponent ProtectedRoute
- **Ścieżka**: `/src/components/auth/ProtectedRoute.tsx`
- **Opis**: Komponent do ochrony tras wymagających autentykacji w aplikacji React
- **Funkcje**:
  - Sprawdzanie stanu autentykacji
  - Przekierowanie niezalogowanych użytkowników do strony logowania
  - Renderowanie komponentu dzieci tylko dla zalogowanych użytkowników
  - Zapamiętywanie ostatnio odwiedzanej strony dla przekierowania po zalogowaniu

### 3.4. Struktura danych profilu użytkownika

#### 3.4.1. Tabela `users`
- **Opis**: Główna tabela przechowująca dane użytkowników
- **Pola**:
  - `id` (UUID) - unikalny identyfikator, zgodny z `auth.users.id`
  - `email` (string) - adres email użytkownika
  - `created_at` (timestamp) - data utworzenia konta
  - `last_login_at` (timestamp) - data ostatniego logowania
  - `display_name` (string, optional) - nazwa wyświetlana użytkownika
  - `avatar_url` (string, optional) - URL do awatara użytkownika
  - `language_preference` (enum: 'pl' | 'en') - preferowany język interfejsu
  - `verified_email` (boolean) - status weryfikacji adresu email

#### 3.4.3. Tabela `user_guide_access`
- **Opis**: Tabela przechowująca informacje o dostępie użytkownika do przewodników
- **Pola**:
  - `id` (UUID) - unikalny identyfikator
  - `user_id` (UUID) - referencja do tabeli `users`
  - `guide_id` (UUID) - referencja do tabeli `guides`
  - `access_granted_at` (timestamp) - czas przyznania dostępu
  - `access_expires_at` (timestamp, optional) - czas wygaśnięcia dostępu (dla przewodników płatnych) 