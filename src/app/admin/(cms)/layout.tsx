import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminMobileNav } from "@/features/admin/components/admin-mobile-nav";
import { AdminRouteLoader } from "@/features/admin/components/admin-route-loader";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { assertAdmin } from "@/lib/supabase/admin";
import { getPerson } from "@/services/person.service";

export default async function AdminCmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await assertAdmin();

  if (result.reason === "unauthenticated") {
    redirect("/admin/login");
  }
  if (result.reason === "forbidden") {
    redirect("/");
  }

  const person = await getPerson();
  const brand = person
    ? `${person.firstName} ${person.lastName}`
    : "Portfolio";

  return (
    <div className="bg-background flex min-h-screen">
      <AdminSidebar brand={brand} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav brand={brand} />
        <AdminTopbar email={result.user?.email} />
        <div className="relative min-h-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <AdminRouteLoader />
          {children}
        </div>
      </div>
    </div>
  );
}
