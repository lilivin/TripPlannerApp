import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();

    // Validate input data
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error.errors[0]?.message || "Invalid email address",
        }),
        {
          status: 400,
        }
      );
    }

    const { email } = result.data;

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/reset-password`,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({
        message: "If an account with that email exists, we've sent a password reset link",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

// Ensure this route is server-rendered
export const prerender = false;
