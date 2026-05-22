import { jsonOk } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();

  return jsonOk({
    lessonId: body.lessonId,
    positionSec: body.positionSec ?? 0,
    completed: Boolean(body.completed),
  });
}
