export const siteConfig = {
  name: "PortfolioCMS",
  description: "Portfolio profesional y CMS personal",
  version: "0.1.0",
  getUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  },
} as const;
