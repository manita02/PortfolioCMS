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
    if (
      msg.includes("foreign key") ||
      msg.includes("restrict") ||
      msg.includes("violates foreign key") ||
      msg.includes("23503")
    ) {
      return "No se puede eliminar: hay habilidades usando este tipo.";
    }
    if (msg.includes("system type") || msg.includes("tipo de sistema")) {
      return "No se puede eliminar el tipo de sistema.";
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return "Error de conexión. Intenta de nuevo.";
    }
  }
  return fallback;
}
