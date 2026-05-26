import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { getUserId } from "@/lib/auth/user";
import { getCosConfig } from "@/lib/cos/client";
import { prisma } from "@/lib/db";

const playUrlSchema = z.object({
  lessonId: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再观看课程", 401);
  }

  const { lessonId } = playUrlSchema.parse(await request.json());
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true, mediaAsset: true },
  });

  if (!lesson || lesson.status !== "published" || lesson.course.status !== "published") {
    return jsonError("课时不存在或未上架", 404);
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
    return jsonError("你还没有该课程的有效观看权限", 403);
  }

  if (!lesson.mediaAsset || lesson.mediaAsset.status !== "uploaded") {
    return jsonError("该课时还没有可播放的视频", 404);
  }

  const expiresIn = Number(process.env.COS_SIGN_EXPIRES_SECONDS ?? 600);
  const { bucket, region } = getCosConfig();
  const playUrl = process.env.TENCENT_SECRET_ID && process.env.TENCENT_SECRET_KEY
    ? `cos://${lesson.mediaAsset.bucket}/${lesson.mediaAsset.objectKey}`
    : `/api/mock-media/${lesson.mediaAsset.id}?expiresIn=${expiresIn}`;

  return jsonOk({
    lessonId: lesson.id,
    courseId: lesson.courseId,
    assetId: lesson.mediaAsset.id,
    bucket,
    region,
    objectKey: lesson.mediaAsset.objectKey,
    playUrl,
    expiresIn,
  });
}

export async function GET() {
  return jsonOk({ status: "play-url endpoint ready" });
}
