 # OpenRouter Service Implementation Plan

## 1. Opis usługi

OpenRouterService to modułowa usługa zapewniająca integrację aplikacji z API OpenRouter. Umożliwia komunikację z różnymi modelami AI, obsługuje błędy i optymalizuje wydajność.

## 2. Opis konstruktora

```typescript
class OpenRouterService {
  constructor(config: OpenRouterConfig) {
    // Inicjalizacja usługi z podaną konfiguracją
  }
}

interface OpenRouterConfig {
  apiKey?: string;          // Klucz API (opcjonalnie)
  defaultModel?: string;    // Domyślny model AI
  apiUrl?: string;          // URL API (domyślnie 'https://openrouter.ai/api/v1')
  defaultParams?: ModelParams; // Domyślne parametry modeli
  httpClient?: HttpClient;  // Opcjonalny klient HTTP
  logger?: Logger;          // Opcjonalny logger
}

interface ModelParams {
  temperature?: number;     // Kontrola kreatywności (0-1)
  max_tokens?: number;      // Maksymalna długość odpowiedzi
  top_p?: number;           // Próbkowanie nukleotydów (0-1)
  frequency_penalty?: number; // Kara za powtórzenia (-2 do 2)
  presence_penalty?: number;  // Kara za nowe tokeny (-2 do 2)
  timeout_ms?: number;      // Timeout żądania
}
```

## 3. Publiczne metody i pola

### 3.1. Konfiguracja

```typescript
// Aktualizacja konfiguracji
setConfig(config: Partial<OpenRouterConfig>): void

// Zmiana domyślnego modelu
setDefaultModel(model: string): void

// Pobranie dostępnych modeli
async getAvailableModels(): Promise<OpenRouterModel[]>
```

### 3.2. Główne metody

```typescript
// Generowanie odpowiedzi czatu
async generateChatCompletion(
  messages: ChatMessage[],
  options?: RequestOptions
): Promise<ChatCompletionResponse>

// Generowanie odpowiedzi na prompt
async generateCompletion(
  prompt: string,
  options?: RequestOptions
): Promise<CompletionResponse>

// Generowanie odpowiedzi JSON
async generateStructuredResponse<T>(
  messages: ChatMessage[],
  jsonSchema: JSONSchema,
  options?: RequestOptions
): Promise<T>

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

interface RequestOptions {
  model?: string;              // Model
  params?: Partial<ModelParams>; // Parametry
  responseFormat?: ResponseFormat; // Format odpowiedzi
  metadata?: Record<string, any>; // Metadane
  abortSignal?: AbortSignal;   // Sygnał anulowania
}

interface ResponseFormat {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: Record<string, any>;
  }
}
```

### 3.3. Integracja z React

```typescript
// Hook React dla OpenRouter
function useOpenRouter(config?: Partial<OpenRouterConfig>): {
  sendMessage: (message: string, options?: RequestOptions) => Promise<string>;
  generateJsonResponse: <T>(message: string, schema: JSONSchema) => Promise<T>;
  loading: boolean;
  error: Error | null;
}
```

## 4. Prywatne metody i pola

```typescript
// Klient HTTP
private httpClient: HttpClient;

// Logger
private logger: Logger;

// Przygotowanie parametrów żądania
private prepareRequestParams(options?: RequestOptions): RequestParams;

// Przetwarzanie odpowiedzi API
private processApiResponse(response: any): ChatCompletionResponse;

// Obsługa błędów API
private handleApiError(error: any): never;

// Ekstrakcja JSON z odpowiedzi
private extractJsonFromResponse(text: string): any;
```

## 5. Obsługa błędów

### 5.1. Typy błędów

```typescript
// Klasy błędów:
class OpenRouterError extends Error { /* ... */ }
class OpenRouterApiError extends OpenRouterError { /* ... */ }
class OpenRouterConfigError extends OpenRouterError { /* ... */ }
class OpenRouterSchemaValidationError extends OpenRouterError { /* ... */ }
class OpenRouterTimeoutError extends OpenRouterError { /* ... */ }
```

### 5.2. Strategie obsługi

1. **Automatyczne ponowne próby** - dla błędów sieciowych i błędów 429/500/503
2. **Degradacja modelu** - przełączanie na lżejsze modele w razie potrzeby
3. **Obsługa limitów** - elegancka obsługa limitów API
4. **Szczegółowe logi** - rejestrowanie błędów z metadanymi
5. **Przyjazne komunikaty** - czytelne komunikaty dla użytkownika

## 6. Kwestie bezpieczeństwa

1. **Bezpieczna obsługa kluczy API**:
   - Używanie zmiennych środowiskowych
   - Proxy API po stronie serwera

2. **Walidacja danych wejściowych**:
   - Walidacja przed wysłaniem do API
   - Sanityzacja danych

3. **Kontrola dostępu**:
   - Kontrola dostępu per wywołanie
   - Ograniczenia na podstawie ról

4. **Rejestrowanie użycia**:
   - Audyt wywołań API
   - Monitorowanie wzorców użycia

5. **Limity użycia**:
   - Limity na użytkownika/sesję
   - Monitoring kosztów

## 7. Plan wdrożenia krok po kroku

### Krok 1: Konfiguracja środowiska

1. Dodanie zmiennych środowiskowych:
   ```
   OPENROUTER_API_KEY=your_api_key
   OPENROUTER_API_URL=https://openrouter.ai/api/v1
   ```

2. Aktualizacja typów w `src/env.d.ts` (już istnieje):
   ```typescript
   interface ImportMetaEnv {
     readonly OPENROUTER_API_KEY: string;
     // ...
   }
   ```

### Krok 2: Podstawowa struktura

