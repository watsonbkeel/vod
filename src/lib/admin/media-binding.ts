import { prisma } from "@/lib/db";

export class MediaBindingError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

function rejectBinding(message: string, status = 400): never {
  throw new MediaBindingError(message, status);
}

export async function bindUploadedMediaToLesson(input: { courseId: string; lessonId: string; mediaAssetId: string }) {
  const course = await prisma.course.findUnique({
    where: { id: input.courseId },
    select: { id: true, slug: true },
  });

  if (!course) {
    rejectBinding("课程不存在", 404);
  }

  const lesson = await prisma.lesson.findFirst({
    where: { id: input.lessonId, courseId: input.courseId },
    select: { id: true },
  });

  if (!lesson) {
    rejectBinding("课时不存在", 404);
  }

  const mediaAsset = await prisma.mediaAsset.findUnique({
    where: { id: input.mediaAssetId },
    select: { id: true, filename: true, status: true },
  });

  if (!mediaAsset) {
    rejectBinding("视频不存在", 404);
  }

  if (mediaAsset.status !== "uploaded") {
    rejectBinding("视频尚未上传完成", 409);
  }

  const updatedLesson = await prisma.lesson.update({
    where: { id: lesson.id },
    data: { mediaAssetId: mediaAsset.id },
    select: { id: true, mediaAssetId: true },
  });

  return { course, lesson: updatedLesson, mediaAsset };
}
