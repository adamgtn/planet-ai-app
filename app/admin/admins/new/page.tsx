"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { AdminAccountForm } from "@/components/admin/AdminAccountForm";
import { useAdminRole } from "@/lib/adminRole";

export default function NewAdminPage() {
  const { isSuperAdmin } = useAdminRole();

  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Admin Pengelola", href: "/admin/admins" },
        { label: "Tambah Admin" },
      ]}
      title="Tambah Admin Baru"
      description="Buat akun untuk admin baru. Hanya Super Admin yang dapat melakukan ini."
    >
      {isSuperAdmin ? (
        <AdminAccountForm mode="create" />
      ) : (
        <AccessDenied reason="Hanya Super Admin yang dapat menambah akun admin baru." />
      )}
    </AdminShell>
  );
}
