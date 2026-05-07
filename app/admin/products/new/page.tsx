import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Produk", href: "/admin/products" },
        { label: "Tambah Produk" },
      ]}
      title="Tambah Produk Baru"
      description="Daftarkan kelas atau tutorial baru ke katalog Member Area."
    >
      <ProductForm mode="create" />
    </AdminShell>
  );
}
