import type { APIRoute } from "astro";
import { z } from "zod";
import { OpenRouterService } from "../../../lib/services/openrouter";

export const prerender = false;

// Schema validation for the request body
const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string(),
      name: z.string().optional(),
    })
  ),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(1).max(8192).optional(),
  top_p: z.number().min(0).max(1).optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
});

/**
 * Chat completion endpoint
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Check authentication if required
    // const user = locals.user; // Implement based on your auth mechanism

    // Parse and validate the request body
    const body = await request.json();
    const parsedBody = chatRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          details: parsedBody.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Initialize OpenRouter service
    const openRouter = new OpenRouterService({
      // API key is taken from environment vars by default
    });

    // Prepare the request parameters
    const { messages, model, ...params } = parsedBody.data;

    // Call the OpenRouter API
    const response = await openRouter.generateChatCompletion(messages, {
      model,
      params: {
        temperature: params.temperature,
        max_tokens: params.max_tokens,
        top_p: params.top_p,
        frequency_penalty: params.frequency_penalty,
        presence_penalty: params.presence_penalty,
      },
    });

    // Return the response
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Error in chat API:", error);

    return new Response(
      JSON.stringify({
        error: "Error processing request",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
