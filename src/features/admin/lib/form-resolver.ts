import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodTypeAny } from "zod";

/** Compat RHF + Zod (evita mismatch input/output con coerce/preprocess). */
export function adminResolver<T extends FieldValues>(
  schema: ZodTypeAny,
): Resolver<T> {
  return zodResolver(schema) as never;
}
