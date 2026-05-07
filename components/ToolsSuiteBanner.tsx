import Link from "next/link";
import { ArrowRight, Braces, Sparkles, Wand2 } from "lucide-react";

export function ToolsSuiteBanner() {
  return (
    <section className="card-base relative overflow-hidden">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="absolute -bottom-16 left-32 h-44 w-44 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
            <Sparkles size={14} /> AI Tools Suite
          </span>
          <h2 className="mt-3 text-2xl font-bold text-ink md:text-3xl">
            Bikin prompt & JSON dalam hitungan detik
          </h2>
          <p className="mt-2 max-w-md text-sm text-ink/65">
            Dua tool produktivitas untuk meracik instruksi AI tanpa hafal
            struktur, dan menyusun JSON tanpa khawatir syntax error.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/tools/prompt-generator" className="btn-primary">
              Buka Tools <ArrowRight size={16} />
            </Link>
            <Link href="/tools/json-builder" className="btn-ghost">
              JSON Builder
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          <Link
            href="/tools/prompt-generator"
            className="group rounded-2xl border border-muted bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-cardHover"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand">
              <Wand2 size={20} />
            </div>
            <p className="mt-3 text-sm font-bold text-ink">Prompt Generator</p>
            <p className="mt-0.5 text-xs text-ink/60">
              Video AI · Image · Text — dynamic field & live preview.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand">
              Mulai meracik <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/tools/json-builder"
            className="group rounded-2xl border border-muted bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-cardHover"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand">
              <Braces size={20} />
            </div>
            <p className="mt-3 text-sm font-bold text-ink">JSON Builder</p>
            <p className="mt-0.5 text-xs text-ink/60">
              Key-value editor · type selector · auto-format & download.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand">
              Susun JSON <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
