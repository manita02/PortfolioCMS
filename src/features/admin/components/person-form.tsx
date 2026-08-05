"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  availabilityStatusItems,
  type AvailabilityStatus,
} from "@/constants/availability";
import { storageBuckets } from "@/constants/storage-buckets";
import { upsertPersonAction } from "@/features/admin/actions/person";
import { AdminCrudShell } from "@/features/admin/components/admin-crud-shell";
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
  availability_status?: string;
  profile_image_path?: string | null;
  banner_image_path?: string | null;
  cv_pdf_path?: string | null;
  professional_title?: string | null;
  subtitle?: string | null;
  about?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
} | null;

function toDefaults(person: PersonRow): PersonInput {
  return {
    firstName: person?.first_name ?? "",
    lastName: person?.last_name ?? "",
    email: person?.email ?? "",
    availabilityStatus:
      (person?.availability_status as PersonInput["availabilityStatus"]) ??
      "open",
    profileImagePath: person?.profile_image_path ?? null,
    bannerImagePath: person?.banner_image_path ?? null,
    cvPdfPath: person?.cv_pdf_path ?? null,
    professionalTitle: person?.professional_title ?? "",
    subtitle: person?.subtitle ?? "",
    about: person?.about ?? "",
    metaTitle: person?.meta_title ?? "",
    metaDescription: person?.meta_description ?? "",
  };
}

export function PersonForm({
  person,
  title,
  description,
}: {
  person: PersonRow;
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

  function onSubmit(values: PersonInput) {
    startTransition(async () => {
      try {
        await upsertPersonAction(values);
        toast.success("Guardado correctamente");
        form.reset(values);
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
            name="availabilityStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disponibilidad</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value != null) {
                      field.onChange(value as AvailabilityStatus);
                    }
                  }}
                  items={availabilityStatusItems}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availabilityStatusItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
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
          <FormField
            control={form.control}
            name="cvPdfPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CV PDF (archivo)</FormLabel>
                <MediaUploader
                  bucket={storageBuckets.cv}
                  value={field.value}
                  onChange={field.onChange}
                  folder="person"
                  accept="application/pdf"
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
          {"Guardar"}
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
