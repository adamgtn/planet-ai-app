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
    // Support both v0.22- (model) dan v0.23+ (record) API
    const record =
      (pb.authStore as unknown as { record?: PBUser; model?: PBUser })
        .record ??
      (pb.authStore as unknown as { record?: PBUser; model?: PBUser })
        .model ??
      null;
    if (pb.authStore.isValid && record) {
      setUser(record);
    }
    setLoading(false);

    // Subscribe ke perubahan auth state
    const unsub = pb.authStore.onChange(() => {
      const r =
        (pb.authStore as unknown as { record?: PBUser; model?: PBUser })
          .record ??
        (pb.authStore as unknown as { record?: PBUser; model?: PBUser })
          .model ??
        null;
      setUser(r);
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
      // VIP dianggap member juga (cuma role beda buat gate fitur VIP di /app)
      isMember: role === "member" || role === "vip",
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
