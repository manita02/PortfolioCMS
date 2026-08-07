import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0d1f1e",
    theme_color: "#34908b",
    icons: [
      {
        src: "/icons/favicon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/icons/icon.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/icons/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
