import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Get user profile data
    const { data: userProfile } = await supabase.from("users").select("*").eq("id", session.user.id).single();

    return new Response(
      JSON.stringify({
        user: {
          id: session.user.id,
          email: session.user.email,
          profile: userProfile || null,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Session error:", error);
    return new Response(JSON.stringify({ error: "Internal server error", user: null }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

// Ensure this route is server-rendered
export const prerender = false;
