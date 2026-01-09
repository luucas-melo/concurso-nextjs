"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { login, signup } from "@/lib/actions/auth";
import { loginSchema, signupSchema } from "@/lib/schemas/auth";
import type { LoginInput, SignupInput } from "@/lib/schemas/auth";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Use react-hook-form with Zod validation
  const form = useForm<LoginInput | SignupInput>({
    resolver: zodResolver(mode === "login" ? loginSchema : signupSchema),
    defaultValues:
      mode === "login"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "" },
  });

  // Reset form when switching modes
  const handleModeSwitch = (newMode: "login" | "signup") => {
    setMode(newMode);
    form.reset(
      newMode === "login"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "" }
    );
  };

  // Handle form submission with Server Actions
  const onSubmit = async (data: LoginInput | SignupInput) => {
    startTransition(async () => {
      try {
        const result =
          mode === "login"
            ? await login(data as LoginInput)
            : await signup(data as SignupInput);

        if (result?.error) {
          toast.error(result.error);

          // Handle field-specific errors
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, errors]) => {
              if (errors && errors.length > 0) {
                form.setError(field as any, {
                  type: "manual",
                  message: errors[0],
                });
              }
            });
          }
        } else if (result?.success) {
          toast.success(result.message || "Sucesso!");
        }
      } catch (error) {
        toast.error("Erro inesperado. Tente novamente.");
      }
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <div className="max-w-md w-full">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  C
                </span>
              </div>
              <span className="font-display font-bold text-2xl">
                ConcursoTrack
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold mb-2">
              {mode === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Entre com suas credenciais para acessar sua conta"
                : "Comece a organizar sua jornada de concurseiro"}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    className="pl-11 h-12"
                    {...form.register("name" as any)}
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message as string}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-11 h-12"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {mode === "login" ? "Entrando..." : "Criando conta..."}
                </span>
              ) : mode === "login" ? (
                "Entrar"
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            {mode === "login" ? (
              <>
                Não tem uma conta?{" "}
                <button
                  onClick={() => handleModeSwitch("signup")}
                  className="text-primary font-medium hover:underline"
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{" "}
                <button
                  onClick={() => handleModeSwitch("login")}
                  className="text-primary font-medium hover:underline"
                >
                  Fazer login
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-lg text-primary-foreground">
          <h2 className="font-display text-4xl font-bold mb-6">
            Organize sua jornada de concurseiro
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Gerencie inscrições, acompanhe prazos e nunca perca uma
            oportunidade. Sua aprovação começa com organização.
          </p>
          <div className="space-y-4">
            <FeatureItem text="Gerencie múltiplos concursos" />
            <FeatureItem text="Alertas de prazos por e-mail" />
            <FeatureItem text="Checklist de documentos" />
            <FeatureItem text="Timeline visual de datas" />
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
    <span>{text}</span>
  </div>
);
