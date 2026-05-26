import bcrypt from "bcryptjs";
import { jsonOk, phoneSchema } from "@/lib/api";
import { prisma } from "@/lib/db";
import { sendSmsCode } from "@/lib/sms/tencent";

const expiresIn = 300;

export async function POST(request: Request) {
  const body = await request.json();
  const phone = phoneSchema.parse(body.phone);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 12);
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  await prisma.smsCode.create({
    data: {
      phone,
      codeHash,
      purpose: "login",
      expiresAt,
    },
  });

  await sendSmsCode(phone, code);

  return jsonOk({ expiresIn });
}
