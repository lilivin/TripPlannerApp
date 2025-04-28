import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string().min(6, "Password confirmation must be at least 6 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();

    // Validate input data
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error.errors[0]?.message || "Invalid input data",
        }),
        {
          status: 400,
        }
      );
    }

    const { password } = result.data;

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Password has been updated successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

// Ensure this route is server-rendered
export const prerender = false;
