"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
import { upsertPersonAction } from "@/features/admin/actions/person";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
import { CatalogSelect } from "@/features/admin/components/catalog-select";
import { MediaUploader } from "@/components/shared/media-uploader";
import { toAdminErrorMessage } from "@/features/admin/lib/errors";
import { adminResolver } from "@/features/admin/lib/form-resolver";
import {
  personSchema,
  type PersonInput,
} from "@/features/admin/schemas/person";

type PersonRow = {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string | null;
  availability_label?: string | null;
  availability_text?: string | null;
  currently_working?: boolean | null;
  current_experience_id?: string | null;
  profile_image_path?: string | null;
  banner_image_path?: string | null;
  professional_title?: string | null;
  subtitle?: string | null;
  about?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
} | null;

type ExperienceOption = {
  id: string;
  title: string;
  organizationName: string;
};

function toDefaults(person: PersonRow): PersonInput {
  return {
    firstName: person?.first_name ?? "",
    lastName: person?.last_name ?? "",
    email: person?.email ?? "",
    availabilityLabel: person?.availability_label?.trim() || "Disponibilidad",
    availabilityText:
      person?.availability_text?.trim() || "Disponible para nuevos desafíos",
    currentlyWorking: Boolean(person?.currently_working),
    currentExperienceId: person?.current_experience_id ?? "",
    profileImagePath: person?.profile_image_path ?? null,
    bannerImagePath: person?.banner_image_path ?? null,
    professionalTitle: person?.professional_title ?? "",
    subtitle: person?.subtitle ?? "",
    about: person?.about ?? "",
    metaTitle: person?.meta_title ?? "",
    metaDescription: person?.meta_description ?? "",
  };
}

export function PersonForm({
  person,
  experiences,
  title,
  description,
}: {
  person: PersonRow;
  experiences: ExperienceOption[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<PersonInput>({
    resolver: adminResolver(personSchema),
    defaultValues: toDefaults(person),
    mode: "onChange",
  });

  const currentlyWorking = useWatch({
    control: form.control,
    name: "currentlyWorking",
  });

  const experienceItems = experiences.map((item) => ({
    id: item.id,
    name: item.organizationName
      ? `${item.title} · ${item.organizationName}`
      : item.title,
    sortOrder: 0,
  }));
  const hasExperiences = experienceItems.length > 0;
  const comboDisabled = !currentlyWorking || !hasExperiences;

  function onSubmit(values: PersonInput) {
    const persisted: PersonInput = {
      ...values,
      currentExperienceId: values.currentlyWorking
        ? values.currentExperienceId
        : "",
    };

    startTransition(async () => {
      try {
        await upsertPersonAction(persisted);
        toast.success("Guardado correctamente");
        form.reset(persisted);
        router.refresh();
      } catch (error) {
        toast.error(toAdminErrorMessage(error, "Error"));
      }
    });
  }

  const formBody = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availabilityLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label del badge</FormLabel>
                <FormControl>
                  <Input placeholder="Disponibilidad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availabilityText"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Texto del badge</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Disponible para nuevos desafíos"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentlyWorking"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0 self-end pb-2">
                <FormControl>
                  <Checkbox
                    checked={Boolean(field.value)}
                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                  />
                </FormControl>
                <FormLabel>Actualmente trabajando</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentExperienceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puesto actual</FormLabel>
                <FormControl>
                  <CatalogSelect
                    items={experienceItems}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={comboDisabled}
                    placeholder={
                      hasExperiences
                        ? "Seleccionar…"
                        : "No hay experiencias cargadas"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="profileImagePath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto de perfil</FormLabel>
                <MediaUploader
                  bucket={storageBuckets.person}
                  value={field.value}
                  onChange={field.onChange}
                  folder="avatar"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bannerImagePath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner</FormLabel>
                <MediaUploader
                  bucket={storageBuckets.person}
                  value={field.value}
                  onChange={field.onChange}
                  folder="banner"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="professionalTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título profesional</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acerca de mí</FormLabel>
                <FormControl>
                  <Textarea rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta title</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta description</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={pending}>
          Guardar
        </Button>
      </form>
    </Form>
  );

  return (
    <AdminCrudShell title={title} description={description} formOpen form={formBody}>
      {null}
    </AdminCrudShell>
  );
}
