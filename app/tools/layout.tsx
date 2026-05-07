"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces, Sparkles, Wand2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";

const TABS = [
  { href: "/tools/prompt-generator", label: "Prompt Generator", icon: Wand2 },
  { href: "/tools/json-builder", label: "JSON Builder", icon: Braces },
];

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/40">
      <TopBar />
      <main className="mx-auto max-w-7xl px-6 pb-12 pt-8">
        <header className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
            <Sparkles size={14} /> AI Tools Suite
          </span>
          <h1 className="mt-3 text-3xl font-bold text-ink">
            Produktivitas AI dalam satu tempat
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink/65">
            Pilih salah satu tools di bawah untuk mulai meracik prompt yang
            optimal atau menyusun struktur JSON tanpa drama syntax.
          </p>
        </header>

        <nav className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = pathname === t.href;
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-brand text-white shadow-card"
                    : "border border-muted bg-white text-ink/70 hover:border-brand hover:text-brand"
                }`}
              >
                <Icon size={16} /> {t.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </main>
    </div>
  );
}
