# OpenRouter Service

A modular service for integrating with the OpenRouter API, enabling communication with various AI models, handling errors, and optimizing performance.

## Features

- 🔌 Easy integration with OpenRouter API
- 🧠 Support for multiple AI models
- 🛡️ Comprehensive error handling
- 📊 JSON schema validation for structured responses
- ⚛️ React hooks for frontend integration
- 🔄 Server-side API proxy for secure communication

## Installation

The service is already integrated into the project and can be imported directly:

```typescript
import { OpenRouterService } from '@lib/services/openrouter';
```

## Usage

### Basic Usage

```typescript
import { OpenRouterService } from '@lib/services/openrouter';

// Initialize with default configuration
const openRouter = new OpenRouterService();

// Or with custom configuration
const openRouter = new OpenRouterService({
  defaultModel: 'openai/gpt-4o',
  defaultParams: {
    temperature: 0.7,
    max_tokens: 1000
  }
});

// Generate a chat completion
const response = await openRouter.generateChatCompletion([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'What is the capital of Poland?' }
]);

console.log(response.choices[0].message.content);
```

### Structured JSON Responses

Use JSON Schema to get structured, type-safe responses:

```typescript
import { OpenRouterService } from '@lib/services/openrouter';
import type { JSONSchema } from '@lib/services/openrouter';

// Define the response structure
interface CityInfo {
  name: string;
  country: string;
  population: number;
  landmarks: string[];
}

// Define the schema
const citySchema: JSONSchema = {
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
  required: ['name', 'country', 'landmarks']
};

// Get structured response
const cityInfo = await openRouter.generateStructuredResponse<CityInfo>(
  [
    { role: 'system', content: 'You are a geography expert.' },
    { role: 'user', content: 'Provide information about Warsaw in JSON format.' }
  ],
  citySchema
);

// Access the typed response
console.log(`City: ${cityInfo.name}, Country: ${cityInfo.country}`);
console.log(`Population: ${cityInfo.population}`);
console.log(`Landmarks: ${cityInfo.landmarks.join(', ')}`);
```

### React Hook Integration

Use the included React hook for easy frontend integration:

```tsx
import { useOpenRouter } from '@components/hooks/pwa/useOpenRouter';

function ChatComponent() {
  const { sendMessage, loading, error } = useOpenRouter({
    defaultModel: 'anthropic/claude-3-sonnet'
  });
  
  const handleSend = async (userMessage: string) => {
    try {
      const response = await sendMessage(userMessage);
      // Handle the response
    } catch (err) {
      // Handle errors
    }
  };
  
  return (
    <div>
      {/* Your chat UI */}
      <button onClick={() => handleSend('Hello AI')} disabled={loading}>
        Send
      </button>
      {error && <p>{error.message}</p>}
    </div>
  );
}
```

## API Reference

### `OpenRouterService`

The main service class for interacting with OpenRouter API.

#### Constructor

```typescript
constructor(config?: OpenRouterConfig)
```

#### Configuration Options

```typescript
interface OpenRouterConfig {
  apiKey?: string;          // API key (defaults to OPENROUTER_API_KEY env variable)
  defaultModel?: string;    // Default model (defaults to 'openai/gpt-3.5-turbo')
  apiUrl?: string;          // API URL (defaults to 'https://openrouter.ai/api/v1')
  defaultParams?: {         // Default parameters for requests
    temperature?: number;   // Controls randomness (0-1)
    max_tokens?: number;    // Maximum tokens in the response
    top_p?: number;         // Nucleus sampling (0-1)
    frequency_penalty?: number; // Penalty for token frequency (-2 to 2)
    presence_penalty?: number;  // Penalty for new tokens (-2 to 2)
    timeout_ms?: number;    // Request timeout in milliseconds
  };
  httpClient?: HttpClient;  // Custom HTTP client implementation
  logger?: Logger;          // Custom logger implementation
}
```

#### Methods

##### `setConfig(config: Partial<OpenRouterConfig>): void`

Update service configuration.

##### `setDefaultModel(model: string): void`

Change the default model.

##### `async getAvailableModels(): Promise<OpenRouterModel[]>`

Get available models from OpenRouter.

##### `async generateChatCompletion(messages: ChatMessage[], options?: RequestOptions): Promise<ChatCompletionResponse>`

Generate a chat completion response.

##### `async generateCompletion(prompt: string, options?: RequestOptions): Promise<CompletionResponse>`

Generate a completion for a prompt.

##### `async generateStructuredResponse<T>(messages: ChatMessage[], jsonSchema: JSONSchema, options?: RequestOptions): Promise<T>`

Generate a structured JSON response that conforms to the provided schema.

## Error Handling

The service includes comprehensive error handling with specific error classes:

- `OpenRouterError` - Base error class
- `OpenRouterApiError` - API-related errors
- `OpenRouterConfigError` - Configuration errors
- `OpenRouterSchemaValidationError` - JSON schema validation errors
- `OpenRouterTimeoutError` - Request timeout errors
- `OpenRouterNetworkError` - Network-related errors
- `OpenRouterRateLimitError` - Rate limit exceeded errors

Example:

```typescript
import { OpenRouterService, OpenRouterApiError } from '@lib/services/openrouter';

try {
  const response = await openRouter.generateChatCompletion([...]);
} catch (error) {
  if (error instanceof OpenRouterApiError) {
    console.error(`API Error (${error.statusCode}): ${error.message}`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Server Integration

For server-side usage, a proxy endpoint is available at `/api/ai/chat` to protect your API key and provide additional validation:

```typescript
// API route usage example
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Hello, AI!' }
    ],
    model: 'anthropic/claude-3-haiku',
    temperature: 0.7,
    max_tokens: 500
  })
});

const data = await response.json();
```

## License

This service is part of the main project and is governed by the project's license. 