"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { AdminAccountForm } from "@/components/admin/AdminAccountForm";
import { ADMIN_PERMISSIONS, type AdminAccount } from "@/lib/adminData";
import { useAuth } from "@/lib/auth";
import { getPB } from "@/lib/pocketbase";

export default function EditAdminPage() {
  const params = useParams<{ id: string }>();
  const { isSuperAdmin } = useAuth();
  const [account, setAccount] = useState<AdminAccount | null | undefined>();

  useEffect(() => {
    if (!isSuperAdmin) return;
    const pb = getPB();
    (async () => {
      try {
        const r = await pb.collection("users").getOne<{
          id: string;
          name: string;
          email: string;
          role: "super_admin" | "admin" | "member";
          status: string;
          created: string;
          last_login_at?: string;
        }>(params.id);
        if (r.role !== "admin" && r.role !== "super_admin") {
          setAccount(null);
          return;
        }
        setAccount({
          id: r.id,
          name: r.name,
          email: r.email,
          role: r.role,
          createdAt: r.created.slice(0, 10),
          lastLoginAt: r.last_login_at?.replace("T", " ").slice(0, 16) ?? "—",
          active: r.status === "active",
        });
      } catch {
        setAccount(null);
      }
    })();
  }, [params.id, isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Admin Pengelola", href: "/admin/admins" },
          { label: "Edit" },
        ]}
        title="Edit Admin"
      >
        <AccessDenied reason="Hanya Super Admin yang dapat mengubah akun admin lain." />
      </AdminShell>
    );
  }

  if (account === undefined) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Admin Pengelola", href: "/admin/admins" },
          { label: "Edit" },
        ]}
        title="Memuat..."
      >
        <p className="text-sm text-ink/55">Memuat data admin...</p>
      </AdminShell>
    );
  }

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
      <AdminAccountForm mode="edit" initial={account} />
    </AdminShell>
  );
}
