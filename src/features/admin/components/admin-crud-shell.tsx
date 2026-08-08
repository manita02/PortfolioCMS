"use client";

import { Plus, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AdminCrudShell({
  title,
  description,
  search,
  onSearchChange,
  searchPlaceholder,
  onNew,
  newLabel,
  formOpen,
  form,
  children,
  empty,
  toolbar,
  className,
}: {
  title: string;
  description?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onNew?: () => void;
  newLabel?: string;
  formOpen?: boolean;
  form?: ReactNode;
  children: ReactNode;
  empty?: boolean;
  toolbar?: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="sr-only">{title}</h2>
          {description ? (
            <p className="text-muted-foreground max-w-2xl text-sm">
              {description}
            </p>
          ) : null}
        </div>
        {onNew ? (
          <Button type="button" onClick={onNew} className="shrink-0">
            <Plus className="size-4" />
            {newLabel ?? "Crear"}
          </Button>
        ) : null}
      </div>

      {(onSearchChange || toolbar) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {onSearchChange ? (
            <div className="relative w-full sm:max-w-sm">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={search ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder ?? "Buscar"}
                aria-label={searchPlaceholder ?? "Buscar"}
                className="pl-9"
              />
            </div>
          ) : null}
          {toolbar}
        </div>
      )}

      {formOpen && form ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-card rounded-2xl border border-border/70 p-4 shadow-sm sm:p-6"
        >
          {form}
        </motion.div>
      ) : null}

      {empty ? <EmptyState message="Aún no hay contenido." /> : children}
    </div>
  );
}
