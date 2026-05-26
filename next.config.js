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
};

module.exports = nextConfig;
