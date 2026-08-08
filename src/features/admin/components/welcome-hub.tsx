"use client";

import {
  Briefcase,
  Building2,
  Eye,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminNav } from "@/config/admin-nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const icons = {
  User,
  Building2,
  Sparkles,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Share2,
  Eye,
} as const;

const descriptions: Record<string, string> = {
  "/admin/persona": "Datos personales, bio y SEO.",
  "/admin/organizaciones": "Empresas e instituciones.",
  "/admin/habilidades": "Stack técnico y soft skills.",
  "/admin/experiencias": "Roles y trayectoria laboral.",
  "/admin/educacion": "Formación académica y cursos.",
  "/admin/proyectos": "Portfolio de proyectos.",
  "/admin/redes-sociales": "Enlaces a redes y perfiles.",
  "/admin/preview": "Vista previa del sitio público.",
};

export function WelcomeHub() {
  const reduce = useReducedMotion();
  const portfolioUrl = siteConfig.getUrl();

  const cards = [
    ...adminNav.map((item) => ({
      href: item.href,
      label: item.label,
      icon: item.icon,
      external: false,
      description: descriptions[item.href] ?? "Gestionar contenido.",
    })),
    {
      href: portfolioUrl,
      label: "Ver portfolio",
      icon: "External" as const,
      external: true,
      description: "Abrí el sitio público en una nueva pestaña.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          CMS
        </p>
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          Bienvenido
        </h1>
        <p className="text-muted-foreground max-w-xl text-base">
          Administrá el contenido de tu portfolio desde un solo lugar.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((item, index) => {
          const Icon =
            item.icon === "External"
              ? ExternalLink
              : icons[item.icon as keyof typeof icons];
          const content = (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: Math.min(index * 0.04, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group bg-card hover:border-foreground/20 flex h-full flex-col gap-4 rounded-2xl border border-border/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="bg-muted text-foreground group-hover:bg-accent inline-flex size-11 items-center justify-center rounded-xl transition-colors">
                <Icon className="size-5" />
              </span>
              <div className="space-y-1">
                <h2 className="font-heading text-lg tracking-tight">
                  {item.label}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              <span
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-auto w-fit",
                )}
              >
                {item.external ? "Ver portfolio" : "Gestionar"}
              </span>
            </motion.div>
          );

          return (
            <li key={item.href}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <Link href={item.href}>{content}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
