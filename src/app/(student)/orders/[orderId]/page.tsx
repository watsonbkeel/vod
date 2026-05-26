import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { OrderResult } from "@/components/order-result";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";

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

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <OrderResult
          initialOrder={{
            orderId: order.id,
            merchantOrderNo: order.merchantOrderNo,
            channel: order.channel,
            status: order.status,
            amountCents: order.amountCents,
            paidAt: order.paidAt?.toISOString() ?? null,
            course: order.course,
          }}
        />
      </section>
    </main>
  );
}
