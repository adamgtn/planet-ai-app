import { AdminShell } from "@/components/admin/AdminShell";
import { UserForm } from "@/components/admin/UserForm";

export default function NewUserPage() {
  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Member", href: "/admin/users" },
        { label: "Tambah Member" },
      ]}
      title="Tambah Member Baru"
      description="Buat akun member secara manual. Member tidak bisa mendaftar sendiri."
    >
      <UserForm mode="create" />
    </AdminShell>
  );
}
