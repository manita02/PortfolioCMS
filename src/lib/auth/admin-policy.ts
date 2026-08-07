/**
 * Reglas puras de autorización admin (sin I/O).
 * Usadas por middleware, Server Components y tests.
 */

export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const trimmed = email.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

export function isAllowedAdminEmail(
  userEmail: string | null | undefined,
  adminEmail: string | null | undefined,
): boolean {
  const user = normalizeEmail(userEmail);
  const admin = normalizeEmail(adminEmail);
  if (!user || !admin) return false;
  return user === admin;
}

export type AdminAccessReason = "ok" | "unauthenticated" | "forbidden";

export function resolveAdminAccess(params: {
  hasUser: boolean;
  userEmail: string | null | undefined;
  adminEmail: string | null | undefined;
}): AdminAccessReason {
  if (!params.hasUser) return "unauthenticated";
  if (!isAllowedAdminEmail(params.userEmail, params.adminEmail)) {
    return "forbidden";
  }
  return "ok";
}

export function isAdminLoginPath(pathname: string): boolean {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/** Mensaje genérico: no revelar existencia de usuario ni detalles de Auth. */
export function getSafeLoginErrorMessage(
  error: { message?: string; status?: number; code?: string } | null | undefined,
): string {
  if (!error) {
    return "No se pudo iniciar sesión. Revisá tus credenciales e intentá de nuevo.";
  }

  const status = error.status;
  const message = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();

  if (status === 429 || message.includes("rate limit") || code.includes("over_request")) {
    return "Demasiados intentos. Esperá unos minutos e intentá de nuevo.";
  }

  if (
    message.includes("invalid api key") ||
    message.includes("jwt") ||
    message.includes("failed to fetch") ||
    message.includes("network")
  ) {
    return "No se pudo conectar con el servicio de autenticación. Intentá más tarde.";
  }

  // Credenciales inválidas, email no confirmado, usuario inexistente, etc.
  return "No se pudo iniciar sesión. Revisá tus credenciales e intentá de nuevo.";
}

/** Evita path traversal en carpetas de Storage. */
export function isSafeStorageFolder(folder: string): boolean {
  if (!folder || folder.length > 120) return false;
  if (folder.includes("..") || folder.includes("\\")) return false;
  if (folder.startsWith("/") || folder.includes("//")) return false;
  return /^[a-zA-Z0-9/_-]+$/.test(folder);
}
