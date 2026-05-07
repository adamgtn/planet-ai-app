"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Box,
  ChevronRight,
  Crown,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ADMIN_PERMISSIONS } from "@/lib/adminData";
import { useAuth } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  superAdminOnly?: boolean;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Member", icon: Users },
  { href: "/admin/products", label: "Produk", icon: Box },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  {
    href: "/admin/admins",
    label: "Admin Pengelola",
    icon: UserCog,
    superAdminOnly: true,
  },
];

export function AdminShell({
  title,
  description,
  actions,
  breadcrumb,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSuperAdmin, isAdmin, logout } = useAuth();
  const role = user?.role === "super_admin" ? "super_admin" : "admin";
  const meta = ADMIN_PERMISSIONS[role];

  const visibleNav = NAV.filter((i) => !i.superAdminOnly || isSuperAdmin);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Block render kalau belum login atau bukan admin (akan redirect)
  if (!isAdmin && user !== null) {
    if (typeof window !== "undefined") {
      router.push("/dashboard");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen flex-col border-r border-muted bg-white lg:flex">
          <div className="flex h-16 items-center border-b border-muted px-6">
            <Logo />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink/40">
              Admin Area
            </p>
            <nav className="space-y-1">
              {visibleNav.map((item) => {
                const Icon = item.icon;
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-brand text-white shadow-card"
                        : "text-ink/70 hover:bg-muted"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                    {item.superAdminOnly && (
                      <Crown
                        size={12}
                        className={`ml-auto ${
                          active ? "text-amber-200" : "text-amber-500"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <p className="mt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink/40">
              Lainnya
            </p>
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-muted"
              >
                <ShieldCheck size={18} /> Member Area
              </Link>
              <button
                type="button"
                disabled
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/40"
              >
                <Settings size={18} /> Pengaturan
              </button>
            </nav>
          </div>

          <div className="border-t border-muted p-4">
            <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full text-white ${
                  isSuperAdmin ? "bg-brand" : "bg-ink/70"
                }`}
              >
                {isSuperAdmin ? <Crown size={16} /> : <ShieldCheck size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {user?.name ?? "Admin"}
                </p>
                <p className="truncate text-[11px] text-ink/55">{meta.label}</p>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Keluar"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink/50 transition hover:bg-white hover:text-brand"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-muted bg-white/85 backdrop-blur lg:bg-white/70">
            <div className="flex h-16 items-center justify-between gap-4 px-6 lg:px-8">
              <div className="flex items-center gap-2 text-sm">
                {breadcrumb ? (
                  breadcrumb.map((b, i) => (
                    <span key={i} className="flex items-center gap-2">
                      {b.href ? (
                        <Link
                          href={b.href}
                          className="text-ink/60 hover:text-brand"
                        >
                          {b.label}
                        </Link>
                      ) : (
                        <span className="font-semibold text-ink">{b.label}</span>
                      )}
                      {i < breadcrumb.length - 1 && (
                        <ChevronRight size={14} className="text-ink/30" />
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-semibold text-ink">{title}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    isSuperAdmin
                      ? "bg-brand-50 text-brand"
                      : "bg-muted text-ink/70"
                  }`}
                >
                  {isSuperAdmin ? <Crown size={12} /> : <ShieldCheck size={12} />}
                  {meta.label}
                </span>
                <Link
                  href="/dashboard"
                  className="hidden rounded-xl border border-muted px-3 py-1.5 text-sm font-medium text-ink/70 transition hover:border-brand hover:text-brand md:inline-flex"
                >
                  Member Area
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-8 lg:px-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-ink lg:text-3xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 max-w-2xl text-sm text-ink/60">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
