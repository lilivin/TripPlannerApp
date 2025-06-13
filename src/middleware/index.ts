import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.server";

// Public paths - Auth API endpoints & Server-Rendered Astro Pages
const PUBLIC_PATHS = [
  // Server-Rendered Astro Pages
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  // Auth API endpoints
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  // Public pages
  "/",
  "/guides",
];

// Add API paths to ensure they always return JSON
const API_PATHS = ["/api/auth/session", "/api/guides", "/api/plans", "/api/ai", "/api/attractions", "/api/home"];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Initialize Supabase client on context.locals
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Set Supabase client on context.locals
  locals.supabase = supabase;

  // Check if this is an API request that should always return JSON
  const isApiRequest = API_PATHS.some((path) => url.pathname.startsWith(path));

  if (isApiRequest) {
    try {
      // Process the API request and ensure it returns JSON
      const response = await next();

      // Log info about the response for debugging
      console.log(`API Response for ${url.pathname}:`, {
        status: response.status,
        headers: Object.fromEntries([...response.headers.entries()]),
      });

      // Ensure JSON content type
      if (!response.headers.get("content-type")?.includes("application/json")) {
        console.error("API didn't return JSON. Overriding response.");

        // Try to read the response body to log it
        let responseBody;
        try {
          responseBody = await response.clone().text();
          console.error("Original response body:", responseBody.substring(0, 200) + "...");
        } catch (e) {
          console.error("Could not read response body:", e);
        }

        // Return a properly formatted JSON error
        return new Response(
          JSON.stringify({
            error: "API processing error",
            message: "The API endpoint failed to return proper JSON",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return response;
    } catch (error) {
      console.error(`Error processing API request ${url.pathname}:`, error);

      // Return a JSON error response
      return new Response(
        JSON.stringify({
          error: "API processing error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  // Skip auth check for public paths
  if (PUBLIC_PATHS.includes(url.pathname) || url.pathname.startsWith("/guides/")) {
    return next();
  }

  // IMPORTANT: Always get user session first before any other operations
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    locals.user = {
      email: user.email ?? null,
      id: user.id,
    };
  } else if (!PUBLIC_PATHS.includes(url.pathname)) {
    // Redirect to login for protected routes
    return redirect("/login");
  }

  return next();
});
