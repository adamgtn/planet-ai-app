"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { trackLead } from "@/lib/pixels";
import Hero from "@/components/Hero";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Coffee,
  Copy,
  Crown,
  FileText,
  Gamepad2,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  MessageCircle,
  Palette,
  PartyPopper,
  Phone,
  Play,
  Scan,
  Scissors,
  Shirt,
  ShoppingBag,
  Sparkles,
  Sparkles as SparklesIcon,
  Star,
  Store,
  Tag,
  Users,
  Utensils,
  Wand2,
  Youtube,
  X,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG

// Nomor admin WhatsApp PlanetPrompt — format international tanpa "+"
// (085780685293 → 62 + 85780685293)
const WA_NUMBER = "6285780685293";
const COMMUNITY_LINK = "https://chat.whatsapp.com/FRSMZRQk6mABqMJdwkZw0l";
const VIDEO_DEMO_ID = "dQw4w9WgXcQ";

// Gambar showcase produk real (54 file di /public/lp/planetprompt/showcase/)
const showcaseImages = Array.from(
  { length: 54 },
  (_, i) =>
    `/lp/planetprompt/showcase/showcase-${(i + 1).toString().padStart(2, "0")}.webp`
);
const heroProducts = showcaseImages.slice(0, 4);

// ─────────────────────────────────────────────────────────────────────────────

