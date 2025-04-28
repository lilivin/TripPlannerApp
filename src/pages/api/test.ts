import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  try {
    // Check if environment variables are available
    const supabaseUrl = import.meta.env.SUPABASE_URL || null;
    const supabaseKey = import.meta.env.SUPABASE_KEY || null;

    // Create a safe version for display (only showing part of the key)
    const safeSupabaseKey = supabaseKey
      ? `${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}`
      : null;

    return new Response(
      JSON.stringify({
        status: "ok",
        environment: process.env.NODE_ENV,
        environmentVariables: {
          supabaseUrl: supabaseUrl ? "configured" : "missing",
          supabaseKey: supabaseKey ? "configured" : "missing",
          urlPreview: supabaseUrl?.substring(0, 12) + "..." || "N/A",
          keyPreview: safeSupabaseKey || "N/A",
        },
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Test API error:", error);

    return new Response(
      JSON.stringify({
        status: "error",
        message: "An error occurred in the test endpoint",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// Ensure this route is server-rendered
export const prerender = false;
