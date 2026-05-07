"use client";

import { notFound, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { useProduct } from "@/lib/dataStore";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const product = useProduct(params.id);
  if (!product) notFound();

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
      <ProductForm mode="edit" initial={product} />
    </AdminShell>
  );
}
