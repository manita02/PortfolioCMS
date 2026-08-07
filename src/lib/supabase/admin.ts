import { resolveAdminAccess } from "@/lib/auth/admin-policy";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function assertAdmin() {
  const user = await getSessionUser();
  const reason = resolveAdminAccess({
    hasUser: Boolean(user),
    userEmail: user?.email,
    adminEmail: process.env.ADMIN_EMAIL,
  });

  if (reason === "unauthenticated") {
    return {
      ok: false as const,
      user: null,
      reason: "unauthenticated" as const,
    };
  }

  if (reason === "forbidden") {
    return {
      ok: false as const,
      user,
      reason: "forbidden" as const,
    };
  }

  return { ok: true as const, user: user!, reason: null };
}

export async function requireAdmin() {
  const result = await assertAdmin();
  if (!result.ok) {
    throw new Error("FORBIDDEN");
  }
  return result.user;
}
