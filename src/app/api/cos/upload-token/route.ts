import { jsonOk } from "@/lib/api";
import { buildObjectKey, getCosConfig } from "@/lib/cos/client";

export async function POST(request: Request) {
  const body = await request.json();
  const filename = String(body.filename ?? "video.mp4");
  const { bucket, region } = getCosConfig();
  const objectKey = buildObjectKey(filename);

  return jsonOk({
    bucket,
    region,
    objectKey,
    uploadMethod: "putObject",
    note: "下一步接入腾讯云 STS 或预签名上传参数，供浏览器直传 COS。",
  });
}
