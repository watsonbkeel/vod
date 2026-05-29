import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { OrderResult } from "@/components/order-result";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { closeExpiredOrder, getOrderExpiresAt } from "@/lib/orders";
import { getSiteSettings } from "@/lib/site-settings";

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { course: { select: { id: true, title: true, slug: true } } },
  });

  if (!order || order.userId !== userId) {
    notFound();
  }

  const currentOrder = await closeExpiredOrder(order);
  if (currentOrder.channel !== "alipay") {
    notFound();
  }

  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <OrderResult
          initialOrder={{
            orderId: currentOrder.id,
            merchantOrderNo: currentOrder.merchantOrderNo,
            channel: currentOrder.channel,
            status: currentOrder.status,
            amountCents: currentOrder.amountCents,
            paidAt: currentOrder.paidAt?.toISOString() ?? null,
            closedAt: currentOrder.closedAt?.toISOString() ?? null,
            createdAt: currentOrder.createdAt.toISOString(),
            expiresAt: getOrderExpiresAt(currentOrder).toISOString(),
            paymentCodeUrl: currentOrder.paymentCodeUrl,
            paymentPayInfo: currentOrder.paymentPayInfo,
            course: currentOrder.course,
          }}
          settings={settings.global}
        />
      </section>
    </main>
  );
}
