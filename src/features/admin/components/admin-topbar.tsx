"use client";

import { ChevronRight, ExternalLink, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminNav } from "@/config/admin-nav";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function resolveCrumb(pathname: string) {
  if (pathname === "/admin") {
    return [{ label: "Inicio", href: "/admin" }];
  }
  const match = adminNav.find((item) => pathname.startsWith(item.href));
  return [
    { label: "Inicio", href: "/admin" },
    {
      label: match ? match.label : "Admin",
      href: match?.href,
    },
  ];
}

export function AdminTopbar({
  email,
  title,
}: {
  email?: string | null;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const crumbs = resolveCrumb(pathname);
  const pageTitle =
    title ??
    (pathname === "/admin"
      ? "Inicio"
      : (adminNav.find((i) => pathname.startsWith(i.href))?.label ?? "Admin"));
  const initials = (email?.[0] ?? "A").toUpperCase();
  const portfolioUrl = siteConfig.getUrl();

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-background/80 sticky top-0 z-30 border-b border-border/70 backdrop-blur-xl">
      <div className="flex flex-col gap-3 px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <nav aria-label="Breadcrumb" className="hidden sm:block">
              <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
                {crumbs.map((crumb, index) => (
                  <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                    {index > 0 ? (
                      <ChevronRight className="size-3 opacity-50" aria-hidden />
                    ) : null}
                    {crumb.href && index < crumbs.length - 1 ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-foreground font-medium">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <h1 className="font-heading truncate text-lg tracking-tight sm:text-xl">
              {pageTitle}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden md:inline-flex",
              )}
            >
              <ExternalLink className="size-3.5" />
              Ver portfolio
            </a>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "rounded-full",
                )}
                aria-label="Admin"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="space-y-1 font-normal">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <UserRound className="size-3.5" />
                    Admin
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => window.open(portfolioUrl, "_blank")}
                >
                  <ExternalLink className="size-4" />
                  Ver portfolio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