1. Utworzenie pliku `src/lib/services/openrouter/types.ts` z typami
2. Utworzenie pliku `src/lib/services/openrouter/errors.ts` z klasami błędów
3. Implementacja klienta HTTP w `src/lib/services/openrouter/http-client.ts`

### Krok 3: Główna usługa

1. Utworzenie `src/lib/services/openrouter/openrouter.service.ts`:
   ```typescript
   import { OpenRouterConfig, RequestOptions, ChatMessage } from './types';
   import { HttpClient } from './http-client';
   import { OpenRouterError, OpenRouterApiError } from './errors';

   export class OpenRouterService {
     private apiKey: string;
     private apiUrl: string;
     private defaultModel: string;
     private defaultParams: ModelParams;
     private httpClient: HttpClient;
     private logger: Logger;

     constructor(config: OpenRouterConfig) {
       // Inicjalizacja
     }

     // Implementacja metod...
   }
   ```

2. Implementacja obsługi JSON Schema:
   ```typescript
   async generateStructuredResponse<T>(
     messages: ChatMessage[],
     jsonSchema: JSONSchema,
     options?: RequestOptions
   ): Promise<T> {
     const responseFormat = {
       type: 'json_schema',
       json_schema: {
         name: jsonSchema.title || 'ResponseSchema',
         strict: true,
         schema: jsonSchema
       }
     };
     
     const response = await this.generateChatCompletion(
       messages,
       { ...options, responseFormat }
     );
     
     // Parsowanie i walidacja JSON
     return this.parseAndValidateJson<T>(response.choices[0].message.content, jsonSchema);
   }
   ```

### Krok 4: Integracja z React

1. Utworzenie hooka w `src/components/hooks/pwa/useOpenRouter.tsx`:
   ```typescript
   import { useState, useCallback } from 'react';
   import { OpenRouterService } from '../../../lib/services/openrouter/openrouter.service';

   export function useOpenRouter(config?: Partial<OpenRouterConfig>) {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<Error | null>(null);
     
     // Implementacja metod...
     
     return { sendMessage, generateJsonResponse, loading, error };
   }
   ```

### Krok 5: Integracja z API

1. Utworzenie endpointu proxy w `src/pages/api/ai/chat.ts`:
   ```typescript
   import type { APIRoute } from 'astro';
   import { OpenRouterService } from '../../../lib/services/openrouter/openrouter.service';
   import { z } from 'zod';

   // Schema walidacji...

   export const POST: APIRoute = async ({ request, locals }) => {
     try {
       // Walidacja i autoryzacja...
       
       // Inicjalizacja OpenRouterService...
       
       // Wywołanie API...
       
       // Zwrócenie odpowiedzi...
     } catch (err: any) {
       // Obsługa błędów...
     }
   };
   ```

### Krok 6: Testowanie i dokumentacja

1. Utworzenie testów dla głównych funkcji
2. Utworzenie dokumentacji z przykładami

### Krok 7: Integracja z istniejącym kodem

1. Refaktoryzacja funkcji `generatePlan`:
   ```typescript
   export async function generatePlan(
     supabase: SupabaseClient,
     guide: GuideDetailDto,
     command: GeneratePlanCommand,
     userId: string
   ): Promise<GeneratePlanResponse> {
     // Przygotowanie promptu
     
     // Inicjalizacja OpenRouterService
     
     // Definicja schematu JSON
     
     // Wywołanie API z formatowaniem JSON
     
     // Zwrócenie odpowiedzi
   }
   ```

## 8. Przykłady implementacji

### Przykład 1: Podstawowe użycie

```typescript
// Inicjalizacja
const openRouter = new OpenRouterService({
  defaultModel: 'openai/gpt-4o'
});

// Komunikacja
const response = await openRouter.generateChatCompletion([
  { role: 'system', content: 'Jesteś pomocnym asystentem.' },
  { role: 'user', content: 'Jaka jest stolica Polski?' }
]);

// Wynik
console.log(response.choices[0].message.content);
```

### Przykład 2: Strukturyzowana odpowiedź JSON

```typescript
// Definicja schematu
const citySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    population: { type: 'number' },
    country: { type: 'string' },
    landmarks: { 
      type: 'array', 
      items: { type: 'string' } 
    }
  },
  required: ['name', 'country']
};

// Żądanie strukturyzowane
const cityInfo = await openRouter.generateStructuredResponse(
  [
    { role: 'system', content: 'Odpowiadaj w formacie JSON.' },
    { role: 'user', content: 'Podaj informacje o Warszawie.' }
  ],
  citySchema
);

// Odpowiedź będzie zgodna ze schematem
console.log(cityInfo.name); // "Warszawa"
console.log(cityInfo.landmarks); // ["Pałac Kultury i Nauki", ...]
```

### Przykład 3: Hook React

```tsx
function ChatComponent() {
  const { sendMessage, loading, error } = useOpenRouter();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  
  const handleSend = async () => {
    try {
      const response = await sendMessage(input);
      setMessages(prev => [...prev, `Ja: ${input}`, `AI: ${response}`]);
      setInput('');
    } catch (err) {
      console.error('Błąd czatu:', err);
    }
  };
  
  return (
    <div>
      {messages.map((msg, i) => <p key={i}>{msg}</p>)}
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        disabled={loading} 
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Wysyłanie...' : 'Wyślij'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </div>
  );
}
```

## 9. Podsumowanie

OpenRouterService zapewnia:
- Elastyczną konfigurację modeli i parametrów
- Zaawansowaną obsługę błędów
- Wsparcie dla odpowiedzi JSON
- Integrację z React
- Bezpieczną obsługę kluczy API
- Dokumentację i przykłady użycia

Wdrożenie zgodnie z powyższym planem zapewni solidną i elastyczną integrację z OpenRouter, która może być rozwijana w miarę postępu projektu.