"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MediaUploader } from "@/components/shared/media-uploader";
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
import { storageBuckets } from "@/constants/storage-buckets";
import {
  deleteSocialLinkAction,
  upsertSocialLinkAction,
} from "@/features/admin/actions/social-links";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
import { CatalogSelect } from "@/features/admin/components/catalog-select";
import {
  AdminDataTable,
  type AdminColumn,
} from "@/features/admin/components/admin-data-table";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { toAdminErrorMessage } from "@/features/admin/lib/errors";
import { adminResolver } from "@/features/admin/lib/form-resolver";
import {
  socialLinkSchema,
  type SocialLinkInput,
} from "@/features/admin/schemas/social-link";
import { getPublicStorageUrl } from "@/lib/storage-url";
import type { CatalogItem, SocialLink } from "@/types/domain";

function emptyValues(defaultTypeId: string): SocialLinkInput {
  return {
    name: "",
    typeId: defaultTypeId,
    iconImage: null,
    url: "",
    sortOrder: 0,
  };
}

function toFormValues(item: SocialLink): SocialLinkInput {
  return {
    id: item.id,
    name: item.name,
    typeId: item.typeId,
    iconImage: item.iconImage ?? null,
    url: item.url,
    sortOrder: item.sortOrder,
  };
}

export function SocialLinksManager({
  items,
  types,
  title,
  description,
}: {
  items: SocialLink[];
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

  const form = useForm<SocialLinkInput>({
    resolver: adminResolver(socialLinkSchema),
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
        item.url.toLowerCase().includes(q),
    );
  }, [items, search]);

  function openCreate() {
    setEditingId(undefined);
    form.reset(emptyValues(defaultTypeId));
    setFormOpen(true);
  }

  function openEdit(item: SocialLink) {
    setEditingId(item.id);
    form.reset(toFormValues(item));
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    form.reset(emptyValues(defaultTypeId));
  }

  function onSubmit(values: SocialLinkInput) {
    startTransition(async () => {
      try {
        await upsertSocialLinkAction({
          ...values,
          id: editingId,
        });
        toast.success("Guardado correctamente");
        closeForm();
        router.refresh();
      } catch (error) {
        toast.error(toAdminErrorMessage(error, "Error al guardar"));
      }
    });
  }

  const columns: AdminColumn<SocialLink>[] = [
    {
      key: "icon",
      header: "Icono",
      cell: (row) => {
        const src = getPublicStorageUrl(storageBuckets.icons, row.iconImage);
        return (
          <div className="bg-muted flex size-9 items-center justify-center overflow-hidden rounded-xl border border-border/60">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element -- SVG/PNG/WEBP/JPG desde Storage
              <img
                src={src}
                alt=""
                width={28}
                height={28}
                className="size-7 object-contain p-1"
              />
            ) : (
              <span className="text-muted-foreground text-xs font-medium">
                {row.name.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
        );
      },
    },
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
      key: "url",
      header: "URL",
      className: "max-w-[240px] truncate",
      cell: (row) => row.url,
    },
    {
      key: "sort",
      header: "Orden",
      cell: (row) => row.sortOrder,
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
            confirmLabel="¿Eliminar esta red social?"
            onDelete={async () => {
              try {
                await deleteSocialLinkAction(row.id);
                toast.success("Eliminado correctamente");
                router.refresh();
              } catch (error) {
                toast.error(toAdminErrorMessage(error, "Error al eliminar"));
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
          {editingId ? "Editar red social" : "Nueva red social"}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="GitHub" />
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
            name="url"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://… o mailto:correo@ejemplo.com"
                  />
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
        <FormField
          control={form.control}
          name="iconImage"
          render={({ field }) => (
            <FormItem>
              <MediaUploader
                bucket={storageBuckets.icons}
                value={field.value}
                onChange={field.onChange}
                folder="social"
                label="Icono"
                accept="image/svg+xml,image/png,image/webp,image/jpeg,.svg"
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
