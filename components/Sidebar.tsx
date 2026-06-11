"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  User,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const MAIN_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (p) => p === "/dashboard" || p.startsWith("/learn"),
  },
  {
    href: "/profile",
    label: "Profil",
    icon: User,
    match: (p) => p.startsWith("/profile"),
  },
];

// Catatan: grup "AI Tools" (Prompt Generator + JSON Builder) disembunyikan dulu
// (2026-06-11). /tools/* di-redirect ke /dashboard via next.config — kode tool
// masih ada, tinggal kembalikan grup ini kalau mau diaktifkan lagi.

export function Sidebar() {
  const pathname = usePathname() ?? "";
  const { isAdmin } = useAuth();

  const groups: NavGroup[] = [{ title: "Menu Utama", items: MAIN_ITEMS }];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-muted bg-white/60 lg:block">
      <nav className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink/45">
              {group.title}
            </p>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  active={
                    item.match ? item.match(pathname) : pathname === item.href
                  }
                />
              ))}
            </ul>
          </div>
        ))}

        {isAdmin && (
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink/45">
              Admin Area
            </p>
            <ul className="flex flex-col gap-1">
              <SidebarLink
                item={{
                  href: "/admin",
                  label: "Admin Dashboard",
                  icon: ShieldCheck,
                  match: (p) => p.startsWith("/admin"),
                }}
                active={pathname.startsWith("/admin")}
              />
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          active
            ? "bg-brand text-white shadow-card"
            : "text-ink/75 hover:bg-muted hover:text-ink"
        }`}
      >
        <Icon size={18} className={active ? "text-white" : "text-ink/55"} />
        {item.label}
      </Link>
    </li>
  );
}
