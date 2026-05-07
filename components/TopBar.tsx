"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, ShieldCheck, User } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth";

export function TopBar() {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const displayName = user?.name || "Member";
  const displayRole =
    user?.role === "super_admin"
      ? "Super Admin"
      : user?.role === "admin"
      ? "Admin"
      : "Member";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <header className="sticky top-0 z-30 border-b border-muted bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/dashboard"
            className="rounded-lg px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-muted hover:text-ink"
          >
            Dashboard
          </Link>
          <Link
            href="/tools/prompt-generator"
            className="rounded-lg px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-muted hover:text-ink"
          >
            AI Tools
          </Link>
          <Link
            href="/profile"
            className="rounded-lg px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-muted hover:text-ink"
          >
            Profil
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              href="/admin"
              title="Buka Admin Area"
              className="hidden items-center gap-1.5 rounded-xl border border-brand/30 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white sm:inline-flex"
            >
              <ShieldCheck size={14} /> Admin
            </Link>
          )}
          <button
            type="button"
            aria-label="Notifikasi"
            className="grid h-10 w-10 place-items-center rounded-xl border border-muted text-ink/70 transition hover:border-brand hover:text-brand"
          >
            <Bell size={18} />
          </button>
          <Link
            href="/profile"
            className="hidden items-center gap-3 rounded-xl border border-muted px-3 py-1.5 transition hover:border-brand sm:flex"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-brand">
              <User size={16} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-semibold text-ink">{displayName}</p>
              <p className="text-xs text-ink/60">{displayRole}</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Keluar"
            className="grid h-10 w-10 place-items-center rounded-xl border border-muted text-ink/70 transition hover:border-brand hover:text-brand"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
