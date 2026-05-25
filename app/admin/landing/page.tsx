"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { useAuth } from "@/lib/auth";
import { getPB } from "@/lib/pocketbase";

type LandingLink = {
  id: string;
  name: string;
  url: string;
  description?: string;
  tags?: string[];
  is_active?: boolean;
};

type FormState = {
  name: string;
  url: string;
  description: string;
  tags: string; // comma-separated
  is_active: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  url: "",
  description: "",
  tags: "",
  is_active: true,
};

/**
 * Fallback hard-coded list — dipakai kalau PB belum punya collection
 * 'landing_links' (yaitu sebelum `npm run pb:setup-landing-links`
 * dijalankan). Begitu collection ada, list dari DB jadi sumber kebenaran.
 */
const FALLBACK: LandingLink[] = [
  {
    id: "_fallback_planetprompt",
    name: "PlanetPrompt — Toolkit Konten UMKM",
    url: "/planetprompt",
    description:
      "LP utama PlanetPrompt: hero, showcase, pricing 3-tier (Starter / VIP / Resell), testimonial, FAQ.",
    tags: ["UMKM", "Toolkit", "Pricing 3-tier"],
    is_active: true,
  },
];

export default function AdminLandingListPage() {
  const { isSuperAdmin } = useAuth();
  const [links, setLinks] = useState<LandingLink[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LandingLink | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadLinks = async () => {
    setLoading(true);
    try {
      const pb = getPB();
      const list = await pb
        .collection("landing_links")
        .getFullList<LandingLink>({ sort: "name", requestKey: null });
      setLinks(list);
      setUsingFallback(false);
    } catch {
      // Collection belum dibuat — pakai fallback
      setLinks(FALLBACK);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSuperAdmin) return;
    loadLinks();
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Landing Page" },
        ]}
        title="Landing Page"
      >
        <AccessDenied reason="Hanya Super Admin yang dapat melihat direktori landing page." />
      </AdminShell>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const openEdit = (lp: LandingLink) => {
    setEditing(lp);
    setForm({
      name: lp.name,
      url: lp.url,
      description: lp.description ?? "",
      tags: (lp.tags ?? []).join(", "),
      is_active: lp.is_active ?? true,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const pb = getPB();
      const payload = {
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_active: form.is_active,
      };
      if (editing && !editing.id.startsWith("_fallback")) {
        await pb.collection("landing_links").update(editing.id, payload);
      } else {
        await pb.collection("landing_links").create(payload);
      }
      setShowForm(false);
      await loadLinks();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal menyimpan. Pastikan collection 'landing_links' sudah dibuat (run: npm run pb:setup-landing-links)"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lp: LandingLink) => {
    if (lp.id.startsWith("_fallback")) return;
    if (!window.confirm(`Hapus landing page "${lp.name}"?`)) return;
    try {
      await getPB().collection("landing_links").delete(lp.id);
      await loadLinks();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal menghapus");
    }
  };

  const activeCount = links.filter((l) => l.is_active !== false).length;

  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Landing Page" },
      ]}
      title="Landing Page"
      description="Direktori link landing page yang dimiliki. Hanya admin yang melihat list ini — member lihat produk di dashboard mereka."
      actions={
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary"
        >
          <Plus size={16} /> Tambah Landing Page
        </button>
      }
    >
      {usingFallback && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <strong>Mode fallback</strong> — collection{" "}
          <code className="rounded bg-white px-1 py-0.5">landing_links</code>{" "}
          belum dibuat di PocketBase. Tampil data hard-coded. Untuk aktifkan
          editing, jalankan:{" "}
          <code className="rounded bg-white px-1 py-0.5">
            npm run pb:setup-landing-links
          </code>
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Tile
          icon={<Globe size={18} />}
          tone="brand"
          label="Total Landing"
          value={links.length}
          hint="link terdaftar"
        />
        <Tile
          icon={<CheckCircle2 size={18} />}
          tone="emerald"
          label="Aktif"
          value={activeCount}
          hint="tampil & diakses"
        />
        <Tile
          icon={<Sparkles size={18} />}
          tone="amber"
          label="Non-aktif"
          value={links.length - activeCount}
          hint="disembunyikan"
        />
      </section>

      {loading ? (
        <p className="text-sm text-ink/55">Memuat...</p>
      ) : links.length === 0 ? (
        <div className="card-base p-10 text-center">
          <p className="text-sm text-ink/60">
            Belum ada landing page. Klik <strong>Tambah Landing Page</strong>{" "}
            di kanan atas untuk mulai.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {links.map((lp) => (
            <LandingCard
              key={lp.id}
              lp={lp}
              onEdit={() => openEdit(lp)}
              onDelete={() => handleDelete(lp)}
              canEdit={!usingFallback}
            />
          ))}
        </div>
      )}

      {showForm && (
        <FormModal
          editing={editing}
          form={form}
          setForm={setForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      )}
    </AdminShell>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

function LandingCard({
  lp,
  onEdit,
  onDelete,
  canEdit,
}: {
  lp: LandingLink;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
}) {
  const isExternal = /^https?:\/\//i.test(lp.url);
  const isActive = lp.is_active !== false;
  return (
    <div className="card-base flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand">
            <Globe size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink line-clamp-1">
              {lp.name}
            </p>
            <p className="text-[11px] text-ink/55 font-mono line-clamp-1">
              {lp.url}
            </p>
          </div>
        </div>
        {isActive ? (
          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            ● Aktif
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-ink/55">
            ○ Non-aktif
          </span>
        )}
      </div>

      {lp.description && (
        <p className="text-xs text-ink/65 line-clamp-2">{lp.description}</p>
      )}

      {lp.tags && lp.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {lp.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-ink/65"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 pt-1">
        <a
          href={lp.url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand/90"
        >
          Buka LP <ExternalLink size={11} />
        </a>
        <button
          type="button"
          onClick={onEdit}
          disabled={!canEdit}
          className="inline-flex items-center gap-1 rounded-lg border border-muted px-3 py-1.5 text-xs font-semibold text-ink/75 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
          title={canEdit ? "Edit landing" : "Aktifkan dulu via npm run pb:setup-landing-links"}
        >
          <Pencil size={11} /> Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={!canEdit}
          className="ml-auto inline-flex items-center gap-1 rounded-lg border border-muted px-2.5 py-1.5 text-xs text-ink/55 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Hapus"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Form Modal ──────────────────────────────────────────────────────────────

function FormModal({
  editing,
  form,
  setForm,
  onClose,
  onSubmit,
  submitting,
  error,
}: {
  editing: LandingLink | null;
  form: FormState;
  setForm: (f: FormState) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="card-base w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {editing ? "Edit Landing Page" : "Tambah Landing Page"}
            </h2>
            <p className="mt-0.5 text-xs text-ink/55">
              Isi nama & link landing page. Akan tampil di list direktori.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid h-8 w-8 place-items-center rounded-lg text-ink/55 hover:bg-muted"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Nama landing page" required>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Cth: PlanetPrompt — Toolkit Konten UMKM"
              className="input-base"
              required
            />
          </Field>

          <Field
            label="URL / Link"
            required
            hint="Path internal (cth: /planetprompt) atau URL eksternal lengkap (https://...)"
          >
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="/planetprompt atau https://..."
              className="input-base font-mono text-sm"
              required
            />
          </Field>

          <Field label="Deskripsi" hint="Opsional — penjelasan singkat 1-2 kalimat.">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              placeholder="Cth: LP utama PlanetPrompt: hero, pricing 3-tier..."
              className="input-base"
            />
          </Field>

          <Field
            label="Tags"
            hint="Opsional — pisahkan dengan koma. Cth: UMKM, Toolkit, Pricing 3-tier"
          >
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="UMKM, Toolkit, Pricing 3-tier"
              className="input-base"
            />
          </Field>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-muted bg-white p-3">
            <div>
              <p className="text-sm font-semibold text-ink">
                {form.is_active ? "Aktif" : "Non-aktif"}
              </p>
              <p className="text-[11px] text-ink/55">
                {form.is_active
                  ? "Akan tampil di list direktori"
                  : "Disembunyikan tapi data tetap ada"}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, is_active: !form.is_active })
              }
              aria-label="Toggle aktif"
              className={`relative h-6 w-11 rounded-full transition ${
                form.is_active ? "bg-emerald-500" : "bg-ink/20"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  form.is_active ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </label>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting
                ? "Menyimpan..."
                : editing
                ? "Simpan Perubahan"
                : "Tambah"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-ink/50">{hint}</p>}
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
  tone: "brand" | "emerald" | "amber";
}) {
  const palette = {
    brand: "bg-brand-50 text-brand",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  }[tone];
  return (
    <div className="card-base flex items-center gap-4 p-5">
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${palette}`}>
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
          {label}
        </p>
        <p className="text-2xl font-bold text-ink">{value}</p>
        <p className="text-[11px] text-ink/55">{hint}</p>
      </div>
    </div>
  );
}
