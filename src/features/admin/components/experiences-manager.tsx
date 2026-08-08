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
import {
  deleteExperienceAction,
  upsertExperienceAction,
} from "@/features/admin/actions/experiences";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
import { CatalogSelect } from "@/features/admin/components/catalog-select";
import {
  AdminDataTable,
  type AdminColumn,
} from "@/features/admin/components/admin-data-table";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { AdminDateRangeFields } from "@/features/admin/components/month-year-fields";
import { OrganizationCombobox } from "@/features/admin/components/organization-combobox";
import { SkillMultiSelect } from "@/features/admin/components/skill-multi-select";
import { toAdminErrorMessage } from "@/features/admin/lib/errors";
import { adminResolver } from "@/features/admin/lib/form-resolver";
import {
  experienceSchema,
  type ExperienceInput,
} from "@/features/admin/schemas/experience";
import type { ExperienceAdminRow } from "@/features/admin/types/rows";
import type { CatalogItem, Organization } from "@/types/domain";

function emptyValues(
  organizations: Organization[],
  defaultTypeId: string,
  defaultModalityId: string,
): ExperienceInput {
  return {
    organizationId: organizations[0]?.id ?? "",
    typeId: defaultTypeId,
    modalityId: defaultModalityId,
    startMonth: 1,
    startYear: new Date().getFullYear(),
    endMonth: null,
    endYear: null,
    isCurrent: false,
    skillIds: [],
    title: "",
    description: "",
  };
}

function toFormValues(item: ExperienceAdminRow): ExperienceInput {
  return {
    id: item.id,
    organizationId: item.organization_id,
    typeId: item.type_id,
    modalityId: item.modality_id,
    startMonth: item.start_month,
    startYear: item.start_year,
    endMonth: item.end_month ?? null,
    endYear: item.end_year ?? null,
    isCurrent: item.is_current,
    skillIds: item.experience_skills?.map((s) => s.skill_id) ?? [],
    title: item.title ?? "",
    description: item.description ?? "",
  };
}

export function ExperiencesManager({
  items,
  organizations,
  skills,
  types,
  modalities,
  title,
  description,
}: {
  items: ExperienceAdminRow[];
  organizations: Organization[];
  skills: { id: string; name: string; typeId?: string }[];
  types: CatalogItem[];
  modalities: CatalogItem[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const defaultTypeId = types[0]?.id ?? "";
  const defaultModalityId = modalities[0]?.id ?? "";

  const form = useForm<ExperienceInput>({
    resolver: adminResolver(experienceSchema),
    defaultValues: emptyValues(organizations, defaultTypeId, defaultModalityId),
    mode: "onChange",
  });

  const isCurrent = useWatch({ control: form.control, name: "isCurrent" });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const typeName = item.experience_types?.name?.toLowerCase() ?? "";
      const modalityName =
        item.experience_modalities?.name?.toLowerCase() ?? "";
      return (
        (item.title ?? "").toLowerCase().includes(q) ||
        (item.organizations?.name ?? "").toLowerCase().includes(q) ||
        typeName.includes(q) ||
        modalityName.includes(q)
      );
    });
  }, [items, search]);

  function openCreate() {
    setEditingId(undefined);
    form.reset(emptyValues(organizations, defaultTypeId, defaultModalityId));
    setFormOpen(true);
  }

  function openEdit(item: ExperienceAdminRow) {
    setEditingId(item.id);
    form.reset(toFormValues(item));
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(undefined);
    form.reset(emptyValues(organizations, defaultTypeId, defaultModalityId));
  }

  function onSubmit(values: ExperienceInput) {
    startTransition(async () => {
      try {
        await upsertExperienceAction({
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

  const columns: AdminColumn<ExperienceAdminRow>[] = [
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
      cell: (row) => row.experience_types?.name ?? "—",
    },
    {
      key: "modality",
      header: "Modalidad",
      cell: (row) => row.experience_modalities?.name ?? "—",
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
                await deleteExperienceAction(row.id);
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
                <FormLabel>Tipo de experiencia</FormLabel>
                <FormControl>
                  <CatalogSelect
                    items={types}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Seleccionar tipo de experiencia…"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modalityId"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Modalidad</FormLabel>
                <FormControl>
                  <CatalogSelect
                    items={modalities}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Seleccionar modalidad…"
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
