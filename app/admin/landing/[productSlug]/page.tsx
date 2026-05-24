"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Link2,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { useAuth } from "@/lib/auth";
import { getPB } from "@/lib/pocketbase";
import {
  emptyLanding,
  type Benefit,
  type FaqItem,
  type LandingPage,
  type Testimonial,
} from "@/lib/landingTypes";

export default function EditLandingPage() {
  const params = useParams<{ productSlug: string }>();
  const { isSuperAdmin } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [productPbId, setProductPbId] = useState<string | null>(null);
  const [productTitle, setProductTitle] = useState("");
  const [landingId, setLandingId] = useState<string | null>(null);
  const [data, setData] = useState<Omit<LandingPage, "product">>(emptyLanding());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Load product + landing (if exists)
  useEffect(() => {
    if (!isSuperAdmin) return;
    const pb = getPB();
    (async () => {
      try {
        const productMatches = await pb.collection("products").getFullList<{
          id: string;
          title: string;
          tagline: string;
        }>({
          filter: `slug = "${params.productSlug}"`,
          requestKey: null,
        });
        if (productMatches.length === 0) {
          setLoading(false);
          return;
        }
        const product = productMatches[0];
        setProductPbId(product.id);
        setProductTitle(product.title);

        const landings = await pb
          .collection("landing_pages")
          .getFullList<LandingPage & { id: string }>({
            filter: `product = "${product.id}"`,
            requestKey: null,
          });
        if (landings.length > 0) {
          const l = landings[0];
          setLandingId(l.id);
          setData({
            headline: l.headline || "",
            subheadline: l.subheadline || "",
            hero_image_url: l.hero_image_url || "",
            cta_primary_text: l.cta_primary_text || "Beli Sekarang",
            cta_primary_url: l.cta_primary_url || "",
            benefits: l.benefits || [],
            testimonials: l.testimonials || [],
            faq: l.faq || [],
            price_features: l.price_features || [],
            footer_cta_text: l.footer_cta_text || "",
            published: l.published || false,
          });
        } else {
          // Belum ada — prefill headline dari title
          setData((d) => ({
            ...d,
            headline: product.title,
            subheadline: product.tagline || "",
          }));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal load data");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.productSlug, isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Landing Page", href: "/admin/landing" },
          { label: "Edit" },
        ]}
        title="Edit Landing Page"
      >
        <AccessDenied reason="Hanya Super Admin yang dapat mengedit landing page." />
      </AdminShell>
    );
  }

  if (loading) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Landing Page", href: "/admin/landing" },
          { label: "Memuat..." },
        ]}
        title="Memuat landing page..."
      >
        <p className="text-sm text-ink/55">Mengambil data dari server...</p>
      </AdminShell>
    );
  }

  if (!productPbId) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Landing Page", href: "/admin/landing" },
          { label: "Tidak ditemukan" },
        ]}
        title="Produk tidak ditemukan"
      >
        <p className="text-sm text-ink/55">
          Produk dengan slug &quot;{params.productSlug}&quot; tidak ada.
        </p>
      </AdminShell>
    );
  }

  const update = <K extends keyof typeof data>(
    key: K,
    value: (typeof data)[K]
  ) => setData((d) => ({ ...d, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const pb = getPB();
      const payload = { ...data, product: productPbId };
      if (landingId) {
        await pb.collection("landing_pages").update(landingId, payload);
      } else {
        const created = await pb.collection("landing_pages").create(payload);
        setLandingId(created.id);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan landing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!landingId) return;
    if (!window.confirm("Hapus landing page produk ini?")) return;
    await getPB().collection("landing_pages").delete(landingId);
    router.push("/admin/landing");
  };

  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Landing Page", href: "/admin/landing" },
        { label: productTitle },
      ]}
      title={`Landing: ${productTitle}`}
      description="Atur konten halaman penjualan publik untuk produk ini."
      actions={
        <a
          href={`/produk/${params.productSlug}`}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          <Eye size={14} /> Preview <ExternalLink size={12} />
        </a>
      }
    >
      <form onSubmit={submit} className="space-y-6">
        <Link
          href="/admin/landing"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink/60 hover:text-brand"
        >
          <ArrowLeft size={14} /> Kembali ke daftar landing
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Section title="1. Hero" sub="Bagian paling atas — kesan pertama pengunjung.">
              <Field label="Headline (judul besar)">
                <input
                  value={data.headline}
                  onChange={(e) => update("headline", e.target.value)}
                  placeholder="Cth: Kuasai Prompt Engineering dalam 6 Jam"
                  className="input-base"
                  required
                />
              </Field>
              <Field label="Sub-headline (deskripsi)">
                <textarea
                  value={data.subheadline}
                  onChange={(e) => update("subheadline", e.target.value)}
                  rows={3}
                  placeholder="Dari fondasi hingga teknik lanjutan — termasuk template siap pakai untuk ChatGPT, Claude, dan Gemini."
                  className="input-base"
                />
              </Field>
              <Field label="Hero Image URL (opsional)" hint="URL gambar hero, atau biarkan kosong untuk pakai gambar produk default.">
                <div className="relative">
                  <ImageIcon
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                  />
                  <input
                    value={data.hero_image_url ?? ""}
                    onChange={(e) => update("hero_image_url", e.target.value)}
                    placeholder="https://..."
                    className="input-base pl-9"
                  />
                </div>
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="CTA Primary Text">
                  <input
                    value={data.cta_primary_text ?? ""}
                    onChange={(e) =>
                      update("cta_primary_text", e.target.value)
                    }
                    placeholder="Beli Sekarang"
                    className="input-base"
                  />
                </Field>
                <Field label="CTA Primary URL" hint="Link checkout. Kosongkan untuk pakai default WhatsApp.">
                  <div className="relative">
                    <Link2
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                    />
                    <input
                      type="url"
                      value={data.cta_primary_url ?? ""}
                      onChange={(e) =>
                        update("cta_primary_url", e.target.value)
                      }
                      placeholder="https://..."
                      className="input-base pl-9"
                    />
                  </div>
                </Field>
              </div>
            </Section>

            <BenefitsEditor
              benefits={data.benefits}
              onChange={(b) => update("benefits", b)}
            />

            <TestimonialsEditor
              testimonials={data.testimonials}
              onChange={(t) => update("testimonials", t)}
            />

            <PriceFeaturesEditor
              features={data.price_features}
              onChange={(f) => update("price_features", f)}
            />

            <FaqEditor faq={data.faq} onChange={(f) => update("faq", f)} />

            <Section title="6. Footer CTA" sub="Pesan terakhir sebelum tombol beli paling bawah.">
              <Field label="Teks footer CTA">
                <textarea
                  value={data.footer_cta_text ?? ""}
                  onChange={(e) => update("footer_cta_text", e.target.value)}
                  rows={2}
                  placeholder="Bergabung sekarang dan akses semua materi seumur hidup."
                  className="input-base"
                />
              </Field>
            </Section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <section className="card-base p-6">
              <h2 className="text-lg font-bold text-ink">Status</h2>
              <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-muted bg-white p-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {data.published ? "Published" : "Draft"}
                  </p>
                  <p className="text-[11px] text-ink/55">
                    {data.published
                      ? "Landing terlihat di /produk/" + params.productSlug
                      : "Belum publik — hanya admin yang bisa preview"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => update("published", !data.published)}
                  aria-label="Toggle published"
                  className={`relative h-6 w-11 rounded-full transition ${
                    data.published ? "bg-emerald-500" : "bg-ink/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      data.published ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </label>
            </section>

            <section className="card-base space-y-3 p-6">
              <h2 className="text-lg font-bold text-ink">Aksi</h2>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                <Save size={16} />
                {submitting ? "Menyimpan..." : "Simpan Landing"}
              </button>
              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                  {error}
                </p>
              )}
              {success && (
                <p className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-sm text-emerald-700">
                  <CheckCircle2 size={14} /> Tersimpan.
                </p>
              )}
              <a
                href={`/produk/${params.productSlug}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost w-full justify-center"
              >
                <Eye size={14} /> Preview Halaman
              </a>
              <Link
                href="/admin/landing"
                className="btn-ghost w-full justify-center"
              >
                Batal
              </Link>

              {landingId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/40 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <Trash2 size={14} /> Hapus Landing
                </button>
              )}
            </section>

            <section className="card-base p-6">
              <div className="flex items-center gap-2 text-brand">
                <Sparkles size={14} />
                <h2 className="text-sm font-bold text-ink">Tips</h2>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-ink/60">
                <li>✓ Headline pendek, satu kalimat, value-focused</li>
                <li>✓ 3-6 benefits dengan ikon emoji ringan (🚀 ⚡ 🎯 ✨)</li>
                <li>✓ Testimoni asli — jangan pakai stock photo</li>
                <li>✓ FAQ jawab keberatan calon pembeli</li>
              </ul>
            </section>
          </aside>
        </div>
      </form>
    </AdminShell>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-base p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <p className="text-xs text-ink/55">{sub}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-ink/50">{hint}</p>}
    </div>
  );
}

