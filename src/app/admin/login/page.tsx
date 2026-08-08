import { redirect } from "next/navigation";
import { LoginForm } from "@/features/admin/components/login-form";
import { assertAdmin } from "@/lib/supabase/admin";

export default async function AdminLoginPage() {
  const result = await assertAdmin();
  if (result.ok) redirect("/admin");
  if (result.reason === "forbidden") redirect("/");

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="font-heading text-2xl tracking-tight">
          Acceso al CMS
        </h1>
        <p className="text-muted-foreground text-sm">
          Iniciá sesión para administrar el portfolio.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