export default function PlanetPromptLanding() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyCta(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="theme-purple min-h-screen bg-white text-ink">
      <Navbar />
      <Hero />
      <ShowcaseMarqueeSection />
      <ProblemSection />
      <ExampleOutputSection />
      <NewEnginesSection />
      <SolutionSection />
      <HowItWorksSection />
      <UseCaseSection />
      <FeaturesSection />
      <DesignPromptKitSection />
      <BeforeAfterSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
      <CommunityCta />
      <Footer />

      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
      {showStickyCta && <StickyMobileCta />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all ${
        scrolled
          ? "border-b border-muted bg-white/90 py-3 backdrop-blur-md shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/brand/planetsoft-icon.png"
            alt="PlanetPrompt"
            width={72}
            height={72}
            priority
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span
            className={`text-lg font-bold tracking-tight transition-colors ${
              scrolled ? "text-ink" : "text-white"
            }`}
          >
            planet<span className="text-brand">prompt</span>
          </span>
        </div>
        <a
          href={COMMUNITY_LINK}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
            scrolled
              ? "border-brand/30 bg-brand-50 text-brand hover:bg-brand hover:text-white"
              : "border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-brand"
          }`}
        >
          <Users size={14} /> Join Member
        </a>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO

// Hero dipindah ke komponen terpisah: components/Hero.tsx

function PromptCard({
  icon,
  title,
  hint,
  tone,
}: {
  icon: string;
  title: string;
  hint: string;
  tone: "brand" | "amber" | "emerald" | "rose";
}) {
  const palette = {
    brand: "from-brand-50 to-white border-brand/20",
    amber: "from-amber-50 to-white border-amber-200",
    emerald: "from-emerald-50 to-white border-emerald-200",
    rose: "from-rose-50 to-white border-rose-200",
  }[tone];
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${palette} p-5 shadow-card transition hover:-translate-y-1 hover:shadow-cardHover`}
    >
      <div className="text-3xl">{icon}</div>
      <p className="mt-3 text-sm font-bold text-ink">{title}</p>
      <p className="mt-1 text-[11px] leading-snug text-ink/55 line-clamp-2">
        {hint}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM

function ProblemSection() {
  const pains = [
    "Bingung **mau bikin desain produk** seperti apa yang menarik",
    "**Mahal bayar designer** Rp 500rb–2jt per konten promosi",
    "Coba desain sendiri di Canva, hasilnya masih **terlihat amatir**",
    "Skill **Photoshop / Illustrator** masih basic banget",
    "Mau visual yang **terlihat premium & profesional** kayak brand besar",
    "Sudah coba AI image, tapi hasilnya **nggak sesuai bayangan**",
  ];

  return (
    <section className="bg-muted/40 py-12 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Masalah yang kamu rasakan
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Pengen Desain Produk Keren, Tapi Selalu Mentok?
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {pains.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-card"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-500">
                <X size={14} />
              </span>
              <p
                className="text-sm leading-relaxed text-ink/75 md:text-base"
                dangerouslySetInnerHTML={{
                  __html: p.replace(
                    /\*\*(.+?)\*\*/g,
                    '<strong class="text-ink">$1</strong>'
                  ),
                }}
              />
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-base italic text-ink/65">
          Kalau kamu bingung mau desain produk seperti apa, PlanetPrompt bisa
          jadi{" "}
          <span className="font-bold not-italic text-brand">
            tim kreatif mini
          </span>{" "}
          yang siap bantu kapan saja — tanpa biaya designer mahal.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLUTION

function SolutionSection() {
  const items = [
    "Caption produk",
    "Headline banner",
    "Konsep desain promosi",
    "Story Instagram",
    "Broadcast WhatsApp",
    "Deskripsi marketplace",
    "Ide campaign diskon",
    "Kalender konten jualan",
  ];

  return (
    <section className="py-12 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Solusi
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            PlanetPrompt Bantu Kamu Tahu{" "}
            <span className="text-brand">Harus Bikin Konten Seperti Apa</span>
          </h2>
          <p className="mt-4 text-lg text-ink/65">
            PlanetPrompt bukan hanya kumpulan prompt. Ini toolkit ide promosi
            yang bantu kamu bikin:
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-muted bg-white px-4 py-3 shadow-sm"
            >
              <CheckCircle2
                size={16}
                className="shrink-0 text-emerald-500"
              />
              <span className="text-sm font-medium text-ink">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 md:p-6">
          <p className="text-sm leading-relaxed text-ink/75">
            <span className="font-bold text-amber-700">📌 Catatan penting:</span>{" "}
            PlanetPrompt <strong>bukan aplikasi desain</strong> seperti Canva.
            PlanetPrompt bantu kamu bikin <strong>arahan desain, copywriting,
            konsep visual, dan teks promosi</strong> yang siap dipakai di
            berbagai AI tools atau aplikasi desain.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS — 4 STEPS

function HowItWorksSection() {
  const steps = [
    {
      n: "1",
      title: "Pilih kebutuhan konten",
      desc: "Caption produk, banner promo, deskripsi marketplace, broadcast WhatsApp — pilih yang kamu butuhkan.",
      icon: <FileText size={20} />,
    },
    {
      n: "2",
      title: "Ganti bagian yang perlu diisi",
      desc: "Masukkan nama produk, harga, target pembeli, promo, tone brand, dan platform.",
      icon: <Copy size={20} />,
    },
    {
      n: "3",
      title: "Copy ke AI favoritmu",
      desc: "Pakai di ChatGPT, Gemini, Claude, Canva AI, atau AI image generator.",
      icon: <Wand2 size={20} />,
    },
    {
      n: "4",
      title: "Pakai hasilnya untuk promosi",
      desc: "Dapatkan ide konten, teks promosi, struktur banner, atau arahan visual yang siap dipakai.",
      icon: <Sparkles size={20} />,
    },
  ];

  return (
    <section id="cara-pakai" className="bg-muted/40 py-12 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Cara pakai
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Sesederhana Isi Template
          </h2>
          <p className="mt-3 text-ink/65">
            Empat langkah. Tidak perlu belajar prompt engineering dari nol.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-muted bg-white p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
                  {s.icon}
                </span>
                <span className="text-5xl font-extrabold text-brand-100">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USE CASE UMKM

function UseCaseSection() {
  const categories = [
    {
      icon: <Utensils size={20} />,
      tone: "rose",
      title: "Makanan & Minuman",
      examples: "Donat, kopi susu, keripik, frozen food, catering",
      img: "/lp/planetprompt/use-case/makanan-minuman.webp",
    },
    {
      icon: <Shirt size={20} />,
      tone: "brand",
      title: "Fashion & Apparel",
      examples: "Kaos basic, thrift, hijab, sepatu, tas lokal",
      img: "/lp/planetprompt/use-case/fashion-apparel.webp",
    },
    {
      icon: <Palette size={20} />,
      tone: "emerald",
      title: "Beauty & Skincare",
      examples: "Skincare lokal, parfum, salon, nail art",
      img: "/lp/planetprompt/use-case/beauty-skincare.webp",
    },
    {
      icon: <Scissors size={20} />,
      tone: "amber",
      title: "Jasa Lokal",
      examples: "Laundry, barbershop, fotografi, percetakan, bengkel",
      img: "/lp/planetprompt/use-case/jasa-lokal.webp",
    },
    {
      icon: <Layers size={20} />,
      tone: "sky",
      title: "Produk Digital",
      examples: "Template, kelas online, jasa desain, e-book",
      img: "/lp/planetprompt/use-case/produk-digital.webp",
    },
    {
      icon: <Tag size={20} />,
      tone: "violet",
      title: "Marketplace Seller",
      examples: "Shopee, Tokopedia, TikTok Shop, Instagram",
      img: "/lp/planetprompt/use-case/marketplace.webp",
    },
    {
      icon: <GraduationCap size={20} />,
      tone: "indigo",
      title: "Edukasi & Kelas",
      examples: "Kelas online, bimbel, kursus, webinar, e-course",
      img: "/lp/planetprompt/use-case/education.webp",
    },
    {
      icon: <Gamepad2 size={20} />,
      tone: "fuchsia",
      title: "Esport & Gaming",
      examples: "Tim esport, turnamen, gaming gear, streamer",
      img: "/lp/planetprompt/use-case/esport.webp",
    },
    {
      icon: <PartyPopper size={20} />,
      tone: "teal",
      title: "Festive & Musiman",
      examples: "Lebaran, Natal, tahun baru, promo musiman, giveaway",
      img: "/lp/planetprompt/use-case/festive.webp",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0d0818] py-16 lg:py-28">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[110px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            Untuk Siapa
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Cocok untuk Banyak{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Jenis Usaha
            </span>
          </h2>
          <p className="mt-3 text-white/55">
            Apapun produkmu, ada template kontennya.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-violet-500/40 hover:bg-white/[0.07]"
            >
              <Image
                src={c.img}
                alt={c.title}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, 360px"
                className="h-auto w-full"
              />
              <h3 className="px-4 py-3.5 text-center text-base font-bold text-white">
                {c.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOWCASE MARQUEE — 2 baris auto-scroll horizontal L→R, gambar full

function ShowcaseMarqueeSection() {
  // Split 43 gambar jadi 3 baris, arah slide selang-seling
  const third = Math.ceil(showcaseImages.length / 3);
  const row1 = showcaseImages.slice(0, third);
  const row2 = showcaseImages.slice(third, third * 2);
  const row3 = showcaseImages.slice(third * 2);

  return (
    <section className="bg-muted/40 py-10 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Contoh hasil
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Konten Jualan dari{" "}
            <span className="text-brand">Member PlanetPrompt</span>
          </h2>
          <p className="mt-3 text-ink/65">
            Semua di-generate dengan AI — tanpa skill desain, tanpa
            Photoshop.
          </p>
        </div>
      </div>

      <DeferMount minHeight="820px">
        <div className="mt-10 space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ShowcaseRow images={row1} reverse />
          <ShowcaseRow images={row2} reverse={false} />
          <ShowcaseRow images={row3} reverse />
        </div>
      </DeferMount>
    </section>
  );
}

function ShowcaseRow({
  images,
  reverse,
}: {
  images: string[];
  reverse: boolean;
}) {
  // reverse=true → animate-marquee-reverse → konten slide dari kiri ke kanan
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {[...images, ...images].map((src, i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={400}
            height={400}
            sizes="(max-width: 768px) 240px, 288px"
            className="h-60 w-auto shrink-0 rounded-2xl bg-muted/40 object-contain shadow-card md:h-72"
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES — Apa Saja yang Kamu Dapatkan?

function FeaturesSection() {
  const features = [
    "Akses AI generator unlimited",
    "Generate caption produk",
    "Generate headline promosi",
    "Generate konsep banner & poster",
    "Generate story Instagram / Facebook",
    "Generate broadcast WhatsApp",
    "Generate deskripsi marketplace",
    "Generate ide campaign diskon",
    "Generate kalender konten",
    "Generate brand storytelling",
    "Generate copywriting iklan",
    "Generate arahan visual untuk AI image generator",
  ];

  return (
    <section className="bg-muted/40 py-12 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Isi paket
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Apa Saja yang Kamu Dapatkan?
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-500"
              />
              <span className="text-sm font-medium text-ink">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN PROMPT KIT HIGHLIGHT

function DesignPromptKitSection() {
  const outputs = [
    "Headline banner",
    "Subheadline",
    "Komposisi layout",
    "Warna yang disarankan",
    "Gaya visual",
    "Elemen desain",
    "Negative prompt AI image generator",
    "Caption pendukung",
  ];

  return (
    <section className="py-12 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/[0.06] via-fuchsia-50/40 to-white p-8 md:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                ✨ Highlight Fitur Baru
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink md:text-4xl">
                <span className="text-brand">DesignPrompt Kit</span> — Bikin
                Konsep Desain Tanpa Bisa Desain
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Prompt siap pakai untuk bikin konsep desain promosi, banner,
                poster, story, katalog, dan iklan visual — walau kamu bukan
                designer.
              </p>

              <p className="mt-7 text-sm font-bold text-ink">
                Output yang kamu dapatkan:
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {outputs.map((o, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-ink/75"
                  >
                    <Check size={14} className="shrink-0 text-brand" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual mockup */}
            <div className="grid grid-cols-2 gap-3">
              {heroProducts.slice(0, 4).map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={400}
                  height={400}
                  sizes="(max-width: 640px) 45vw, 200px"
                  className="aspect-square w-full rounded-2xl bg-muted/40 object-cover shadow-card"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BEFORE - AFTER

function BeforeAfterSection() {
  const rows = [
    ["Bingung bikin caption", "AI generator caption tinggal pakai"],
    [
      "Desain promo terlihat biasa",
      "Dapat arahan konsep desain yang lebih menarik",
    ],
    ["Tidak tahu cara pakai AI", "Prompt sudah disusun, tinggal isi"],
    ["Konten terasa itu-itu saja", "Punya banyak variasi ide konten"],
    [
      "Harus bayar designer untuk hal kecil",
      "Bisa bikin konsep awal sendiri",
    ],
    ["Butuh waktu lama bikin promosi", "Proses ide & copy lebih cepat"],
  ];

  return (
    <section className="bg-muted/40 py-12 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Sebelum vs Sesudah
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Dari Bingung Mau Posting Apa, Jadi{" "}
            <span className="text-brand">Punya Materi Siap Pakai</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Before */}
          <div className="rounded-2xl border border-rose-200 bg-white p-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600">
              <X size={12} /> Sebelum PlanetPrompt
            </p>
            <ul className="mt-5 space-y-3">
              {rows.map(([before], i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-ink/55"
                >
                  <X
                    size={16}
                    className="mt-0.5 shrink-0 text-rose-400"
                  />
                  <span className="line-through decoration-rose-300">
                    {before}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="relative rounded-2xl border-2 border-brand bg-gradient-to-br from-brand-50 to-fuchsia-50/60 p-6 shadow-2xl shadow-brand/20">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
              <Sparkles size={12} /> Setelah PlanetPrompt
            </p>
            <ul className="mt-5 space-y-3">
              {rows.map(([, after], i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm font-medium text-ink"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  {after}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE OUTPUT — 3 contoh

function ExampleOutputSection() {
  const EP = "/lp/planetprompt/engine";

  // 7 engine, tiap engine 3 contoh output. Logo = engine baru (M7, ada badge).
  const engines = [
    {
      code: "M7",
      icon: <Palette size={16} />,
      title: "Logo & Brand Identity",
      desc: "Dari nama brand → board identitas lengkap: filosofi logo, palet warna, tipografi, sampai aturan pakai.",
      badge: true,
      imgs: [`${EP}/logo-1.webp`, `${EP}/logo-2.webp`, `${EP}/logo-3.webp`],
    },
    {
      code: "M1",
      icon: <LayoutGrid size={16} />,
      title: "Design Grafis",
      desc: "Brief produk → foto/banner komersial siap upload. Cocok feed IG, marketplace, hero website.",
      imgs: [`${EP}/design-grafis-1.webp`, `${EP}/design-grafis-2.webp`, `${EP}/design-grafis-3.webp`],
    },
    {
      code: "M2",
      icon: <Youtube size={16} />,
      title: "YouTube Thumbnail",
      desc: "Thumbnail clickable — komposisi, ekspresi, dan teks overlay diatur otomatis.",
      imgs: [`${EP}/youtube-thumbnail-1.webp`, `${EP}/youtube-thumbnail-2.webp`, `${EP}/youtube-thumbnail-3.webp`],
    },
    {
      code: "M3",
      icon: <Scan size={16} />,
      title: "Anatomi",
      desc: "Breakdown angle, proporsi & detail biar hasil AI presisi dan konsisten.",
      imgs: [`${EP}/anatomi-1.webp`, `${EP}/anatomi-2.webp`, `${EP}/anatomi-3.webp`],
    },
    {
      code: "M4",
      icon: <BookOpen size={16} />,
      title: "Comic",
      desc: "Storytelling gaya komik — panel, dialog, ekspresi untuk promosi yang engaging.",
      imgs: [`${EP}/comic-1.webp`, `${EP}/comic-2.webp`, `${EP}/comic-3.webp`],
    },
    {
      code: "M5",
      icon: <BarChart3 size={16} />,
      title: "Infografis",
      desc: "Keunggulan & data produk jadi infografis rapi yang gampang dipahami calon pembeli.",
      imgs: [`${EP}/infografis-1.webp`, `${EP}/infografis-2.webp`, `${EP}/infografis-3.webp`],
    },
    {
      code: "M6",
      icon: <Sparkles size={16} />,
      title: "Creative Prompt",
      desc: "Konsep visual premium & out-of-the-box — splash, dramatic lighting, ide bebas.",
      imgs: [`${EP}/creative-prompt-1.webp`, `${EP}/creative-prompt-2.webp`, `${EP}/creative-prompt-3.webp`],
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0d0818] py-16 lg:py-28">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[110px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200">
            <Sparkles size={13} /> Fitur Baru · 7 Engine
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            7 Engine Kreatif untuk Setiap{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Kebutuhan Visual
            </span>
          </h2>
          <p className="mt-3 text-white/55">
            Bukan satu generator dipakai untuk semua. Tiap mode punya logic
            sendiri biar output AI-nya konsisten sesuai format akhirnya.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {engines.map((e) => (
            <div key={e.code}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">
                    Engine · {e.code}
                  </span>
                  {e.badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      <Sparkles size={9} /> Fitur Baru
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-lg font-bold text-white md:text-xl">
                  {e.title}
                </h3>
                <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-white/55">
                  {e.desc}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-3 items-start gap-3">
                {e.imgs.slice(0, 3).map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${e.title} ${i + 1}`}
                    width={0}
                    height={0}
                    loading="lazy"
                    sizes="(max-width: 768px) 31vw, 320px"
                    className="h-auto w-full rounded-xl border border-white/10 bg-black/20"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW ENGINES — 2 engine baru (Image Carousel + Review Product), section
// terpisah dengan bg gelap yang sama persis dengan ExampleOutputSection.

function NewEnginesSection() {
  const EP = "/lp/planetprompt/engine";

  const engines = [
    {
      code: "M8",
      icon: <ImageIcon size={16} />,
      title: "Image Carousel",
      desc: "Konten carousel multi-slide buat edukasi & soft-selling — tinggal swipe, cocok feed Instagram & TikTok.",
      imgs: [`${EP}/image-carousel-1.webp`, `${EP}/image-carousel-2.webp`, `${EP}/image-carousel-3.webp`],
    },
    {
      code: "M9",
      icon: <Star size={16} />,
      title: "Review Product",
      desc: "Poster review produk ala kreator — lengkap rating, testimoni & CTA biar calon pembeli makin percaya.",
      imgs: [`${EP}/review-product-1.webp`, `${EP}/review-product-2.webp`, `${EP}/review-product-3.webp`],
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0d0818] pb-16 lg:pb-28">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-[520px] rounded-full bg-fuchsia-600/15 blur-[110px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
            <Sparkles size={13} /> Baru Rilis · 2 Engine Tambahan
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Engine Baru:{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Carousel & Review Produk
            </span>
          </h2>
          <p className="mt-3 text-white/55">
            Update terbaru PlanetPrompt — makin banyak format konten jualan yang
            bisa kamu bikin.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {engines.map((e) => (
            <div key={e.code}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">
                    Engine · {e.code}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    <Sparkles size={9} /> Fitur Baru
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-bold text-white md:text-xl">
                  {e.title}
                </h3>
                <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-white/55">
                  {e.desc}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-3 items-start gap-3">
                {e.imgs.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${e.title} ${i + 1}`}
                    width={0}
                    height={0}
                    loading="lazy"
                    sizes="(max-width: 768px) 31vw, 320px"
                    className="h-auto w-full rounded-xl border border-white/10 bg-black/20"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING — Paket UMKM Starter

function PricingSection() {
  const tiers: Array<{
    name: string;
    tagline: string;
    icon: React.ReactNode;
    priceNormal: string;
    pricePromo: string;
    priceValue: number;
    cta: string;
    paymentUrl: string;
    whatsappText: string;
    features: string[];
    highlighted: boolean;
    tone: "brand" | "amber" | "red";
    coupon?: { code: string; save: string; limit: string };
  }> = [
    {
      name: "Paket UMKM Starter",
      tagline: "Untuk pemula yang mau coba dulu",
      icon: <Store size={14} />,
      priceNormal: "Rp 199.000",
      pricePromo: "Rp 99.000",
      priceValue: 99000,
      cta: "Ambil Paket Starter",
      paymentUrl: "https://planetsoft.myr.id/pl/paket-standar-planetprompt",
      coupon: {
        code: "UMKM35",
        save: "Rp 35.000",
        limit: "50 pembeli pertama",
      },
      whatsappText:
        "Halo,%20saya%20mau%20tanya%20Paket%20UMKM%20Starter%20PlanetPrompt",
      features: [
        "**AKUN LOGIN KHUSUS APLIKASI PLANETPROMPT**",
        "Akses AI generator unlimited",
        "Generate caption & copywriting",
        "Generate konsep banner & poster",
        "Generate story Instagram",
        "Generate WhatsApp marketing",
        "Generate konten marketplace seller",
        "DesignPrompt Kit (arahan visual AI)",
        "Cocok untuk pemula",
      ],
      highlighted: false,
      tone: "brand",
    },
    {
      name: "Paket VIP Member",
      tagline: "Mentoring langsung + tool extra",
      icon: <Crown size={14} />,
      priceNormal: "Rp 299.000",
      pricePromo: "Rp 149.000",
      priceValue: 149000,
      cta: "Ambil Paket VIP",
      paymentUrl: "https://planetsoft.myr.id/pl/paket-vip-planetprompt",
      coupon: {
        code: "UMKM35",
        save: "Rp 35.000",
        limit: "50 pembeli pertama",
      },
      whatsappText:
        "Halo,%20saya%20mau%20tanya%20Paket%20VIP%20Member%20PlanetPrompt",
      features: [
        "**AKUN VIP KHUSUS APLIKASI PLANETPROMPT**",
        "**VIP Tool — Autofill Prompt (lebih cepat)**",
        "**Grup VIP private dengan mentoring langsung**",
        "**Sesi konsultasi 1-on-1 dengan founder**",
        "Semua benefit Paket Starter",
        "AI generator advanced + prompt eksklusif",
        "Update fitur generator mingguan",
        "Prioritas support",
      ],
      highlighted: true,
      tone: "amber",
    },
    {
      name: "Paket Aplikasi — Jual Ulang + Rebrand",
      tagline: "Dapat aplikasi PlanetPrompt, ganti logo jadi brand kamu — tim kami yang pasangkan",
      icon: <Crown size={14} />,
      priceNormal: "Rp 1.799.000",
      pricePromo: "Rp 799.000",
      priceValue: 799000,
      cta: "Ambil Paket Aplikasi",
      paymentUrl: "https://planetsoft.myr.id/pl/paket-aplikasi-full-stack",
      coupon: {
        code: "UMKM99",
        save: "Rp 200.000",
        limit: "10 pembeli pertama",
      },
      whatsappText:
        "Halo,%20saya%20mau%20tanya%20Paket%20Aplikasi%20Resell%20PlanetPrompt",
      features: [
        "**DAPAT APLIKASI PLANETPROMPT LENGKAP** — siap pakai",
        "**GANTI LOGO & NAMA BRAND** — jadi brand kamu sendiri",
        "**TIM KAMI YANG PASANGKAN** — aplikasi, website, database, hosting",
        "**HAK JUAL 100%** — semua keuntungan masuk ke kamu",
        "Landing page premium siap launching dengan brand kamu",
        "Setup payment gateway (Tripay / Mayar / Scalev)",
        "Marketing kit lengkap (banner, caption, script ads)",
        "Konsultasi 1-on-1 dengan founder",
        "Akses semua benefit VIP Member",
      ],
      highlighted: false,
      tone: "red",
    },
  ];

  return (
    <section
      id="pricing"
      className="bg-gradient-to-b from-muted/40 to-white py-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Pilih Paket yang Cocok untuk{" "}
            <span className="text-brand">Tujuan Kamu</span>
          </h2>
          <p className="mt-3 text-ink/65">
            Mulai dari starter pemula, naik ke VIP dengan mentoring, atau Resell
            untuk income tambahan.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Fragment key={i}>
              <PricingCard {...t} />
              {/* Teaser antara VIP (index 1) dan Paket Aplikasi (index 2) —
                  hanya tampil di mobile (di desktop card sebelahan).
                  Text-only (tanpa card shape) supaya lebih besar & terbaca. */}
              {i === 1 && (
                <div className="flex flex-col items-center gap-3 px-2 py-6 text-center md:hidden">
                  <p className="text-sm font-bold uppercase tracking-wider text-rose-600">
                    🔥 Mau Naik Level Lagi?
                  </p>
                  <p className="text-xl font-extrabold leading-tight text-ink">
                    Pengen punya{" "}
                    <span className="text-brand">aplikasi sendiri</span>
                    <br />
                    keuntungannya{" "}
                    <span className="text-brand">100% buat kamu</span>
                    <br />
                    <span className="italic text-ink/85">
                      + kami{" "}
                      <span className="not-italic text-brand">
                        ajarin sampai jualan
                      </span>
                      ?
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-ink/55">
                    Cek paket di bawah ↓
                  </p>
                  <ChevronDown
                    size={28}
                    className="animate-bounce text-rose-500"
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink/55">
          Sekali bayar · Akses selamanya · Tanpa langganan ·{" "}
          <span className="font-semibold text-emerald-600">
            Garansi 7 hari
          </span>
        </p>
      </div>
    </section>
  );
}

function CopyCode({ code, isRed }: { code: string; isRed: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label="Salin kode kupon"
      title="Salin kode"
      className={`ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded align-middle transition ${
        isRed
          ? "text-white/80 hover:bg-white/15 hover:text-white"
          : "text-brand hover:bg-brand-50"
      }`}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function PricingCard({
  name,
  tagline,
  icon,
  priceNormal,
  pricePromo,
  priceValue,
  cta,
  paymentUrl,
  whatsappText,
  features,
  highlighted,
  tone,
  coupon,
}: {
  name: string;
  tagline: string;
  icon: React.ReactNode;
  priceNormal: string;
  pricePromo: string;
  priceValue: number;
  cta: string;
  paymentUrl: string;
  whatsappText: string;
  features: string[];
  highlighted: boolean;
  tone: "brand" | "amber" | "red";
  coupon?: { code: string; save: string; limit: string };
}) {
  const palette = {
    brand: {
      badge: "bg-brand-50 text-brand",
      cta: "bg-brand text-white shadow-brand/40 hover:shadow-brand/60",
      border: highlighted ? "border-brand" : "border-muted",
      bg: "bg-white",
    },
    amber: {
      badge: "bg-amber-100 text-amber-700",
      cta: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/40 hover:shadow-amber-500/60",
      border: highlighted ? "border-amber-500" : "border-muted",
      bg: "bg-white",
    },
    red: {
      badge: "bg-white/20 text-white backdrop-blur",
      cta: "bg-white text-rose-700 shadow-2xl shadow-black/40 hover:shadow-black/60",
      border: "border-rose-300",
      bg: "bg-gradient-to-br from-rose-600 via-red-700 to-rose-900 text-white",
    },
  }[tone];

  const isRed = tone === "red";
  return (
    <div
      className={`relative rounded-3xl border-2 p-7 transition ${palette.bg} ${
        highlighted
          ? `${palette.border} scale-105 shadow-2xl`
          : `${palette.border} ${isRed ? "shadow-2xl shadow-rose-900/30" : "shadow-card"}`
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
          ⭐ Paling Populer
        </span>
      )}

      {isRed && (
        <span className="absolute -top-3 right-6 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-900 shadow-lg">
          <Crown size={11} /> Premium
        </span>
      )}

      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${palette.badge}`}
      >
        {icon} {name}
      </span>

      <p
        className={`mt-3 text-sm ${
          isRed ? "text-rose-100" : "text-ink/60"
        }`}
      >
        {tagline}
      </p>

      <div className="mt-6">
        <p
          className={`text-sm line-through ${
            isRed ? "text-rose-200/70" : "text-ink/45"
          }`}
        >
          {priceNormal}
        </p>
        <p
          className={`text-4xl font-extrabold md:text-5xl ${
            isRed ? "text-white" : "text-ink"
          }`}
        >
          {pricePromo}
        </p>
        <p
          className={`mt-1 text-xs ${
            isRed ? "text-rose-200/80" : "text-ink/55"
          }`}
        >
          Sekali bayar, akses lifetime
        </p>
      </div>

      {coupon && (
        <div
          className={`mt-4 rounded-xl border border-dashed px-3 py-3 text-xs ${
            isRed
              ? "border-white/40 bg-white/10 text-rose-50"
              : "border-brand/40 bg-brand-50 text-ink"
          }`}
        >
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider opacity-80">
            🎟️ Pakai kode kupon
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-lg border-2 border-dashed px-3 py-1.5 font-mono text-lg font-black leading-none tracking-[0.18em] ${
                isRed
                  ? "border-white/60 bg-white/15 text-white"
                  : "border-brand/50 bg-white text-brand"
              }`}
            >
              {coupon.code}
            </span>
            <CopyCode code={coupon.code} isRed={isRed} />
            <span className="text-sm font-bold">hemat {coupon.save}</span>
          </div>
          <span
            className={`mt-2 block ${
              isRed ? "text-rose-100/80" : "text-ink/55"
            }`}
          >
            🔥 Khusus {coupon.limit}
          </span>
        </div>
      )}

      <ul className="mt-7 space-y-2.5">
        {features.map((f, i) => (
          <li
            key={i}
            className={`flex items-start gap-2 text-sm ${
              isRed ? "text-white" : "text-ink"
            }`}
          >
            <CheckCircle2
              size={16}
              className={`mt-0.5 shrink-0 ${
                isRed ? "text-amber-300" : "text-emerald-500"
              }`}
            />
            <span
              dangerouslySetInnerHTML={{
                __html: f.replace(
                  /\*\*(.+?)\*\*/g,
                  isRed
                    ? '<strong class="font-bold text-amber-200">$1</strong>'
                    : '<strong class="font-bold text-ink">$1</strong>'
                ),
              }}
            />
          </li>
        ))}
      </ul>

      <a
        href={paymentUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackLead({ contentName: name, value: priceValue })}
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-xl transition hover:scale-[1.02] ${palette.cta}`}
      >
        <ShoppingBag size={16} /> {cta}
      </a>

      <a
        href={`https://wa.me/${WA_NUMBER}?text=${whatsappText}`}
        target="_blank"
        rel="noreferrer"
        className={`mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-semibold underline-offset-4 transition hover:underline ${
          isRed ? "text-rose-100" : "text-ink/55 hover:text-brand"
        }`}
      >
        💬 Tanya admin dulu via WhatsApp
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ

function FaqSection() {
  const faq = [
    {
      q: "Apakah saya harus bisa desain?",
      a: "Tidak. PlanetPrompt dibuat khusus untuk pemula dan pemilik UMKM yang tidak bisa desain. Kamu akan dapat arahan teks, konsep visual, struktur promosi, dan ide konten yang bisa langsung digunakan.",
    },
    {
      q: "Apakah PlanetPrompt bisa langsung bikin gambar desain?",
      a: "PlanetPrompt <strong>bukan aplikasi desain</strong> seperti Canva. PlanetPrompt adalah <strong>AI generator</strong> untuk bantu kamu bikin konsep desain, teks promosi, caption, deskripsi produk, dan arahan visual. Hasilnya bisa kamu pakai di ChatGPT, Gemini, Claude, Canva AI, atau AI image generator.",
    },
    {
      q: "Apakah cocok untuk bisnis kecil?",
      a: "Ya, sangat cocok. Makanan, minuman, fashion, skincare, jasa lokal, toko online, marketplace seller — semua tipe UMKM bisa pakai. AI generator-nya fleksibel untuk berbagai produk.",
    },
    {
      q: "Apakah saya harus paham prompt engineering?",
      a: "Tidak. AI generator-nya sudah disiapkan agar mudah dipakai. Kamu cukup isi nama produk, harga, promo, target pembeli, dan platform — sisanya AI yang generate.",
    },
    {
      q: "Bisa dipakai berkali-kali?",
      a: "Ya. Prompt bisa digunakan berulang kali untuk berbagai produk, campaign, dan kebutuhan konten. Sekali beli, pakai selamanya.",
    },
    {
      q: "AI apa saja yang bisa digunakan?",
      a: "Prompt bisa dipakai di <strong>ChatGPT, Gemini, Claude</strong>, dan beberapa AI tools lain. Untuk kebutuhan visual, prompt juga bisa disesuaikan ke AI image generator seperti Midjourney atau DALL-E.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-12 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Pertanyaan yang Sering Ditanyakan
          </h2>
        </div>

        <div className="mt-12 space-y-2">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-muted bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-muted/30"
                >
                  <span className="text-sm font-semibold text-ink md:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-brand transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p
                    className="border-t border-muted p-5 pt-4 text-sm leading-relaxed text-ink/70"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA

function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-600 to-orange-700 py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-extrabold leading-tight md:text-5xl">
          Siap Bikin Konten Jualan yang Lebih{" "}
          <span className="text-fuchsia-300">Rapi dan Menarik?</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base text-white/85 md:text-lg">
          Mulai dari caption, banner, deskripsi marketplace, sampai promosi WhatsApp —
          semua bisa kamu generate lebih cepat dengan AI generator
          dari PlanetPrompt.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand shadow-2xl transition hover:scale-105"
          >
            <ShoppingBag size={20} /> Ambil PlanetPrompt Sekarang
          </a>
        </div>

        <p className="mt-5 text-xs text-white/75">
          Cocok untuk pemula · Bisa dipakai berkali-kali · Tidak perlu bisa
          desain
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMUNITY

function CommunityCta() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand-50 to-white p-8 md:p-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand">
                <Users size={12} /> 5.000+ member bergabung
              </p>
              <h3 className="mt-3 text-2xl font-bold text-ink md:text-3xl">
                Gabung Komunitas PlanetPrompt
              </h3>
              <p className="mt-2 max-w-lg text-sm text-ink/65">
                Tips konten harian, share trick AI untuk jualan, dan penawaran
                khusus member. Gratis join.
              </p>
            </div>
            <a
              href={COMMUNITY_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              <MessageCircle size={16} /> Gabung Komunitas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER

function Footer() {
  return (
    <footer className="border-t border-muted py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-xs text-ink/50 md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2">
          <Image
            src="/brand/planetsoft-icon.png"
            alt="PlanetSoft"
            width={48}
            height={48}
            className="h-6 w-6 shrink-0 object-contain"
          />
          <span>
            © {new Date().getFullYear()} PlanetSoft. Toolkit konten untuk UMKM
            Indonesia.
          </span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-brand">
            Privacy
          </a>
          <a href="#" className="hover:text-brand">
            Terms
          </a>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STICKY MOBILE CTA

function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-muted bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <a
        href="#pricing"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30"
      >
        <ShoppingBag size={18} /> AMBIL PROMO PLANETPROMPT 64.000!
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO MODAL (kept for future use)

function VideoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl bg-black"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
        >
          <X size={18} />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${VIDEO_DEMO_ID}?autoplay=1`}
          title="Demo PlanetPrompt"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFER MOUNT — render children hanya saat container mendekati viewport.
// Dipakai untuk section berat (marquee 30 images) supaya nggak download
// & nggak animate sebelum user scroll ke section itu. Reduces initial JS
// work + saves bandwidth di mobile.

function DeferMount({
  children,
  minHeight = "240px",
  rootMargin = "300px",
}: {
  children: React.ReactNode;
  minHeight?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || mounted) return;
    // Fallback: kalau IntersectionObserver nggak ada, langsung mount
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: mounted ? undefined : minHeight }}>
      {mounted ? children : null}
    </div>
  );
}
