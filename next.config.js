/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Prioritas format modern — Next.js bakal serve AVIF (lebih kecil),
    // fallback ke WebP, lalu original. Cache 24 jam supaya CDN/browser
    // nggak refetch tiap visit.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
  },
  async redirects() {
    return [
      // Root domain → LP jualan PlanetPrompt (mayoritas traffic dari ads).
      // Sengaja di config (bukan app/page.tsx) supaya selalu emit header
      // Location bersih & TIDAK kena full-route cache — redirect statis di
      // page sempat ke-cache 1 tahun (s-maxage) + tanpa Location.
      { source: "/", destination: "/planetprompt", permanent: false },
      // CATATAN: redirect /login → /app DIHAPUS (2026-06-11) supaya form login
      // member (app/login/page.tsx) tampil lagi → login → /dashboard. Sebelumnya
      // redirect ini nge-shadow form login → /dashboard jadi nggak bisa diakses.
      // /app = AI Studio terpisah (tetap diakses langsung / dari card produk).
      // AI Tools (Prompt Generator + JSON Builder) disembunyikan dulu — semua
      // /tools/* diarahkan ke /dashboard. Page code tetap ada (reversible).
      { source: "/tools", destination: "/dashboard", permanent: false },
      { source: "/tools/:path*", destination: "/dashboard", permanent: false },
    ];
  },
};

module.exports = nextConfig;
