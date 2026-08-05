"use client";

import {
  Award,
  Briefcase,
  Building2,
  Eye,
  FolderKanban,
  GraduationCap,
  LayoutGrid,
  Menu,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { adminNav } from "@/config/admin-nav";
import { cn } from "@/lib/utils";

const icons = {
  User,
  Building2,
  Sparkles,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  Share2,
  Eye,
} as const;

export function AdminMobileNav({ brand }: { brand: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 lg:hidden">
      <Link href="/admin" className="font-heading text-sm font-semibold">
        {brand}
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          aria-label="Abrir menú"
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px]">
          <SheetHeader>
            <SheetTitle className="font-heading text-left">{brand}</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1" aria-label="Admin mobile">
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                pathname === "/admin"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/70",
              )}
            >
              <LayoutGrid className="size-4" />
              Inicio
            </Link>
            {adminNav.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons];
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/70",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
