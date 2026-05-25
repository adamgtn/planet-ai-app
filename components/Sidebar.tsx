"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Braces,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  User,
  Wand2,
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

const TOOLS_ITEMS: NavItem[] = [
  {
    href: "/tools/prompt-generator",
    label: "Prompt Generator",
    icon: Wand2,
    match: (p) => p.startsWith("/tools/prompt-generator"),
  },
  {
    href: "/tools/json-builder",
    label: "JSON Builder",
    icon: Braces,
    match: (p) => p.startsWith("/tools/json-builder"),
  },
];

export function Sidebar() {
  const pathname = usePathname() ?? "";
  const { isAdmin } = useAuth();

  const groups: NavGroup[] = [
    { title: "Menu Utama", items: MAIN_ITEMS },
    { title: "AI Tools", items: TOOLS_ITEMS },
  ];

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

        <div className="mt-auto rounded-2xl border border-brand/15 bg-brand-50/60 p-4">
          <div className="flex items-center gap-2 text-brand">
            <Sparkles size={14} />
            <span className="text-xs font-semibold">Tips</span>
          </div>
          <p className="mt-1.5 text-xs text-ink/70">
            Pakai <span className="font-semibold">AI Tools</span> untuk bikin
            prompt & JSON tanpa hafal struktur.
          </p>
        </div>
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
