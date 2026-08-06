"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
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
  deleteEducationAction,
  upsertEducationAction,
} from "@/features/admin/actions/educations";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
import { CatalogSelect } from "@/features/admin/components/catalog-select";
import { AdminDataTable } from "@/features/admin/components/admin-data-table";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { MediaUploader } from "@/components/shared/media-uploader";
import { OrganizationCombobox } from "@/features/admin/components/organization-combobox";
import { SkillMultiSelect } from "@/features/admin/components/skill-multi-select";
import { toAdminErrorMessage } from "@/features/admin/lib/errors";
import { adminResolver } from "@/features/admin/lib/form-resolver";
import {
  educationSchema,
  type EducationInput,
} from "@/features/admin/schemas/education";
import type { EducationAdminRow } from "@/features/admin/types/rows";
import type { CatalogItem, Organization } from "@/types/domain";

function defaults(
  item: EducationAdminRow | null | undefined,
  orgId: string,
  defaultTypeId: string,
): EducationInput {
  return {
    id: item?.id,
    organizationId: item?.organization_id ?? orgId,
    typeId: item?.type_id ?? defaultTypeId,
    startMonth: item?.start_month ?? 1,
    startYear: item?.start_year ?? new Date().getFullYear(),
    endMonth: item?.end_month ?? null,
    endYear: item?.end_year ?? null,
    isCurrent: item?.is_current ?? false,
    sortOrder: item?.sort_order ?? 0,
    diplomaImagePath: item?.diploma_image_path ?? null,
    diplomaPdfPath: item?.diploma_pdf_path ?? null,
    skillIds: item?.education_skills?.map((s) => s.skill_id) ?? [],
    title: item?.title ?? "",
    description: item?.description ?? "",
  };
}

export function EducationsManager({
  items,
  organizations,
  skills,
  types,
  title,
  description,
}: {
  items: EducationAdminRow[];
  organizations: Organization[];
  skills: { id: string; name: string }[];
  types: CatalogItem[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const defaultOrg = organizations[0]?.id ?? "";
  const defaultTypeId = types[0]?.id ?? "";

  const form = useForm<EducationInput>({
    resolver: adminResolver(educationSchema),
    mode: "onChange",
    defaultValues: defaults(null, defaultOrg, defaultTypeId),
  });

  const isCurrent = useWatch({ control: form.control, name: "isCurrent" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      return (
        (item.title ?? "").toLowerCase().includes(q) ||
        (item.organizations?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  function openCreate() {
    setEditingId(undefined);
    form.reset(defaults(null, defaultOrg, defaultTypeId));
    setFormOpen(true);
  }

  function openEdit(item: EducationAdminRow) {
    setEditingId(item.id);
    form.reset(defaults(item, defaultOrg, defaultTypeId));
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    form.reset(defaults(null, defaultOrg, defaultTypeId));
  }

  function onSubmit(values: EducationInput) {
    startTransition(async () => {
      try {
        await upsertEducationAction({ ...values, id: editingId });
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
                name="startMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mes inicio</FormLabel>
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
                name="startYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año inicio</FormLabel>
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
                name="endMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mes fin</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        disabled={isCurrent}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? null : e.target.value,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año fin</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isCurrent}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? null : e.target.value,
                          )
                        }
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
                name="isCurrent"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0 self-end pb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                    </FormControl>
                    <FormLabel>{"Actual"}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skillIds"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Habilidades</FormLabel>
                    <SkillMultiSelect
                      skills={skills}
                      value={field.value ?? []}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="diplomaImagePath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen título</FormLabel>
                    <MediaUploader
                      bucket={storageBuckets.educations}
                      value={field.value}
                      onChange={field.onChange}
                      folder="diploma"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diplomaPdfPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDF título</FormLabel>
                    <MediaUploader
                      bucket={storageBuckets.educations}
                      value={field.value}
                      onChange={field.onChange}
                      folder="diploma-pdf"
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
            key: "title",
            header: "Título",
            cell: (r) => r.title || "—",
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
                      await deleteEducationAction(r.id);
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
