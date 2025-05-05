/**
 * React component example using the OpenRouter hook
 */

import { useState } from "react";
import { useOpenRouter } from "../../../components/hooks/pwa/useOpenRouter";

/**
 * Simple chat interface component using the OpenRouter service
 */
export function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [modelName, setModelName] = useState("openai/gpt-3.5-turbo");
  const [temperature, setTemperature] = useState(0.7);

  // Initialize the OpenRouter hook
  const { sendMessage, loading, error } = useOpenRouter({
    defaultModel: modelName,
    defaultParams: {
      temperature,
      max_tokens: 1000,
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    // Add user message to chat
    const userMessage = message.trim();
    setChat((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");

    try {
      // Get AI response
      const response = await sendMessage(userMessage, {
        model: modelName,
        params: {
          temperature,
        },
        metadata: {
          systemMessage: "You are a helpful assistant. Provide concise and accurate responses.",
        },
      });

      // Add AI response to chat
      setChat((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      console.error("Failed to get response:", err);
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error while processing your request.",
        },
      ]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Chat with AI</h2>

      {/* Chat Messages */}
      <div className="mb-4 h-80 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50">
        {chat.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Start a conversation by sending a message.</p>
        ) : (
          chat.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.role === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="text-left mb-3">
            <div className="inline-block p-2 rounded-lg bg-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">{error.message}</div>}

      {/* Settings */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <select
            id="model-select"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="openai/gpt-4o">GPT-4o</option>
            <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
            <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet</option>
            <option value="google/gemini-pro">Gemini Pro</option>
          </select>
        </div>
        <div className="w-32">
          <label htmlFor="temperature-input" className="block text-sm font-medium text-gray-700 mb-1">
            Temperature: {temperature}
          </label>
          <input
            id="temperature-input"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          id="message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          placeholder="Type your message..."
          aria-label="Message input"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}
