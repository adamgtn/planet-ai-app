"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AdminRole } from "./adminData";

const STORAGE_KEY = "planetai.adminRole";

type Ctx = {
  role: AdminRole;
  setRole: (r: AdminRole) => void;
  isSuperAdmin: boolean;
};

const RoleContext = createContext<Ctx | null>(null);

export function AdminRoleProvider({
  children,
  initial = "super_admin",
}: {
  children: React.ReactNode;
  initial?: AdminRole;
}) {
  const [role, setRoleState] = useState<AdminRole>(initial);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "admin" || stored === "super_admin") {
        setRoleState(stored);
      }
    } catch {}
  }, []);

  const setRole = useCallback((r: AdminRole) => {
    setRoleState(r);
    try {
      window.localStorage.setItem(STORAGE_KEY, r);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({ role, setRole, isSuperAdmin: role === "super_admin" }),
    [role, setRole]
  );

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
}

export function useAdminRole(): Ctx {
  const ctx = useContext(RoleContext);
  if (!ctx)
    throw new Error("useAdminRole must be used within AdminRoleProvider");
  return ctx;
}
