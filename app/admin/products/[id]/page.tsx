"use client";

import { notFound, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import {
  useDataStore,
  useProduct,
  useProductCurriculum,
} from "@/lib/dataStore";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { loading: storeLoading, products } = useDataStore();
  const product = useProduct(params.id);
  const { modules, loading: loadingCurriculum } = useProductCurriculum(
    params.id
  );

  // Tampilkan loading state selama dataStore masih hydrate ATAU kurikulum
  // masih dimuat. Tanpa ini, race condition bikin notFound() dipanggil
  // sebelum data sempat datang.
  const isInitializing =
    storeLoading || products.length === 0 || loadingCurriculum;

  if (isInitializing && !product) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Produk", href: "/admin/products" },
          { label: "Memuat..." },
        ]}
        title="Memuat produk..."
      >
        <p className="text-sm text-ink/55">Mengambil data dari server...</p>
      </AdminShell>
    );
  }

  if (!product) notFound();

  // Tunggu kurikulum sebelum mount form (biar modules state ke-init lengkap)
  if (loadingCurriculum) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Produk", href: "/admin/products" },
          { label: product.title },
        ]}
        title={`Edit ${product.title}`}
        description="Memuat kurikulum..."
      >
        <p className="text-sm text-ink/55">Mengambil modul & lesson...</p>
      </AdminShell>
    );
  }

  const fullProduct = { ...product, modules };

  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Produk", href: "/admin/products" },
        { label: product.title },
      ]}
      title={`Edit ${product.title}`}
      description="Perbarui detail kelas, modul, video, dan materi pendukung."
    >
      <ProductForm mode="edit" initial={fullProduct} />
    </AdminShell>
  );
}
