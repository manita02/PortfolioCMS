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
import { Textarea } from "@/components/ui/textarea";
import { storageBuckets } from "@/constants/storage-buckets";
import {
  deleteOrganizationAction,
  upsertOrganizationAction,
} from "@/features/admin/actions/organizations";
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
import {
  organizationSchema,
  type OrganizationInput,
} from "@/features/admin/schemas/organization";
import type { CatalogItem, Organization } from "@/types/domain";

function emptyValues(defaultTypeId: string): OrganizationInput {
  return {
    name: "",
    typeId: defaultTypeId,
    websiteUrl: "",
    logoPath: null,
    location: "",
    description: "",
  };
}

function toFormValues(item: Organization): OrganizationInput {
  return {
    id: item.id,
    name: item.name,
    typeId: item.typeId,
    websiteUrl: item.websiteUrl ?? "",
    logoPath: item.logoPath ?? null,
    location: item.location ?? "",
    description: item.description ?? "",
  };
}

export function OrganizationsManager({
  items,
  types,
  title,
  description,
}: {
  items: Organization[];
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

  const form = useForm<OrganizationInput>({
    resolver: adminResolver(organizationSchema),
    defaultValues: emptyValues(defaultTypeId),
    mode: "onChange",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.typeName.toLowerCase().includes(q) ||
        (item.location ?? "").toLowerCase().includes(q),
    );
  }, [items, search]);

  function openCreate() {
    setEditingId(undefined);
    form.reset(emptyValues(defaultTypeId));
    setFormOpen(true);
  }

  function openEdit(item: Organization) {
    setEditingId(item.id);
    form.reset(toFormValues(item));
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    form.reset(emptyValues(defaultTypeId));
  }

  function onSubmit(values: OrganizationInput) {
    startTransition(async () => {
      try {
        await upsertOrganizationAction({
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

  const columns: AdminColumn<Organization>[] = [
    {
      key: "name",
      header: "Nombre",
      cell: (row) => row.name,
    },
    {
      key: "type",
      header: "Tipo",
      cell: (row) => row.typeName || "—",
    },
    {
      key: "location",
      header: "Ubicación",
      cell: (row) => row.location ?? "—",
    },
    {
      key: "actions",
      header: "Acciones",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
            Editar
          </Button>
          <ConfirmDeleteButton
            label="Eliminar"
            confirmLabel="¿Eliminar este elemento?"
            onDelete={async () => {
              try {
                await deleteOrganizationAction(row.id);
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Buenos Aires" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sitio web</FormLabel>
                <FormControl>
                  <Input type="url" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="logoPath"
          render={({ field }) => (
            <FormItem>
              <MediaUploader
                bucket={storageBuckets.organizations}
                value={field.value}
                onChange={field.onChange}
                folder="logos"
                label="Logo"
              />
              <FormMessage />
            </FormItem>
          )}
        />
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
