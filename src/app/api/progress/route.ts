import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";

const progressSchema = z.object({
  lessonId: z.string().trim().min(1),
  positionSec: z.coerce.number().int().min(0).default(0),
  completed: z.boolean().default(false),
});

export async function POST(request: Request) {
  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再记录学习进度", 401);
  }

  const body = progressSchema.parse(await request.json());
  const lesson = await prisma.lesson.findUnique({ where: { id: body.lessonId }, select: { courseId: true } });

  if (!lesson) {
    return jsonError("课时不存在", 404);
  }

  const entitlement = await prisma.courseEntitlement.findFirst({
    where: {
      userId,
      courseId: lesson.courseId,
      status: "active",
      startsAt: { lte: new Date() },
      expiresAt: { gt: new Date() },
    },
  });

  if (!entitlement) {
    return jsonError("你还没有该课程的有效学习权限", 403);
  }

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: body.lessonId } },
    update: {
      positionSec: body.positionSec,
      completed: body.completed,
      lastWatchedAt: new Date(),
    },
    create: {
      userId,
      courseId: lesson.courseId,
      lessonId: body.lessonId,
      positionSec: body.positionSec,
      completed: body.completed,
    },
  });

  return jsonOk({
    lessonId: progress.lessonId,
    positionSec: progress.positionSec,
    completed: progress.completed,
    lastWatchedAt: progress.lastWatchedAt,
  });
}
