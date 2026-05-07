"use client";

/**
 * Backward-compat shim: dulu modul ini menyediakan AdminRoleProvider untuk
 * mock role switcher di demo. Sekarang role diambil dari auth user
 * (PocketBase). File ini tetap diekspor agar tidak memecahkan import existing.
 */

import { useAuth } from "./auth";
import type { AdminRole } from "./adminData";

export function AdminRoleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function useAdminRole() {
  const { user, isSuperAdmin } = useAuth();
  const role: AdminRole = (user?.role === "super_admin"
    ? "super_admin"
    : "admin") as AdminRole;
  return {
    role,
    isSuperAdmin,
    setRole: () => {
      // no-op: role real diatur lewat dashboard PocketBase / form admin
    },
  };
}
