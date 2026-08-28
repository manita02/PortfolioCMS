"use client";

import {
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Share2,
  Sparkles,
  Tags,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { adminNav } from "@/config/admin-nav";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const icons = {
  User,
  Building2,
  Sparkles,
  Tags,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Share2,
  Eye,
} as const;

const STORAGE_KEY = "admin-sidebar-collapsed";

export function AdminSidebar({
  brand,
  className,
}: {
  brand: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const portfolioUrl = siteConfig.getUrl();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/70 transition-[width] duration-200 lg:flex",
        collapsed ? "w-[72px]" : "w-60",
        className,
      )}
    >
      <div className="flex h-full flex-col px-2 py-4">
        <div
          className={cn(
            "mb-4 flex items-center gap-2 px-2",
            collapsed && "justify-center px-0",
          )}
        >
          <Link
            href="/admin"
            className={cn(
              "min-w-0",
              collapsed && "flex size-9 items-center justify-center rounded-lg",
            )}
          >
            {collapsed ? (
              <LayoutGrid className="size-4" />
            ) : (
              <div>
                <p className="font-heading truncate text-sm font-semibold tracking-tight">
                  {brand}
                </p>
                <p className="text-muted-foreground text-xs">CMS</p>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground ml-auto inline-flex size-8 items-center justify-center rounded-lg transition-colors",
              collapsed && "ml-0",
            )}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5" aria-label="Admin">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
              pathname === "/admin"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
            title="Inicio"
          >
            <LayoutGrid className="size-4 shrink-0" />
            {!collapsed ? <span>Inicio</span> : null}
          </Link>

          <Separator className="my-2" />

          {adminNav.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons];
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                  collapsed && "justify-center px-0",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 px-1 pt-4">
          <Separator />
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver portfolio"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full",
              collapsed && "px-0",
            )}
          >
            <ExternalLink className="size-3.5" />
            {!collapsed ? "Ver portfolio" : null}
          </a>
          <button
            type="button"
            onClick={onSignOut}
            title="Cerrar sesión"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground w-full",
              collapsed && "px-0",
            )}
          >
            <LogOut className="size-3.5" />
            {!collapsed ? "Cerrar sesión" : null}
          </button>
          {!collapsed ? (
            <p className="text-muted-foreground px-1 pt-1 text-[10px]">
              v{siteConfig.version ?? "0.1.0"}
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
