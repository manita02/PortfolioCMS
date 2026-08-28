"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { skillTypeIds } from "@/constants/catalog-ids";
import {
  deleteSkillTypeAction,
  upsertSkillTypeAction,
} from "@/features/admin/actions/skill-types";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
import {
  AdminDataTable,
  type AdminColumn,
} from "@/features/admin/components/admin-data-table";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { toAdminErrorMessage } from "@/features/admin/lib/errors";
import { adminResolver } from "@/features/admin/lib/form-resolver";
import {
  skillTypeSchema,
  type SkillTypeInput,
} from "@/features/admin/schemas/skill-type";
import { cn } from "@/lib/utils";
import type { CatalogItem } from "@/types/domain";

function nextSortOrder(items: CatalogItem[]): number {
  const visible = items.filter((item) => item.id !== skillTypeIds.hidden);
  if (visible.length === 0) return 0;
  return Math.max(...visible.map((item) => item.sortOrder)) + 1;
}

function emptyValues(sortOrder: number): SkillTypeInput {
  return {
    name: "",
    sortOrder,
  };
}

function toFormValues(item: CatalogItem): SkillTypeInput {
  return {
    id: item.id,
    name: item.name,
    sortOrder: item.sortOrder,
  };
}

export function SkillTypesManager({
  items,
  title,
  description,
}: {
  items: CatalogItem[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const defaultSortOrder = nextSortOrder(items);

  const form = useForm<SkillTypeInput>({
    resolver: adminResolver(skillTypeSchema),
    defaultValues: emptyValues(defaultSortOrder),
    mode: "onChange",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...items].sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        a.name.localeCompare(b.name, "es", { sensitivity: "base" }),
    );
    if (!q) return sorted;
    return sorted.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, search]);

  function openCreate() {
    setEditingId(undefined);
    form.reset(emptyValues(nextSortOrder(items)));
    setFormOpen(true);
  }

  function openEdit(item: CatalogItem) {
    setEditingId(item.id);
    form.reset(toFormValues(item));
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    form.reset(emptyValues(nextSortOrder(items)));
  }

  function onSubmit(values: SkillTypeInput) {
    const duplicate = items.some(
      (item) =>
        item.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
        item.id !== editingId,
    );
    if (duplicate) {
      toast.error(toAdminErrorMessage(new Error("duplicate"), "Error"));
      return;
    }

    startTransition(async () => {
      try {
        await upsertSkillTypeAction({
          ...values,
          id: editingId,
        });
        toast.success("Guardado correctamente");
        closeForm();
        router.refresh();
      } catch (error) {
        toast.error(toAdminErrorMessage(error, "Error"));
      }
    });
  }

  const columns: AdminColumn<CatalogItem>[] = [
    {
      key: "name",
      header: "Nombre",
      cell: (row) => {
        const isHidden = row.id === skillTypeIds.hidden;
        return (
          <span
            className={cn(
              isHidden && "font-medium text-red-600 dark:text-red-400",
            )}
          >
            {row.name}
          </span>
        );
      },
    },
    {
      key: "sortOrder",
      header: "Orden",
      cell: (row) => row.sortOrder,
    },
    {
      key: "actions",
      header: "Acciones",
      cell: (row) => {
        const isHidden = row.id === skillTypeIds.hidden;
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
              Editar
            </Button>
            {isHidden ? null : (
              <ConfirmDeleteButton
                label="Eliminar"
                confirmLabel="¿Eliminar este elemento?"
                onDelete={async () => {
                  try {
                    await deleteSkillTypeAction(row.id);
                    toast.success("Guardado correctamente");
                    router.refresh();
                  } catch (error) {
                    toast.error(toAdminErrorMessage(error, "Error"));
                  }
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const formNode = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="font-heading text-lg">
          {editingId ? "Editar" : "Crear"}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orden</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? 0}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            Guardar
          </Button>
          <Button type="button" variant="outline" onClick={closeForm}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <AdminCrudShell
      title={title}
      description={description}
      search={search}
      onSearchChange={setSearch}
      onNew={openCreate}
      newLabel="Nuevo"
      formOpen={formOpen}
      form={formNode}
      empty={filtered.length === 0}
    >
      <AdminDataTable columns={columns} rows={filtered} />
    </AdminCrudShell>
  );
}
