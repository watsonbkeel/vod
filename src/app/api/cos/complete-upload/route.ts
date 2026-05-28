import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { getAdminSession } from "@/lib/auth/admin";
import { canUseMockMedia, checkCosObject, hasCosCredentials } from "@/lib/cos/client";
import { prisma } from "@/lib/db";

const completeUploadSchema = z.object({
  assetId: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return jsonError("请先登录后台", 401);
  }

  const body = completeUploadSchema.parse(await request.json());
  const asset = await prisma.mediaAsset.findUnique({ where: { id: body.assetId } });

  if (!asset) {
    return jsonError("媒体资源不存在", 404);
  }

  const hasCos = hasCosCredentials();

  if (!hasCos && !canUseMockMedia()) {
    return jsonError("COS 存储未配置，无法确认上传完成", 503);
  }

  if (hasCos) {
    const object = await checkCosObject({
      bucket: asset.bucket,
      region: asset.region,
      objectKey: asset.objectKey,
    });

    if (!object.ok) {
      return jsonError("COS 视频对象不存在或无法访问", object.statusCode === 404 ? 404 : 502);
    }
  }

  const uploadedAsset = await prisma.mediaAsset.update({
    where: { id: asset.id },
    data: { status: "uploaded" },
  });

  return jsonOk({
    assetId: uploadedAsset.id,
    status: uploadedAsset.status,
  });
}
