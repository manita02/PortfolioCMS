"use client";

import { Download, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { homeScrollSections, publicNav } from "@/config/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

export function SiteHeader({ brand }: { brand: string }) {
  const pathname = usePathname();
  const scrolled = useScrolled(12);
  const onHome = pathname === "/";
  const activeSection = useActiveSection(homeScrollSections, onHome);
  const [open, setOpen] = useState(false);

  function navHref(item: (typeof publicNav)[number]) {
    if (onHome && item.sectionId) {
      return `/#${item.sectionId}`;
    }
    return item.href;
  }

  function isActive(item: (typeof publicNav)[number]) {
    if (onHome && item.sectionId) {
      if (item.sectionId === "hero") {
        return activeSection === "hero" || activeSection === "sobre-mi";
      }
      return activeSection === item.sectionId;
    }
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/75 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-sm font-semibold tracking-tight sm:text-base"
        >
          {brand}
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {publicNav.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={navHref(item)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-foreground/5 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href="/cv/pdf?download=1"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            <Download className="size-3.5" />
            Descargar CV
          </a>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "lg:hidden",
              )}
              aria-label="Abrir menú"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,320px)]">
              <SheetHeader>
                <SheetTitle className="font-heading text-left">{brand}</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {publicNav.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={navHref(item)}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-xl px-3 py-3 text-base transition-colors",
                        active
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <a
                href="/cv/pdf?download=1"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-8 w-full",
                )}
              >
                <Download className="size-4" />
                Descargar CV
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
