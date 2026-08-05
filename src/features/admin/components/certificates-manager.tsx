"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  deleteCertificateAction,
  upsertCertificateAction,
} from "@/features/admin/actions/certificates";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
import { AdminDataTable } from "@/features/admin/components/admin-data-table";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { MediaUploader } from "@/components/shared/media-uploader";
import { OrganizationCombobox } from "@/features/admin/components/organization-combobox";
import { toAdminErrorMessage } from "@/features/admin/lib/errors";
import { adminResolver } from "@/features/admin/lib/form-resolver";
import {
  certificateSchema,
  type CertificateInput,
} from "@/features/admin/schemas/certificate";
import type { CertificateAdminRow } from "@/features/admin/types/rows";
import type { Organization } from "@/types/domain";

function defaults(
  item?: CertificateAdminRow | null,
  orgId = "",
): CertificateInput {
  return {
    id: item?.id,
    organizationId: item?.organization_id ?? orgId,
    issuedMonth: item?.issued_month ?? 1,
    issuedYear: item?.issued_year ?? new Date().getFullYear(),
    imagePath: item?.image_path ?? null,
    pdfPath: item?.pdf_path ?? null,
    credentialUrl: item?.credential_url ?? "",
    isFeatured: item?.is_featured ?? false,
    sortOrder: item?.sort_order ?? 0,
    name: item?.name ?? "",
    description: item?.description ?? "",
  };
}

export function CertificatesManager({
  items,
  organizations,
  title,
  description,
}: {
  items: CertificateAdminRow[];
  organizations: Organization[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const defaultOrg = organizations[0]?.id ?? "";

  const form = useForm<CertificateInput>({
    resolver: adminResolver(certificateSchema),
    mode: "onChange",
    defaultValues: defaults(null, defaultOrg),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      return (
        (item.name ?? "").toLowerCase().includes(q) ||
        (item.organizations?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  function openCreate() {
    setEditingId(undefined);
    form.reset(defaults(null, defaultOrg));
    setFormOpen(true);
  }

  function openEdit(item: CertificateAdminRow) {
    setEditingId(item.id);
    form.reset(defaults(item, defaultOrg));
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    form.reset(defaults(null, defaultOrg));
  }

  function onSubmit(values: CertificateInput) {
    startTransition(async () => {
      try {
        await upsertCertificateAction({ ...values, id: editingId });
        toast.success("Guardado correctamente");
        closeForm();
        router.refresh();
      } catch (error) {
        toast.error(toAdminErrorMessage(error, "Error"));
      }
    });
  }

  return (
    <AdminCrudShell
      title={title}
      description={description}
      search={query}
      onSearchChange={setQuery}
      onNew={openCreate}
      newLabel={"Nuevo"}
      formOpen={formOpen}
      empty={filtered.length === 0 && !formOpen}
      form={
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
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organización</FormLabel>
                    <OrganizationCombobox
                      organizations={organizations}
                      value={field.value}
                      onChange={field.onChange}
                    />
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
              <FormField
                control={form.control}
                name="issuedMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issuedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credentialUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential URL</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} value={field.value ?? ""} />
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
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0 self-end pb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                    </FormControl>
                    <FormLabel>{"Destacado"}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="imagePath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen</FormLabel>
                    <MediaUploader
                      bucket={storageBuckets.certificates}
                      value={field.value}
                      onChange={field.onChange}
                      folder="images"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pdfPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDF</FormLabel>
                    <MediaUploader
                      bucket={storageBuckets.certificates}
                      value={field.value}
                      onChange={field.onChange}
                      folder="pdf"
                      accept="application/pdf"
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={pending || !form.formState.isValid}>
                {"Guardar"}
              </Button>
              <Button type="button" variant="outline" onClick={closeForm}>
                {"Cancelar"}
              </Button>
            </div>
          </form>
        </Form>
      }
    >
      <AdminDataTable
        rows={filtered}
        columns={[
          {
            key: "name",
            header: "Nombre",
            cell: (r) => r.name || "—",
          },
          {
            key: "org",
            header: "Organización",
            cell: (r) => r.organizations?.name ?? "—",
          },
          {
            key: "actions",
            header: "Acciones",
            cell: (r) => (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(r)}>
                  {"Editar"}
                </Button>
                <ConfirmDeleteButton
                  label={"Eliminar"}
                  confirmLabel={"¿Eliminar este elemento?"}
                  onDelete={async () => {
                    try {
                      await deleteCertificateAction(r.id);
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
        ]}
      />
    </AdminCrudShell>
  );
}
