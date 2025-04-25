import { useState, useCallback, useRef } from "react";
import type { OpenRouterConfig, ChatMessage, RequestOptions, JSONSchema } from "../../../lib/services/openrouter/types";
import { OpenRouterService } from "../../../lib/services/openrouter/openrouter.service";

/**
 * React hook for using the OpenRouter service
 */
export function useOpenRouter(config?: Partial<OpenRouterConfig>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const serviceRef = useRef<OpenRouterService | null>(null);

  // Initialize service on first use
  if (!serviceRef.current) {
    try {
      serviceRef.current = new OpenRouterService(config || {});
    } catch (err) {
      console.error("Failed to initialize OpenRouter service:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Send a message to the AI and get a response
   */
  const sendMessage = useCallback(async (message: string, options?: RequestOptions): Promise<string> => {
    if (!serviceRef.current) {
      throw new Error("OpenRouter service not initialized");
    }

    setLoading(true);
    setError(null);

    try {
      const messages: ChatMessage[] = [{ role: "user", content: message }];

      if (options?.metadata?.systemMessage) {
        messages.unshift({
          role: "system",
          content: options.metadata.systemMessage as string,
        });
      }

      const response = await serviceRef.current.generateChatCompletion(messages, options);

      return response.choices[0]?.message?.content || "";
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate a structured JSON response
   */
  const generateJsonResponse = useCallback(
    async <T,>(message: string, schema: JSONSchema, options?: RequestOptions): Promise<T> => {
      if (!serviceRef.current) {
        throw new Error("OpenRouter service not initialized");
      }

      setLoading(true);
      setError(null);

      try {
        const messages: ChatMessage[] = [{ role: "user", content: message }];

        if (options?.metadata?.systemMessage) {
          messages.unshift({
            role: "system",
            content: options.metadata.systemMessage as string,
          });
        }

        return await serviceRef.current.generateStructuredResponse<T>(messages, schema, options);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Update the service configuration
   */
  const updateConfig = useCallback((newConfig: Partial<OpenRouterConfig>): void => {
    if (serviceRef.current) {
      serviceRef.current.setConfig(newConfig);
    } else {
      try {
        serviceRef.current = new OpenRouterService(newConfig);
      } catch (err) {
        console.error("Failed to initialize OpenRouter service:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  }, []);

  /**
   * Get available AI models
   */
  const getAvailableModels = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error("OpenRouter service not initialized");
    }

    setLoading(true);
    setError(null);

    try {
      return await serviceRef.current.getAvailableModels();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendMessage,
    generateJsonResponse,
    updateConfig,
    getAvailableModels,
    loading,
    error,
    service: serviceRef.current,
  };
}
