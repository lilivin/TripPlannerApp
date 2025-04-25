/**
 * Basic usage example for the OpenRouter service
 */

import { OpenRouterService } from "../index";
import type { JSONSchema } from "../types";

// Define interfaces for response types to fix type issues
interface CityInfo {
  name: string;
  country: string;
  population?: number;
  landmarks: string[];
  facts?: string[];
}

// Initialize the service
const openRouter = new OpenRouterService({
  defaultModel: "openai/gpt-4o",
  // API key is taken from environment variables by default
});

// Simple chat completion example
async function simpleChatExample() {
  const response = await openRouter.generateChatCompletion([
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is the capital of Poland?" },
  ]);

  console.log("AI response:", response.choices[0].message.content);
}

// JSON response example
async function structuredJsonExample() {
  // Define a schema for the response
  const citySchema: JSONSchema = {
    type: "object",
    properties: {
      name: { type: "string" },
      population: { type: "number" },
      country: { type: "string" },
      landmarks: {
        type: "array",
        items: { type: "string" },
      },
      facts: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: ["name", "country", "landmarks"],
  };

  // Request with JSON schema
  const cityInfo = await openRouter.generateStructuredResponse<CityInfo>(
    [
      { role: "system", content: "You are a helpful assistant specializing in geographic information." },
      { role: "user", content: "Provide information about Warsaw in JSON format." },
    ],
    citySchema
  );

  console.log("City information:");
  console.log(`Name: ${cityInfo.name}`);
  console.log(`Country: ${cityInfo.country}`);
  console.log(`Population: ${cityInfo.population || "Not provided"}`);
  console.log(`Landmarks: ${cityInfo.landmarks.join(", ")}`);
  if (cityInfo.facts) {
    console.log("Interesting facts:");
    cityInfo.facts.forEach((fact: string, index: number) => {
      console.log(`${index + 1}. ${fact}`);
    });
  }
}

// Model configuration example
async function modelConfigExample() {
  // Get available models
  const models = await openRouter.getAvailableModels();
  console.log("Available models:");
  models.forEach((model) => {
    console.log(`- ${model.id}: ${model.name} (Context length: ${model.context_length})`);
  });

  // Change the default model
  openRouter.setDefaultModel("anthropic/claude-3-opus");

  // Generate with specific parameters
  const response = await openRouter.generateChatCompletion(
    [{ role: "user", content: "Write a short poem about AI." }],
    {
      params: {
        temperature: 0.9, // Higher creativity
        max_tokens: 150, // Shorter response
        top_p: 0.95, // Slightly more focused sampling
        presence_penalty: 0.6, // Encourage diversity in response
      },
    }
  );

  console.log("Generated poem:");
  console.log(response.choices[0].message.content);
}

// Export the example functions
export { simpleChatExample, structuredJsonExample, modelConfigExample };
