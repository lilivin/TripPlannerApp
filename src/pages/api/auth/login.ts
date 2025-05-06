import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Determine if we're in a test environment
const isTestEnv = () => {
  return process.env.NODE_ENV === "test" || !!process.env.E2E_USERNAME || process.env.ASTRO_ENVIRONMENT === "test";
};

// Helper for debug logging
const logDebug = (message: string, data?: Record<string, unknown>) => {
  if (isTestEnv()) {
    console.log(`[AUTH-DEBUG] ${message}`, data ? data : "");
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    logDebug("Login request received");
    const body = await request.json();
    logDebug("Request body parsed", { email: body.email ? "PRESENT" : "MISSING" });

    // Validate input data
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const errorMsg = result.error.errors[0]?.message || "Invalid input data";
      logDebug("Validation failed", { error: errorMsg });
      return new Response(
        JSON.stringify({
          error: errorMsg,
        }),
        {
          status: 400,
        }
      );
    }

    const { email, password } = result.data;
    logDebug(`Attempting login for ${email.substring(0, 3)}*****`);

    // Log Supabase URL in test environment (masked)
    if (isTestEnv()) {
      const supabaseUrl =
        import.meta.env.SUPABASE_URL ||
        import.meta.env.VITE_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL;

      if (supabaseUrl) {
        const urlPrefix = supabaseUrl.toString().slice(0, 12);
        logDebug(`Using Supabase URL: ${urlPrefix}*****`);
      } else {
        logDebug("WARNING: No Supabase URL found");
      }
    }

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });
    logDebug("Supabase client created");

    // Special handling for E2E test user - bypass additional checks if needed
    const isE2ETestUser = email === process.env.E2E_USERNAME;
    if (isE2ETestUser) {
      logDebug("Detected E2E test user login attempt");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logDebug("Supabase auth error", { error: error.message, code: error.status });
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
      });
    }

    logDebug("Authentication successful", { userId: data.user?.id });

    // Update last_login_at in the user profile
    if (data.user) {
      logDebug("Updating last login timestamp");
      const { error: updateError } = await supabase
        .from("users")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", data.user.id);

      if (updateError) {
        logDebug("Failed to update last login time", { error: updateError.message });
        console.error("Failed to update last login time:", updateError);
      }
    }

    logDebug("Login complete, returning success response");
    return new Response(
      JSON.stringify({
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logDebug("Login error caught", { error: errorMessage });
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

// Ensure this route is server-rendered
export const prerender = false;