function BenefitsEditor({
  benefits,
  onChange,
}: {
  benefits: Benefit[];
  onChange: (b: Benefit[]) => void;
}) {
  return (
    <Section title="2. Benefits" sub="Mengapa produk ini layak dibeli. 3-6 item paling pas.">
      <div className="space-y-2">
        {benefits.map((b, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-2 rounded-xl border border-muted bg-white p-3 sm:grid-cols-[60px_1fr_1.6fr_36px]"
          >
            <input
              value={b.icon ?? ""}
              onChange={(e) =>
                onChange(
                  benefits.map((x, idx) =>
                    idx === i ? { ...x, icon: e.target.value } : x
                  )
                )
              }
              placeholder="🚀"
              className="rounded-md border border-muted bg-white px-2 py-1.5 text-center text-lg"
            />
            <input
              value={b.title}
              onChange={(e) =>
                onChange(
                  benefits.map((x, idx) =>
                    idx === i ? { ...x, title: e.target.value } : x
                  )
                )
              }
              placeholder="Judul benefit"
              className="rounded-md border border-muted bg-white px-3 py-1.5 text-sm font-semibold focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
            <input
              value={b.description}
              onChange={(e) =>
                onChange(
                  benefits.map((x, idx) =>
                    idx === i ? { ...x, description: e.target.value } : x
                  )
                )
              }
              placeholder="Deskripsi singkat (1 kalimat)"
              className="rounded-md border border-muted bg-white px-3 py-1.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
            <button
              type="button"
              onClick={() => onChange(benefits.filter((_, idx) => idx !== i))}
              className="grid h-9 w-9 place-items-center rounded-md text-ink/50 hover:bg-rose-50 hover:text-rose-500"
              aria-label="Hapus"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange([
              ...benefits,
              { icon: "✨", title: "", description: "" },
            ])
          }
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-muted px-3 py-2 text-xs font-semibold text-ink/65 hover:border-brand hover:text-brand"
        >
          <Plus size={12} /> Tambah Benefit
        </button>
      </div>
    </Section>
  );
}

function TestimonialsEditor({
  testimonials,
  onChange,
}: {
  testimonials: Testimonial[];
  onChange: (t: Testimonial[]) => void;
}) {
  return (
    <Section
      title="3. Testimonial"
      sub="Bukti sosial dari murid/pengguna sebelumnya."
    >
      <div className="space-y-3">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl border border-muted bg-white p-3"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_36px]">
              <input
                value={t.name}
                onChange={(e) =>
                  onChange(
                    testimonials.map((x, idx) =>
                      idx === i ? { ...x, name: e.target.value } : x
                    )
                  )
                }
                placeholder="Nama"
                className="rounded-md border border-muted bg-white px-3 py-1.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30"
              />
              <input
                value={t.role ?? ""}
                onChange={(e) =>
                  onChange(
                    testimonials.map((x, idx) =>
                      idx === i ? { ...x, role: e.target.value } : x
                    )
                  )
                }
                placeholder="Profesi/role"
                className="rounded-md border border-muted bg-white px-3 py-1.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30"
              />
              <button
                type="button"
                onClick={() =>
                  onChange(testimonials.filter((_, idx) => idx !== i))
                }
                className="grid h-9 w-9 place-items-center rounded-md text-ink/50 hover:bg-rose-50 hover:text-rose-500"
                aria-label="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <input
              value={t.photo_url ?? ""}
              onChange={(e) =>
                onChange(
                  testimonials.map((x, idx) =>
                    idx === i ? { ...x, photo_url: e.target.value } : x
                  )
                )
              }
              placeholder="URL foto (opsional)"
              className="w-full rounded-md border border-muted bg-white px-3 py-1.5 text-xs focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
            <textarea
              value={t.quote}
              onChange={(e) =>
                onChange(
                  testimonials.map((x, idx) =>
                    idx === i ? { ...x, quote: e.target.value } : x
                  )
                )
              }
              placeholder="Kutipan testimoni..."
              rows={2}
              className="w-full rounded-md border border-muted bg-white px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange([
              ...testimonials,
              { name: "", role: "", quote: "", photo_url: "" },
            ])
          }
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-muted px-3 py-2 text-xs font-semibold text-ink/65 hover:border-brand hover:text-brand"
        >
          <Plus size={12} /> Tambah Testimoni
        </button>
      </div>
    </Section>
  );
}

