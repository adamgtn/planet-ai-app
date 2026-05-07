import { AdminRoleProvider } from "@/lib/adminRole";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRoleProvider>{children}</AdminRoleProvider>;
}
