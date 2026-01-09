"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema, forgotPasswordSchema } from "@/lib/schemas/auth";
import type { LoginInput, SignupInput, ForgotPasswordInput } from "@/lib/schemas/auth";

/**
 * Login action
 * Authenticates user with email and password using Supabase Auth
 */
export async function login(data: LoginInput) {
  // Validate input with Zod
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Dados inválidos. Verifique os campos e tente novamente.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  // Attempt to sign in
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: "E-mail ou senha incorretos. Tente novamente.",
    };
  }

  // Revalidate and redirect
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Signup action
 * Creates a new user account with Supabase Auth
 */
export async function signup(data: SignupInput) {
  // Validate input with Zod
  const validatedFields = signupSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Dados inválidos. Verifique os campos e tente novamente.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name } = validatedFields.data;
  const supabase = await createClient();

  // Attempt to sign up
  const { error, data: authData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return {
      error: error.message || "Erro ao criar conta. Tente novamente.",
    };
  }

  // If email confirmation is required
  if (authData.user && !authData.session) {
    return {
      success: true,
      message: "Conta criada! Verifique seu e-mail para confirmar sua conta.",
    };
  }

  // Revalidate and redirect
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Logout action
 * Signs out the current user
 */
export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: "Erro ao fazer logout. Tente novamente.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Forgot password action
 * Sends password reset email
 */
export async function forgotPassword(data: ForgotPasswordInput) {
  // Validate input with Zod
  const validatedFields = forgotPasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "E-mail inválido.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return {
      error: "Erro ao enviar e-mail de recuperação. Tente novamente.",
    };
  }

  return {
    success: true,
    message: "E-mail de recuperação enviado! Verifique sua caixa de entrada.",
  };
}

/**
 * Get current user
 * Server-side helper to get authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
