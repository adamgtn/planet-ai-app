# Catatan untuk Claude (project-level)

Ringkasan preference & konvensi yang harus selalu Claude ikuti saat kerja di project ini.

## Preview / Testing

- **Default preview viewport untuk landing page = mobile** (375×812 / preset `mobile`).
  - Berlaku untuk path: `/planetprompt`, `/produk/[slug]`, dan landing page lain.
  - Alasan: 80%+ traffic LP dari ads Meta/TikTok = mobile. Verify mobile-first dulu, baru desktop.
  - Cara: `preview_resize` dengan `preset: "mobile"` sebelum screenshot.

- **Default preview untuk admin area / dashboard** boleh desktop (1280×900 atau 1440×900) karena admin biasanya akses dari laptop.

## Branding

- Logo planet di `/public/brand/planetsoft-icon.png` (1000×1000). Selalu pakai `object-contain shrink-0` di `<img>` agar tidak ke-stretch.
- Wordmark: `planet` (ink) + `soft` / `prompt` (brand orange).
- Color brand: `#FF6B00` (Tailwind `bg-brand`, `text-brand`). White background, dark charcoal text. Hindari dark theme untuk product yang menargetkan UMKM.
- **Pengecualian — LP PlanetPrompt**: hero (`components/Hero.tsx`) + section UseCase & 7-Engine sengaja pakai tema **gelap-ungu** (`bg-[#0d0818]` + glow violet/fuchsia, aksen ungu + gold/amber). Navbar adaptif (terang di atas hero, gelap pas scroll). Selebihnya LP tetap terang. Jangan balikin hero ke terang tanpa diminta.

## Workflow Git

- Gunakan `npm run push "msg"` atau `npm run pr "msg"` (script di `scripts/sync.mjs`) — bukan command git manual.
- Setiap perubahan = branch baru dari `main` + PR. CI/CD auto-deploy via GitHub Actions saat merge ke `main`.
- Branch protection di main: cek dulu apakah PR terakhir sudah merged sebelum push commit baru ke branch yang sama (kalau sudah closed, bikin branch baru dari main).

## Konvensi Konten LP UMKM

PRD positioning PlanetPrompt: toolkit untuk **UMKM yang tidak bisa desain**.

**Kata yang dipakai**: konten jualan, promosi produk, UMKM, tidak bisa desain, tinggal isi template, caption, banner, story, script video, WhatsApp marketing, marketplace, pemula, hemat waktu.

**Kata yang dihindari**: prompt engineering, workflow, automation, framework, advanced AI, technical prompt, placeholder.

## File Structure

```
public/
├── brand/                    Logo PlanetSoft
├── products/                 Cover produk Learning Center (course/kelas)
└── lp/
    └── planetprompt/
        ├── hero/             Hero mockup
        ├── showcase/         Output produk UMKM (gambar real, naming: showcase-NN.png)
        ├── use-case/         Sample per kategori UMKM
        └── testimonial/      Foto + WA screenshots
```

## PocketBase

- URL: `https://db.planet-ai.tech`
- Dashboard: `https://db.planet-ai.tech/_/`
- Collections aktif: `users`, `products`, `modules`, `lessons`, `resources`, `permissions`, `landing_pages`
- Script setup/fix di `scripts/pocketbase-*.mjs` — idempotent.
