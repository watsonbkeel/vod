import { requireAdminSession } from "@/lib/auth/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();

  return children;
}
