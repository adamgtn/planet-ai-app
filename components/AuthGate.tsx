"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/**
 * Bungkus halaman yang membutuhkan login. Menampilkan loading saat
 * auth state masih hydrating, dan redirect ke /login kalau tidak auth.
 */
export function AuthGate({
  children,
  adminOnly = false,
  superOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
  superOnly?: boolean;
}) {
  const { user, loading, isAuthenticated, isAdmin, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (superOnly && !isSuperAdmin) {
      router.replace("/admin");
      return;
    }
    if (adminOnly && !isAdmin) {
      router.replace("/dashboard");
      return;
    }
  }, [
    loading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    adminOnly,
    superOnly,
    router,
  ]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40">
        <div className="flex items-center gap-3 text-sm text-ink/60">
          <span className="h-3 w-3 animate-pulse rounded-full bg-brand" />
          Memuat...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;
  if (superOnly && !isSuperAdmin) return null;

  // Cek status akun member tidak suspended/expired
  if (user && user.role === "member" && user.status !== "active") {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40 px-6">
        <div className="card-base max-w-md p-8 text-center">
          <h1 className="text-xl font-bold text-ink">Akun tidak aktif</h1>
          <p className="mt-2 text-sm text-ink/65">
            Status akunmu saat ini:{" "}
            <strong className="text-rose-600">{user.status}</strong>. Hubungi
            admin Planet AI untuk mengaktifkan kembali.
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            Hubungi Admin
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
