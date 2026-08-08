/** Admin nunca se sirve desde cache público (sesión + cookies). */
export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
