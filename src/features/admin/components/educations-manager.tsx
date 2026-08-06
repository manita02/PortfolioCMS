"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
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
  deleteEducationAction,
  upsertEducationAction,
} from "@/features/admin/actions/educations";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
import { CatalogSelect } from "@/features/admin/components/catalog-select";
import {
  AdminDataTable,
  type AdminColumn,
} from "@/features/admin/components/admin-data-table";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { MediaUploader } from "@/components/shared/media-uploader";
import { AdminDateRangeFields } from "@/features/admin/components/month-year-fields";
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

function emptyValues(
  organizations: Organization[],
  defaultTypeId: string,
): EducationInput {
  return {
    organizationId: organizations[0]?.id ?? "",
    typeId: defaultTypeId,
    startMonth: 1,
    startYear: new Date().getFullYear(),
    endMonth: null,
    endYear: null,
    isCurrent: false,
    diplomaImagePath: null,
    diplomaPdfPath: null,
    skillIds: [],
    title: "",
    description: "",
  };
}

function toFormValues(item: EducationAdminRow): EducationInput {
  return {
    id: item.id,
    organizationId: item.organization_id,
    typeId: item.type_id,
    startMonth: item.start_month,
    startYear: item.start_year,
    endMonth: item.end_month ?? null,
    endYear: item.end_year ?? null,
    isCurrent: item.is_current,
    diplomaImagePath: item.diploma_image_path ?? null,
    diplomaPdfPath: item.diploma_pdf_path ?? null,
    skillIds: item.education_skills?.map((s) => s.skill_id) ?? [],
    title: item.title ?? "",
    description: item.description ?? "",
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
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const defaultTypeId = types[0]?.id ?? "";

  const form = useForm<EducationInput>({
    resolver: adminResolver(educationSchema),
    defaultValues: emptyValues(organizations, defaultTypeId),
    mode: "onChange",
  });

  const isCurrent = useWatch({ control: form.control, name: "isCurrent" });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const typeName = item.education_types?.name?.toLowerCase() ?? "";
      return (
        (item.title ?? "").toLowerCase().includes(q) ||
        (item.organizations?.name ?? "").toLowerCase().includes(q) ||
        typeName.includes(q)
      );
    });
  }, [items, search]);

  function openCreate() {
    setEditingId(undefined);
    form.reset(emptyValues(organizations, defaultTypeId));
    setFormOpen(true);
  }

  function openEdit(item: EducationAdminRow) {
    setEditingId(item.id);
    form.reset(toFormValues(item));
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    form.reset(emptyValues(organizations, defaultTypeId));
  }

  function onSubmit(values: EducationInput) {
    startTransition(async () => {
      try {
        await upsertEducationAction({
          ...values,
          id: editingId,
          endMonth: values.isCurrent ? null : (values.endMonth ?? null),
          endYear: values.isCurrent ? null : (values.endYear ?? null),
        });
        toast.success("Guardado correctamente");
        closeForm();
        router.refresh();
      } catch (error) {
        toast.error(toAdminErrorMessage(error, "Error"));
      }
    });
  }

  const columns: AdminColumn<EducationAdminRow>[] = [
    {
      key: "title",
      header: "Título",
      cell: (row) => row.title || "—",
    },
    {
      key: "org",
      header: "Organización",
      cell: (row) => row.organizations?.name ?? "—",
    },
    {
      key: "type",
      header: "Tipo",
      cell: (row) => row.education_types?.name ?? "—",
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
                await deleteEducationAction(row.id);
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
                <FormLabel>Tipo de educación</FormLabel>
                <FormControl>
                  <CatalogSelect
                    items={types}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Seleccionar tipo de educación…"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AdminDateRangeFields
            control={form.control}
            isCurrent={Boolean(isCurrent)}
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
