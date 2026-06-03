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
      // Login member dipusatkan ke /app (member app, 1 database PocketBase).
      // /login lama di app ini diarahkan ke sana. 307 (temporary) biar tidak
      // di-cache permanen browser — gampang di-revert kalau perlu.
      { source: "/login", destination: "/app", permanent: false },
    ];
  },
};

module.exports = nextConfig;
