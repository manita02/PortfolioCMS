import { ZodError } from "zod";

/** Mensajes amigables: nunca exponer detalles técnicos al admin. */
export function toAdminErrorMessage(
  error: unknown,
  fallback = "No se pudo completar la acción. Intenta de nuevo.",
) {
  if (error instanceof ZodError) {
    return "Revisa los campos del formulario.";
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("unauthorized") ||
      msg.includes("forbidden") ||
      msg.includes("jwt") ||
      msg.includes("row-level") ||
      msg.includes("permission")
    ) {
      return "No tienes permiso para realizar esta acción.";
    }
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return "Ya existe un registro con esos datos.";
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return "Error de conexión. Intenta de nuevo.";
    }
  }
  return fallback;
}
