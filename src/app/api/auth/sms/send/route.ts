import { jsonOk, phoneSchema } from "@/lib/api";
import { sendSmsCode } from "@/lib/sms/tencent";

export async function POST(request: Request) {
  const body = await request.json();
  const phone = phoneSchema.parse(body.phone);
  const code = String(Math.floor(100000 + Math.random() * 900000));

  await sendSmsCode(phone, code);

  return jsonOk({ expiresIn: 300 });
}
