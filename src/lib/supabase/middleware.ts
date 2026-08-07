import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isAdminLoginPath,
  resolveAdminAccess,
} from "@/lib/auth/admin-policy";

function withPrivateCache(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "private, no-store, max-age=0, must-revalidate",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Vary", "Cookie");
  return response;
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return withPrivateCache(NextResponse.redirect(url));
}

/**
 * Refresca la sesión de Supabase y aplica gate server-side en /admin/*.
 * El layout CMS y requireAdmin siguen siendo la segunda línea de defensa.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = withPrivateCache(
    NextResponse.next({ request }),
  );

  const pathname = request.nextUrl.pathname;
  const loginRoute = isAdminLoginPath(pathname);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const configured =
    Boolean(supabaseUrl) &&
    Boolean(anonKey) &&
    !supabaseUrl!.includes("your-project") &&
    anonKey !== "your-anon-key";

  // Fail-closed en rutas CMS si falta configuración.
  if (!configured) {
    if (!loginRoute) {
      return redirectTo(request, "/admin/login");
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = withPrivateCache(
          NextResponse.next({ request }),
        );
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const access = resolveAdminAccess({
    hasUser: Boolean(user),
    userEmail: user?.email,
    adminEmail: process.env.ADMIN_EMAIL,
  });

  if (loginRoute) {
    if (access === "ok") {
      return redirectTo(request, "/admin");
    }
    if (access === "forbidden") {
      return redirectTo(request, "/");
    }
    return supabaseResponse;
  }

  // Rutas administrativas del CMS
  if (access === "unauthenticated") {
    return redirectTo(request, "/admin/login");
  }
  if (access === "forbidden") {
    return redirectTo(request, "/");
  }

  return supabaseResponse;
}
