// Hero section LP PlanetPrompt — layout promo (badge → headline → harga →
// subline → deskripsi → pills → divider → grid 7 engine → CTA → catatan).
// Background terang + aksen brand (ungu) sesuai tema existing. Headline pakai
// font display (Anton via next/font, var --font-anton). Body pakai font LP.

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Clock,
  Layers,
  LayoutGrid,
  MessageSquare,
  Palette,
  Scan,
  Sparkles,
  Users,
  Youtube,
  type LucideIcon,
} from "lucide-react";

const ENGINES: { icon: LucideIcon; label: string }[] = [
  { icon: Palette, label: "Logo" },
  { icon: LayoutGrid, label: "Design Grafis" },
  { icon: Youtube, label: "YouTube Thumbnail" },
  { icon: Scan, label: "Anatomi" },
  { icon: BookOpen, label: "Comic" },
  { icon: BarChart3, label: "Infografis" },
  { icon: Sparkles, label: "Creative Prompt" },
];

const PILLS: { icon: LucideIcon; pre?: string; strong: string; rest?: string }[] = [
  { icon: Layers, strong: "Banyak", rest: "format konten" },
  { icon: MessageSquare, strong: "Prompt", rest: "siap pakai" },
  { icon: Users, pre: "Cocok untuk", strong: "UMKM & kreator" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 lg:pt-40">
      {/* glow latar (brand, terang) — tema tidak diubah */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[1100px] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand/10 blur-[90px]" />

      <div className="relative mx-auto flex max-w-[860px] flex-col items-center px-6 text-center">
        {/* 1. Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-brand/30">
          <Sparkles size={13} /> Promo Spesial
        </span>

        {/* 2. Headline (Anton, uppercase, skew -6deg) */}
        <h1
          className="mt-6 font-display uppercase leading-[0.95] tracking-wide text-ink"
          style={{
            transform: "skewX(-6deg)",
            fontSize: "clamp(2.1rem, 8.5vw, 4.5rem)",
          }}
        >
          Satu Toolkit, Semua Jenis{" "}
          <span className="text-brand">Konten Visual</span>
        </h1>

        {/* 3. Blok harga */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-lg font-bold uppercase tracking-wide text-ink/70 md:text-xl">
            Hanya
          </span>
          <span
            className="font-display leading-none text-brand"
            style={{ fontSize: "clamp(3.4rem, 15vw, 7rem)" }}
          >
            99
          </span>
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-lg font-bold uppercase tracking-wide text-ink/70 md:text-xl">
              Ribu
            </span>
            <span
              className="inline-block rounded-md bg-brand px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-white"
              style={{ transform: "skewX(-6deg)" }}
            >
              Disc 40%
            </span>
          </div>
        </div>

        {/* 4. Subline */}
        <p className="mt-5 text-base font-bold text-ink md:text-lg">
          Sekali bayar · akses seumur hidup · tanpa kredit
        </p>

        {/* 5. Deskripsi */}
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/65 md:text-base">
          Bikin logo, banner, comic,{" "}
          <strong className="font-bold text-ink/85">infografis</strong>, thumbnail,
          analogi, dan poster{" "}
          <strong className="font-bold text-ink/85">tanpa skill desain</strong>.
        </p>

        {/* 6. 3 pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {PILLS.map((p) => {
            const Icon = p.icon;
            return (
              <span
                key={p.strong}
                className="inline-flex items-center gap-2 rounded-full border border-muted bg-white px-3.5 py-2 text-xs font-medium text-ink/75 shadow-sm md:text-sm"
              >
                <Icon size={15} className="shrink-0 text-brand" />
                <span>
                  {p.pre ? p.pre + " " : ""}
                  <strong className="font-bold text-ink">{p.strong}</strong>
                  {p.rest ? " " + p.rest : ""}
                </span>
              </span>
            );
          })}
        </div>

        {/* 7. Divider berlabel */}
        <div className="mt-10 flex w-full items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-muted" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
            7 Engine Kreatif
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-muted" />
        </div>

        {/* 8. Grid 7 engine (desktop 7 kolom, mobile 3 kolom) */}
        <div className="mt-6 grid w-full grid-cols-3 gap-3 md:grid-cols-7">
          {ENGINES.map((e) => {
            const Icon = e.icon;
            return (
              <div
                key={e.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-muted bg-white p-3 shadow-sm"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand">
                  <Icon size={18} />
                </span>
                <span className="text-[11px] font-semibold leading-tight text-ink/75">
                  {e.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 9. CTA full-width */}
        <a
          href="#pricing"
          className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-8 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-xl shadow-brand/30 transition hover:scale-[1.01] hover:bg-brand-600 md:text-lg"
        >
          Mulai Sekarang <ArrowRight size={20} />
        </a>

        {/* 10. Catatan */}
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink/55">
          <Clock size={13} /> Promo terbatas
        </p>
      </div>
    </section>
  );
}
