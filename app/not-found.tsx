import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 px-6">
      <div className="card-base max-w-md p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ink">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-ink/65">
          Konten yang kamu cari tidak tersedia atau kamu belum memiliki akses.
        </p>
        <Link href="/dashboard" className="btn-primary mt-6">
          Kembali ke Dashboard
        </Link>
      </div>
    </main>
  );
}
