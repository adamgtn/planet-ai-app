"use client";

import { notFound, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { UserForm } from "@/components/admin/UserForm";
import { useUser } from "@/lib/dataStore";

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const user = useUser(params.id);
  if (!user) notFound();

  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Member", href: "/admin/users" },
        { label: user.name },
      ]}
      title={`Edit ${user.name}`}
      description={`Kelola informasi akun, status, dan hak akses produk untuk ${user.email}.`}
    >
      <UserForm mode="edit" initial={user} />
    </AdminShell>
  );
}
