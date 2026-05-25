export type ProductStatus = "purchased" | "locked" | "expired";

export type Resource = {
  name: string;
  size: string;
  type: string;
  /** URL unduhan / link eksternal (opsional). */
  url?: string;
  /**
   * File yang baru di-pilih user dari komputer; akan di-upload ke
   * PocketBase Storage saat form produk disimpan. Setelah upload, dataStore
   * akan men-clear field ini dan mengisi `url` dengan URL file di PB.
   */
  _pendingFile?: File;
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  /**
   * URL embed YouTube atau platform lain. Pengguna bisa paste URL biasa
   * (https://www.youtube.com/watch?v=ID) — helper akan mengkonversinya.
   */
  videoUrl: string;
  description: string;
  resources: Resource[];
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Product = {
  id: string;
  title: string;
  tagline: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  duration: string;
  lessonCount: number;
  status: ProductStatus;
  progress: number;
  cover: string;
  /**
   * Path ke gambar produk (PNG / JPG / SVG) berukuran 1000x1000.
   * Default mengarah ke /public/products/{id}.svg — ganti dengan
   * file PNG kamu sendiri di folder yang sama bila tersedia.
   */
  image: string;
  /** URL landing page penjualan publik (untuk tombol "Beli Sekarang"). */
  landingUrl: string;
  price?: string;
  modules: Module[];
  /**
   * File baru yang di-upload admin lewat form. Saat upsertProduct
   * dipanggil, file ini akan di-PUT ke PocketBase Storage via FormData
   * dan disimpan ke field 'image_file'. Setelah upload, field ini
   * di-clear dan `image` di-replace dengan URL real dari PB.
   */
  _pendingImageFile?: File;
};

export const products: Product[] = [
  {
    id: "prompt-engineering-mastery",
    title: "Prompt Engineering Mastery",
    tagline: "Kuasai seni berbicara dengan AI dari dasar hingga mahir.",
    level: "Pemula",
    duration: "6 jam 20 menit",
    lessonCount: 24,
    status: "purchased",
    progress: 42,
    cover: "from-orange-400 to-orange-600",
    image: "/products/prompt-engineering-mastery.svg",
    landingUrl: "https://planet-ai.id/produk/prompt-engineering-mastery",
    price: "Rp 499.000",
    modules: [
      {
        id: "m1",
        title: "Modul 1 — Fondasi Prompt",
        lessons: [
          {
            id: "l1",
            title: "Pengantar Prompt Engineering",
            duration: "08:32",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description:
              "Memahami apa itu prompt, mengapa krusial, dan kerangka berpikir saat menyusun instruksi kepada model AI.",
            resources: [
              { name: "Slide-Modul-1.pdf", size: "2.4 MB", type: "PDF" },
              { name: "Cheatsheet-Prompt.pdf", size: "780 KB", type: "PDF" },
            ],
          },
          {
            id: "l2",
            title: "Anatomi Prompt yang Efektif",
            duration: "12:10",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description:
              "Bedah enam komponen prompt: peran, konteks, tugas, format, batasan, dan contoh.",
            resources: [
              { name: "Template-Prompt.docx", size: "120 KB", type: "DOCX" },
            ],
          },
          {
            id: "l3",
            title: "Studi Kasus: Customer Support",
            duration: "15:48",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description:
              "Penerapan langsung di skenario chatbot customer support, lengkap dengan iterasi prompt.",
            resources: [
              { name: "Dataset-CS.csv", size: "1.1 MB", type: "CSV" },
            ],
          },
        ],
      },
      {
        id: "m2",
        title: "Modul 2 — Teknik Lanjutan",
        lessons: [
          {
            id: "l4",
            title: "Chain-of-Thought Prompting",
            duration: "10:05",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description:
              "Mengarahkan model untuk menampilkan tahapan berpikir agar hasil akhir lebih akurat.",
            resources: [
              { name: "Contoh-CoT.pdf", size: "640 KB", type: "PDF" },
            ],
          },
          {
            id: "l5",
            title: "Few-shot Prompting",
            duration: "11:22",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description:
              "Memberikan contoh berkualitas untuk mengarahkan output secara konsisten.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: "ai-automation-blueprint",
    title: "AI Automation Blueprint",
    tagline: "Otomatiskan operasional bisnismu dengan kombinasi AI + No-Code.",
    level: "Menengah",
    duration: "8 jam 45 menit",
    lessonCount: 32,
    status: "purchased",
    progress: 18,
    cover: "from-amber-400 to-orange-500",
    image: "/products/ai-automation-blueprint.svg",
    landingUrl: "https://planet-ai.id/produk/ai-automation-blueprint",
    price: "Rp 749.000",
    modules: [
      {
        id: "m1",
        title: "Modul 1 — Fondasi Otomasi",
        lessons: [
          {
            id: "l1",
            title: "Pemetaan Workflow Otomasi",
            duration: "09:14",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description:
              "Identifikasi proses repetitif yang siap diotomasi dengan AI.",
            resources: [
              { name: "Workflow-Canvas.pdf", size: "950 KB", type: "PDF" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "build-ai-saas",
    title: "Build Your First AI SaaS",
    tagline: "Bangun produk SaaS bertenaga AI dari nol hingga launching.",
    level: "Lanjutan",
    duration: "12 jam 10 menit",
    lessonCount: 45,
    status: "locked",
    progress: 0,
    cover: "from-orange-300 to-rose-500",
    image: "/products/build-ai-saas.svg",
    landingUrl: "https://planet-ai.id/produk/build-ai-saas",
    price: "Rp 1.499.000",
    modules: [],
  },
  {
    id: "ai-content-creator",
    title: "AI Content Creator Toolkit",
    tagline: "Produksi konten visual & tulisan 10x lebih cepat dengan AI.",
    level: "Pemula",
    duration: "5 jam 30 menit",
    lessonCount: 20,
    status: "locked",
    progress: 0,
    cover: "from-orange-300 to-pink-400",
    image: "/products/ai-content-creator.svg",
    landingUrl: "https://planet-ai.id/produk/ai-content-creator",
    price: "Rp 399.000",
    modules: [],
  },
  {
    id: "data-analyst-with-ai",
    title: "Data Analyst with AI",
    tagline: "Analisis data secepat kilat dengan bantuan asisten AI.",
    level: "Menengah",
    duration: "7 jam 05 menit",
    lessonCount: 28,
    status: "expired",
    progress: 100,
    cover: "from-rose-400 to-orange-500",
    image: "/products/data-analyst-with-ai.svg",
    landingUrl: "https://planet-ai.id/produk/data-analyst-with-ai",
    price: "Rp 599.000",
    modules: [],
  },
  {
    id: "ai-image-generation",
    title: "AI Image Generation Pro",
    tagline: "Hasilkan visual sinematik dengan Midjourney & Stable Diffusion.",
    level: "Lanjutan",
    duration: "9 jam 20 menit",
    lessonCount: 36,
    status: "locked",
    progress: 0,
    cover: "from-orange-400 to-amber-300",
    image: "/products/ai-image-generation.svg",
    landingUrl: "https://planet-ai.id/produk/ai-image-generation",
    price: "Rp 899.000",
    modules: [],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

/**
 * Konversi URL YouTube biasa (watch / youtu.be / shorts) menjadi URL
 * embed yang aman dipakai di iframe. Jika sudah embed atau bukan
 * YouTube, kembalikan apa adanya.
 */
export function toEmbedUrl(raw: string): string {
  if (!raw) return raw;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");

    // youtu.be/<id>
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : raw;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      // Already embed
      if (u.pathname.startsWith("/embed/")) return raw;
      // Shorts
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : raw;
      }
      // Watch
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    return raw;
  } catch {
    return raw;
  }
}

export const currentUser = {
  name: "Adam Hidayat",
  email: "adam@planet-ai.id",
  joinedAt: "Januari 2026",
  role: "Member",
};
