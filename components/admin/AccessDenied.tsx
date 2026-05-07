import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";

export function AccessDenied({
  reason = "Halaman ini hanya dapat diakses oleh Super Admin.",
}: {
  reason?: string;
}) {
  return (
    <div className="card-base mx-auto max-w-xl p-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-500">
        <Lock size={28} />
      </div>
      <h2 className="mt-4 text-xl font-bold text-ink">Akses Ditolak</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">{reason}</p>
      <p className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
        <ShieldCheck size={12} /> Hubungi Super Admin untuk mendapatkan akses.
      </p>
      <Link href="/admin" className="btn-primary mt-6">
        Kembali ke Overview
      </Link>
    </div>
  );
}
