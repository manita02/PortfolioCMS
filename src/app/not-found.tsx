import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-muted-foreground text-sm tracking-wide uppercase">404</p>
      <h1 className="font-heading text-3xl tracking-tight">
        Página no encontrada
      </h1>
      <p className="text-muted-foreground text-sm">
        La ruta que buscas no existe o fue movida.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Volver al inicio
      </Link>
    </main>
  );
}
