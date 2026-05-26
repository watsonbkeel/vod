import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/db";

function formatAmount(amountCents: number) {
  return `¥${(amountCents / 100).toFixed(2)}`;
}

export default async function AdminOrdersPage() {
  const [orders, callbacks] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { phone: true } },
        course: { select: { title: true } },
      },
      take: 100,
    }),
    prisma.paymentCallbackLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <AdminShell title="订单管理">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">查看威富通商户单号、支付渠道、金额、状态和支付时间。</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{orders.length} 个订单</span>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
            {orders.length === 0 ? (
              <div className="bg-slate-50 p-8 text-center text-slate-500">暂无订单</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">订单</th>
                      <th className="px-4 py-3 font-medium">用户</th>
                      <th className="px-4 py-3 font-medium">课程</th>
                      <th className="px-4 py-3 font-medium">金额</th>
                      <th className="px-4 py-3 font-medium">状态</th>
                      <th className="px-4 py-3 font-medium">支付时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-950">{order.merchantOrderNo}</td>
                        <td className="whitespace-nowrap px-4 py-4">{order.user.phone}</td>
                        <td className="min-w-48 px-4 py-4">{order.course.title}</td>
                        <td className="whitespace-nowrap px-4 py-4">{formatAmount(order.amountCents)}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{order.status}</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">{order.paidAt ? order.paidAt.toLocaleString("zh-CN") : "未支付"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-950">支付回调日志</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">最近 {callbacks.length} 条</span>
          </div>
          <div className="mt-5 space-y-3">
            {callbacks.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">暂无回调</div>
            ) : (
              callbacks.map((callback) => (
                <div key={callback.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950">{callback.merchantOrderNo ?? "未知订单"}</p>
                    <span className={`rounded-full px-3 py-1 text-xs ${callback.signatureValid ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                      {callback.signatureValid ? "验签通过" : "验签失败"}
                    </span>
                  </div>
                  <p className="mt-2">渠道：{callback.channel ?? "未知"} · {callback.processed ? "已处理" : "未处理"}</p>
                  <p className="mt-1 text-xs text-slate-400">{callback.createdAt.toLocaleString("zh-CN")}</p>
                  {callback.errorMessage ? <p className="mt-2 text-xs text-red-600">{callback.errorMessage}</p> : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
