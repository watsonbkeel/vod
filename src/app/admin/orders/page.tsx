import { AdminShell } from "@/components/admin-shell";

export default function AdminOrdersPage() {
  return (
    <AdminShell title="订单管理">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">订单列表会展示威富通商户单号、支付渠道、金额、状态和支付时间。</p>
        <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center text-slate-500">暂无订单</div>
      </div>
    </AdminShell>
  );
}
