import { revalidatePath } from "next/cache";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { getAdminSession } from "@/lib/auth/admin";
import { bindUploadedMediaToLesson, MediaBindingError } from "@/lib/admin/media-binding";

const bindLessonMediaSchema = z.object({
  courseId: z.string().trim().min(1),
  mediaAssetId: z.string().trim().min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const admin = await getAdminSession();

  if (!admin) {
    return jsonError("请先登录后台", 401);
  }

  const { lessonId } = await params;
  const body = bindLessonMediaSchema.parse(await request.json());

  try {
    const result = await bindUploadedMediaToLesson({
      courseId: body.courseId,
      lessonId,
      mediaAssetId: body.mediaAssetId,
    });

    revalidatePath(`/courses/${result.course.slug}`);
    revalidatePath(`/admin/courses/${result.course.id}/edit`);

    return jsonOk({
      lessonId: result.lesson.id,
      mediaAssetId: result.lesson.mediaAssetId,
      filename: result.mediaAsset.filename,
    });
  } catch (err) {
    if (err instanceof MediaBindingError) {
      return jsonError(err.message, err.status);
    }

    return jsonError("绑定视频失败", 500);
  }
}
