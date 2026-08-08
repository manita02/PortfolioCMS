"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
  deleteProjectAction,
  upsertProjectAction,
} from "@/features/admin/actions/projects";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
import { AdminDataTable } from "@/features/admin/components/admin-data-table";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { MediaUploader } from "@/components/shared/media-uploader";
import { AdminDateRangeFields } from "@/features/admin/components/month-year-fields";
import { OrganizationCombobox } from "@/features/admin/components/organization-combobox";
import { SkillMultiSelect } from "@/features/admin/components/skill-multi-select";
import { toAdminErrorMessage } from "@/features/admin/lib/errors";
import { adminResolver } from "@/features/admin/lib/form-resolver";
import { projectSchema } from "@/features/admin/schemas/project";
import type { ProjectAdminRow } from "@/features/admin/types/rows";
import type { Organization } from "@/types/domain";

const projectFormSchema = projectSchema.extend({
  organizationId: z.string(),
});

type FormValues = z.infer<typeof projectFormSchema>;

function defaults(item?: ProjectAdminRow | null): FormValues {
  return {
    id: item?.id,
    organizationId: item?.organization_id ?? "none",
    slug: item?.slug ?? "",
    name: item?.name ?? "",
    summary: item?.summary ?? "",
    description: item?.description ?? "",
    startMonth: item?.start_month ?? null,
    startYear: item?.start_year ?? null,
    endMonth: item?.end_month ?? null,
    endYear: item?.end_year ?? null,
    imagePath: item?.image_path ?? null,
    githubUrl: item?.github_url ?? "",
    liveUrl: item?.live_url ?? "",
    isFeatured: item?.is_featured ?? false,
    skillIds: item?.project_skills?.map((s) => s.skill_id) ?? [],
  };
}

export function ProjectsManager({
  items,
  organizations,
  skills,
  title,
  description,
}: {
  items: ProjectAdminRow[];
  organizations: Organization[];
  skills: { id: string; name: string; typeId?: string }[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  const form = useForm<FormValues>({
    resolver: adminResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: defaults(),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      return (
        (item.name ?? "").toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  function openCreate() {
    setEditingId(undefined);
    form.reset(defaults());
    setFormOpen(true);
  }

  function openEdit(item: ProjectAdminRow) {
    setEditingId(item.id);
    form.reset(defaults(item));
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    form.reset(defaults());
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        await upsertProjectAction({
          ...values,
          id: editingId,
          organizationId:
            values.organizationId === "none" ? null : values.organizationId,
        });
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Resumen</FormLabel>
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
                name="organizationId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Organización</FormLabel>
                    <OrganizationCombobox
                      organizations={organizations}
                      value={field.value}
                      onChange={field.onChange}
                      allowNone
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AdminDateRangeFields
                control={form.control}
                showCurrent={false}
                optionalStart
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0 self-end pb-2 sm:col-span-2">
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
            <FormField
              control={form.control}
              name="imagePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <MediaUploader
                    bucket={storageBuckets.projects}
                    value={field.value}
                    onChange={field.onChange}
                    folder="covers"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skillIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habilidades</FormLabel>
                  <SkillMultiSelect
                    skills={skills}
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
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
          { key: "slug", header: "Slug", cell: (r) => r.slug },
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
                      await deleteProjectAction(r.id);
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
