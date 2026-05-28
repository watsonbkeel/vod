import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { getAdminSession } from "@/lib/auth/admin";
import { buildObjectKey, canUseMockMedia, getCosConfig, getCosObjectUrl, hasCosCredentials } from "@/lib/cos/client";
import { prisma } from "@/lib/db";

const uploadRequestSchema = z.object({
  filename: z.string().trim().min(1).default("video.mp4"),
  mimeType: z.string().trim().min(1).default("video/mp4"),
  sizeBytes: z.coerce.number().int().min(0).default(0),
});

export async function POST(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return jsonError("请先登录后台", 401);
  }

  const hasCos = hasCosCredentials();

  if (!hasCos && !canUseMockMedia()) {
    return jsonError("COS 存储未配置，无法生成上传地址", 503);
  }

  const body = uploadRequestSchema.parse(await request.json().catch(() => ({})));
  const { bucket, region } = getCosConfig();
  const objectKey = buildObjectKey(body.filename);
  const expiresIn = Number(process.env.COS_SIGN_EXPIRES_SECONDS ?? 600);
  const uploadUrl = hasCos ? getCosObjectUrl({ bucket, region, objectKey, method: "PUT", expiresIn }) : null;
  const asset = await prisma.mediaAsset.create({
    data: {
      bucket,
      region,
      objectKey,
      filename: body.filename,
      mimeType: body.mimeType,
      sizeBytes: BigInt(body.sizeBytes),
      status: "pending",
    },
  });

  return jsonOk({
    assetId: asset.id,
    bucket,
    region,
    objectKey,
    uploadMethod: "putObject",
    status: asset.status,
    upload: {
      mode: uploadUrl ? "cos" : "mock",
      method: uploadUrl ? "PUT" : null,
      url: uploadUrl,
      headers: uploadUrl ? { "Content-Type": body.mimeType } : null,
      expiresIn,
    },
  });
}
