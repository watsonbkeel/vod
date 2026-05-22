import { jsonOk, phoneSchema } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();
  const phone = phoneSchema.parse(body.phone);

  return jsonOk({
    phone,
    courseId: body.courseId,
    validityDays: Number(body.validityDays ?? 365),
    note: "下一步写入 CourseEntitlement，实现后台手工赠课。",
  });
}