function PriceFeaturesEditor({
  features,
  onChange,
}: {
  features: string[];
  onChange: (f: string[]) => void;
}) {
  return (
    <Section
      title="4. Fitur dalam Harga"
      sub="Apa saja yang member dapat. Tampil sebagai checklist di section harga."
    >
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
            <input
              value={f}
              onChange={(e) =>
                onChange(features.map((x, idx) => (idx === i ? e.target.value : x)))
              }
              placeholder="Cth: Akses seumur hidup + update materi"
              className="flex-1 rounded-md border border-muted bg-white px-3 py-1.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
            <button
              type="button"
              onClick={() => onChange(features.filter((_, idx) => idx !== i))}
              className="grid h-9 w-9 place-items-center rounded-md text-ink/50 hover:bg-rose-50 hover:text-rose-500"
              aria-label="Hapus"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...features, ""])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-muted px-3 py-2 text-xs font-semibold text-ink/65 hover:border-brand hover:text-brand"
        >
          <Plus size={12} /> Tambah Fitur
        </button>
      </div>
    </Section>
  );
}

function FaqEditor({
  faq,
  onChange,
}: {
  faq: FaqItem[];
  onChange: (f: FaqItem[]) => void;
}) {
  return (
    <Section title="5. FAQ" sub="Jawab pertanyaan umum yang menghalangi pembelian.">
      <div className="space-y-2">
        {faq.map((q, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl border border-muted bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <input
                value={q.question}
                onChange={(e) =>
                  onChange(
                    faq.map((x, idx) =>
                      idx === i ? { ...x, question: e.target.value } : x
                    )
                  )
                }
                placeholder="Pertanyaan (cth: Apakah materinya untuk pemula?)"
                className="flex-1 rounded-md border border-muted bg-white px-3 py-1.5 text-sm font-semibold focus:border-brand focus:ring-1 focus:ring-brand/30"
              />
              <button
                type="button"
                onClick={() => onChange(faq.filter((_, idx) => idx !== i))}
                className="grid h-9 w-9 place-items-center rounded-md text-ink/50 hover:bg-rose-50 hover:text-rose-500"
                aria-label="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <textarea
              value={q.answer}
              onChange={(e) =>
                onChange(
                  faq.map((x, idx) =>
                    idx === i ? { ...x, answer: e.target.value } : x
                  )
                )
              }
              placeholder="Jawaban..."
              rows={2}
              className="w-full rounded-md border border-muted bg-white px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange([...faq, { question: "", answer: "" }])
          }
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-muted px-3 py-2 text-xs font-semibold text-ink/65 hover:border-brand hover:text-brand"
        >
          <Plus size={12} /> Tambah Pertanyaan
        </button>
      </div>
    </Section>
  );
}
