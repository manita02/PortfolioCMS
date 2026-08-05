"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  async function onSubmit(values: LoginValues) {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (
        !url ||
        !anonKey ||
        url.includes("your-project") ||
        anonKey === "your-anon-key"
      ) {
        toast.error(
          "Faltan las claves de Supabase en .env.local. Revisá URL y anon key.",
        );
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });
      if (error) {
        const hint =
          error.message.toLowerCase().includes("invalid api key") ||
          error.message.toLowerCase().includes("jwt")
            ? " La anon key de .env.local parece inválida."
            : error.message.toLowerCase().includes("email not confirmed")
              ? " Confirmá el email del usuario en Supabase Auth (o desactivá Confirm email)."
              : error.message.toLowerCase().includes("invalid login")
                ? " Email/contraseña incorrectos, o el usuario no está confirmado en Auth."
                : ` (${error.message})`;
        toast.error(`No se pudo iniciar sesión.${hint}`);
        return;
      }

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
      if (
        adminEmail &&
        data.user?.email?.toLowerCase() !== adminEmail
      ) {
        await supabase.auth.signOut();
        toast.error(
          "Sesión válida, pero el email no coincide con NEXT_PUBLIC_ADMIN_EMAIL.",
        );
        router.push("/");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo iniciar sesión.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          Iniciar sesión
        </Button>
      </form>
    </Form>
  );
}
