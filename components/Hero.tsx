// Hero section LP PlanetPrompt — layout promo, tema GELAP-UNGU.
// Background gelap (#0d0818) + grid halus + glow violet/fuchsia, senada dengan
// section gelap lain di LP (UseCase & 7 Engine). Aksen: ungu (brand/violet) +
// gold/amber untuk harga & badge. Headline pakai font display (Anton via
// next/font, var --font-anton). Alur: badge → headline → harga → subline →
// deskripsi → pills → divider → grid 7 engine (tanpa box) → CTA → catatan.

import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Clock,
  Layers,
  LayoutGrid,
  Palette,
  RefreshCw,
  Rocket,
  Scan,
  Sparkles,
  Youtube,
  Zap,
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
  { icon: RefreshCw, pre: "Konten", strong: "update setiap hari" },
  { icon: Rocket, pre: "Penambahan", strong: "tools baru!" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0d0818] pb-16 pt-32 lg:pt-40">
      {/* grid halus + mask radial biar fade ke tepi */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 75% 60% at 50% 22%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 60% at 50% 22%, #000 40%, transparent 100%)",
        }}
      />
      {/* glow violet/fuchsia */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[100px]" />

      <div className="relative mx-auto flex max-w-[860px] flex-col items-center px-6 text-center">
        {/* 1. Badge (gold) */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#2a1500] shadow-lg shadow-amber-500/20">
          <Zap size={13} fill="currentColor" /> Promo Spesial
        </span>

        {/* 2. Headline (Anton, uppercase, skew -6deg) */}
        <h1
          className="mt-6 font-display uppercase leading-[0.95] tracking-wide text-white"
          style={{
            transform: "skewX(-6deg)",
            fontSize: "clamp(2.1rem, 8.5vw, 4.5rem)",
          }}
        >
          Satu Toolkit, Semua Jenis{" "}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Konten Visual
          </span>
        </h1>

        {/* 3. Blok harga (gold) */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-lg font-bold uppercase tracking-wide text-white/70 md:text-xl">
            Hanya
          </span>
          <span
            className="font-display leading-none text-amber-300 [text-shadow:0_0_38px_rgba(252,211,77,0.35)]"
            style={{ fontSize: "clamp(3.4rem, 15vw, 7rem)" }}
          >
            64
          </span>
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-lg font-bold uppercase tracking-wide text-white/70 md:text-xl">
              Ribu
            </span>
            <span
              className="inline-block rounded-md bg-amber-400 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[#2a1500]"
              style={{ transform: "skewX(-6deg)" }}
            >
              Disc 40%
            </span>
          </div>
        </div>

        {/* 4. Subline */}
        <p className="mt-5 text-base font-bold text-white md:text-lg">
          Sekali bayar · akses seumur hidup · tanpa kredit
        </p>

        {/* 5. Deskripsi */}
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
          Bikin <strong className="font-bold text-white">logo</strong>, banner,{" "}
          <strong className="font-bold text-white">comic</strong>, infografis,{" "}
          <strong className="font-bold text-white">thumbnail</strong>, analogi,
          dan poster tanpa skill desain.
        </p>

        {/* 5b. Banner creative (contoh hasil) — di bawah caption */}
        <div className="mt-6 w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-violet-900/40 ring-1 ring-white/5">
          <Image
            src="/lp/planetprompt/hero/banner-hero.webp"
            alt="Contoh hasil konten PlanetPrompt — logo, banner, comic, infografis, thumbnail"
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 860px"
            className="h-auto w-full"
          />
        </div>

        {/* 6. 3 pills — di HP grid 3 kolom (sejajar), desktop jadi row */}
        <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-2 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-2.5">
          {PILLS.map((p) => {
            const Icon = p.icon;
            return (
              <span
                key={p.strong}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2.5 text-center text-[11px] font-medium text-white/75 backdrop-blur-sm sm:flex-row sm:gap-2 sm:rounded-full sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <Icon size={15} className="shrink-0 text-violet-300" />
                <span>
                  {p.pre ? p.pre + " " : ""}
                  <strong className="font-bold text-white">{p.strong}</strong>
                  {p.rest ? " " + p.rest : ""}
                </span>
              </span>
            );
          })}
        </div>

        {/* 7. Divider berlabel */}
        <div className="mt-10 flex w-full items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
            7 Engine Kreatif
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
        </div>

        {/* 8. Grid 7 engine — tanpa box (icon + label aja, hemat tempat) */}
        <div className="mt-7 flex w-full flex-wrap justify-center gap-x-4 gap-y-5">
          {ENGINES.map((e) => {
            const Icon = e.icon;
            return (
              <div
                key={e.label}
                className="flex w-16 flex-col items-center gap-2 text-center"
              >
                <Icon
                  size={24}
                  className="text-violet-300 drop-shadow-[0_0_10px_rgba(167,139,250,0.45)]"
                />
                <span className="text-[11px] font-semibold leading-tight text-white/70">
                  {e.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 9. CTA full-width */}
        <a
          href="#pricing"
          className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-xl shadow-violet-500/30 transition hover:scale-[1.01] hover:brightness-110 md:text-lg"
        >
          Coba Sekarang <ArrowRight size={20} />
        </a>

        {/* 10. Catatan */}
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/45">
          <Clock size={13} /> Promo terbatas
        </p>
      </div>
    </section>
  );
}
