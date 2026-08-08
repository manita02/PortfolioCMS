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
import { storageBuckets } from "@/constants/storage-buckets";
import {
  deleteSkillAction,
  upsertSkillAction,
} from "@/features/admin/actions/skills";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
import { CatalogSelect } from "@/features/admin/components/catalog-select";
import {
  AdminDataTable,
  type AdminColumn,
} from "@/features/admin/components/admin-data-table";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { MediaUploader } from "@/components/shared/media-uploader";
import { toAdminErrorMessage } from "@/features/admin/lib/errors";
import { adminResolver } from "@/features/admin/lib/form-resolver";
import { skillSchema, type SkillInput } from "@/features/admin/schemas/skill";
import type { SkillAdminRow } from "@/features/admin/types/rows";
import { cn } from "@/lib/utils";
import type { CatalogItem } from "@/types/domain";

function emptyValues(defaultTypeId: string): SkillInput {
  return {
    name: "",
    typeId: defaultTypeId,
    iconPath: null,
    sortOrder: 0,
    label: "",
  };
}

function toFormValues(item: SkillAdminRow): SkillInput {
  return {
    id: item.id,
    name: item.name,
    typeId: item.type_id,
    iconPath: item.icon_path ?? null,
    sortOrder: item.sort_order,
    label: item.label ?? "",
  };
}

export function SkillsManager({
  items,
  types,
  title,
  description,
}: {
  items: SkillAdminRow[];
  types: CatalogItem[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const defaultTypeId = types[0]?.id ?? "";

  const form = useForm<SkillInput>({
    resolver: adminResolver(skillSchema),
    defaultValues: emptyValues(defaultTypeId),
    mode: "onChange",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const typeName = item.skill_types?.name?.toLowerCase() ?? "";
      return (
        item.name.toLowerCase().includes(q) ||
        typeName.includes(q) ||
        (item.label ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  function openCreate() {
    setEditingId(undefined);
    form.reset(emptyValues(defaultTypeId));
    setFormOpen(true);
  }

  function openEdit(item: SkillAdminRow) {
    setEditingId(item.id);
    form.reset(toFormValues(item));
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    form.reset(emptyValues(defaultTypeId));
  }

  function onSubmit(values: SkillInput) {
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
        await upsertSkillAction({
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

  const columns: AdminColumn<SkillAdminRow>[] = [
    {
      key: "name",
      header: "Nombre",
      cell: (row) => row.name,
    },
    {
      key: "type",
      header: "Tipo",
      cell: (row) => {
        const isHidden = row.type_id === skillTypeIds.hidden;
        return (
          <span
            className={cn(
              isHidden && "font-medium text-red-600 dark:text-red-400",
            )}
          >
            {row.skill_types?.name ?? "—"}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Acciones",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
            {"Editar"}
          </Button>
          <ConfirmDeleteButton
            label={"Eliminar"}
            confirmLabel={"¿Eliminar este elemento?"}
            onDelete={async () => {
              try {
                await deleteSkillAction(row.id);
                toast.success("Guardado correctamente");
                router.refresh();
              } catch (error) {
                toast.error(toAdminErrorMessage(error, "Error"));
              }
            }}
          />
        </div>
      ),
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
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <CatalogSelect
                    items={types}
                    value={field.value}
                    onChange={field.onChange}
                    dangerItemIds={[skillTypeIds.hidden]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etiqueta</FormLabel>
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
                <FormLabel>Sort</FormLabel>
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
        <FormField
          control={form.control}
          name="iconPath"
          render={({ field }) => (
            <FormItem>
              <MediaUploader
                bucket={storageBuckets.icons}
                value={field.value}
                onChange={field.onChange}
                folder="skills"
                label="Icon"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {"Guardar"}
          </Button>
          <Button type="button" variant="outline" onClick={closeForm}>
            {"Cancelar"}
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
      newLabel={"Nuevo"}
      formOpen={formOpen}
      form={formNode}
      empty={filtered.length === 0}
    >
      <AdminDataTable columns={columns} rows={filtered} />
    </AdminCrudShell>
  );
}
