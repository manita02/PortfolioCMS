import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function buildMetadata(params: {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
}): Metadata {
  const path = params.path ?? "";
  const url = `${siteConfig.getUrl()}${path}`;

  return {
    title: params.title,
    description: params.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: params.title,
      description: params.description,
      url,
      siteName: siteConfig.name,
      locale: "es_ES",
      type: "website",
      images: params.image ? [{ url: params.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: params.title,
      description: params.description,
      images: params.image ? [params.image] : undefined,
    },
  };
}
