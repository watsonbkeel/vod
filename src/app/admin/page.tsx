import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/auth/admin";

const stats = [
  ["课程", "2"],
  ["订单", "0"],
  ["用户", "0"],
  ["待处理上传", "0"],
];

export default async function AdminPage() {
  await requireAdminSession();

  return (
    <AdminShell title="仪表盘">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-semibold text-slate-950">MVP 接入进度</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">接下来接入课程 CRUD、COS 直传、威富通支付和赠课能力。</p>
      </div>
    </AdminShell>
  );
}
