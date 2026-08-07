import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Gate Edge para /admin/*:
 * - refresca sesión Supabase
 * - redirige anónimos a /admin/login
 * - redirige no-admin a /
 * - evita cache público de respuestas admin
 *
 * Defensa en profundidad: el layout (cms) y requireAdmin también autorizan.
 */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
