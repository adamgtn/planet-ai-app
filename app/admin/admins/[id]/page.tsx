"use client";

import { notFound, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { AdminAccountForm } from "@/components/admin/AdminAccountForm";
import { adminAccounts, ADMIN_PERMISSIONS } from "@/lib/adminData";
import { useAdminRole } from "@/lib/adminRole";

export default function EditAdminPage() {
  const params = useParams<{ id: string }>();
  const account = adminAccounts.find((a) => a.id === params.id);
  const { isSuperAdmin } = useAdminRole();

  if (!account) notFound();

  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Admin Pengelola", href: "/admin/admins" },
        { label: account.name },
      ]}
      title={`Edit ${account.name}`}
      description={`${ADMIN_PERMISSIONS[account.role].label} · ${account.email}`}
    >
      {isSuperAdmin ? (
        <AdminAccountForm mode="edit" initial={account} />
      ) : (
        <AccessDenied reason="Hanya Super Admin yang dapat mengubah akun admin lain." />
      )}
    </AdminShell>
  );
}
