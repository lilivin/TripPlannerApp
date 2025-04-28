import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
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
    const result = registerSchema.safeParse(body);
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

    const { email, password } = result.data;

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single();

    if (existingUser) {
      return new Response(JSON.stringify({ error: "User with this email already exists" }), {
        status: 400,
      });
    }

    // Register new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/login`,
      },
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    // Create user profile if not exists
    if (data.user) {
      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: data.user.id,
            email: email,
            created_at: new Date().toISOString(),
            language_preference: "en",
            verified_email: false,
          },
        ])
        .select()
        .single();

      if (insertError && insertError.code !== "23505") {
        // Skip unique violation
        console.error("Failed to create user profile:", insertError);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Registration successful. Please check your email to verify your account.",
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

// Ensure this route is server-rendered
export const prerender = false;
