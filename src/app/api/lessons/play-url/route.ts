import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { getUserId } from "@/lib/auth/user";
import { getCosObjectUrl, hasCosCredentials } from "@/lib/cos/client";
import { prisma } from "@/lib/db";

const playUrlSchema = z.object({
  lessonId: z.string().trim().min(1),
});

async function findPlayableLesson(lessonId: string, userId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true, mediaAsset: true },
  });

  if (!lesson || lesson.status !== "published" || lesson.course.status !== "published") {
    return { error: jsonError("课时不存在或未上架", 404) };
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
    return { error: jsonError("你还没有该课程的有效观看权限", 403) };
  }

  const mediaAsset = lesson.mediaAsset;

  if (!mediaAsset || mediaAsset.status !== "uploaded") {
    return { error: jsonError("该课时还没有可播放的视频", 404) };
  }

  return { lesson, mediaAsset };
}

export async function POST(request: Request) {
  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再观看课程", 401);
  }

  const { lessonId } = playUrlSchema.parse(await request.json());
  const result = await findPlayableLesson(lessonId, userId);

  if (result.error) {
    return result.error;
  }

  const expiresIn = Number(process.env.COS_SIGN_EXPIRES_SECONDS ?? 600);

  return jsonOk({
    lessonId: result.lesson.id,
    courseId: result.lesson.courseId,
    assetId: result.mediaAsset.id,
    bucket: result.mediaAsset.bucket,
    region: result.mediaAsset.region,
    objectKey: result.mediaAsset.objectKey,
    playUrl: `/api/lessons/play-url?lessonId=${encodeURIComponent(result.lesson.id)}`,
    expiresIn,
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lessonId = url.searchParams.get("lessonId") ?? "";

  if (!lessonId) {
    return jsonOk({ status: "play-url endpoint ready" });
  }

  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再观看课程", 401);
  }

  const result = await findPlayableLesson(lessonId, userId);

  if (result.error) {
    return result.error;
  }

  if (!hasCosCredentials()) {
    return Response.redirect(new URL(`/api/mock-media/${result.mediaAsset.id}`, request.url));
  }

  const expiresIn = Number(process.env.COS_SIGN_EXPIRES_SECONDS ?? 600);
  const signedUrl = getCosObjectUrl({
    bucket: result.mediaAsset.bucket,
    region: result.mediaAsset.region,
    objectKey: result.mediaAsset.objectKey,
    method: "GET",
    expiresIn,
  });
  const upstream = await fetch(signedUrl, {
    headers: request.headers.get("range") ? { Range: request.headers.get("range") as string } : undefined,
  });

  if (!upstream.ok && upstream.status !== 206) {
    return jsonError("获取视频流失败", upstream.status);
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || result.mediaAsset.mimeType || "video/mp4");
  headers.set("Cache-Control", "private, no-store");
  headers.set("Accept-Ranges", upstream.headers.get("accept-ranges") || "bytes");

  for (const key of ["content-length", "content-range"]) {
    const value = upstream.headers.get(key);
    if (value) {
      headers.set(key, value);
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
