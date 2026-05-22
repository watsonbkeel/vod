import { verifyWeifutongSignature } from "@/lib/payments/weifutong/sign";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)]));
  const signatureValid = verifyWeifutongSignature(payload);

  if (!signatureValid) {
    return new Response("fail", { status: 400 });
  }

  return new Response("success");
}
