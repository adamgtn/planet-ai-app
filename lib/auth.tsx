"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getPB, type PBUser } from "./pocketbase";

type AuthCtx = {
  user: PBUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isMember: boolean;
  isAdmin: boolean; // admin OR super_admin
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const Context = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PBUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial hydration — baca authStore PocketBase dari localStorage
  useEffect(() => {
    const pb = getPB();
    if (pb.authStore.isValid && pb.authStore.model) {
      setUser(pb.authStore.model as unknown as PBUser);
    }
    setLoading(false);

    // Subscribe ke perubahan auth state
    const unsub = pb.authStore.onChange(() => {
      setUser(pb.authStore.model as unknown as PBUser | null);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const pb = getPB();
    const result = await pb
      .collection("users")
      .authWithPassword(email, password);
    setUser(result.record as unknown as PBUser);
  }, []);

  const logout = useCallback(() => {
    const pb = getPB();
    pb.authStore.clear();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const pb = getPB();
    if (!pb.authStore.isValid) return;
    try {
      const result = await pb.collection("users").authRefresh();
      setUser(result.record as unknown as PBUser);
    } catch {
      pb.authStore.clear();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthCtx>(() => {
    const role = user?.role;
    return {
      user,
      loading,
      isAuthenticated: !!user,
      isMember: role === "member",
      isAdmin: role === "admin" || role === "super_admin",
      isSuperAdmin: role === "super_admin",
      login,
      logout,
      refresh,
    };
  }, [user, loading, login, logout, refresh]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/**
 * Hook untuk halaman yang memerlukan login. Otomatis redirect ke /login
 * kalau user belum auth setelah loading selesai.
 */
export function useRequireAuth(opts?: { adminOnly?: boolean; superOnly?: boolean }) {
  const auth = useAuth();
  useEffect(() => {
    if (auth.loading) return;
    if (!auth.isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (opts?.adminOnly && !auth.isAdmin) {
      window.location.href = "/dashboard";
      return;
    }
    if (opts?.superOnly && !auth.isSuperAdmin) {
      window.location.href = "/admin";
      return;
    }
  }, [auth, opts?.adminOnly, opts?.superOnly]);
  return auth;
}
