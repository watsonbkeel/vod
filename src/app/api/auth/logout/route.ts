import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jsonOk } from "@/lib/api";

async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("vod_session");
}

export async function POST(request: Request) {
  await clearUserSession();

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    redirect("/");
  }

  return jsonOk({ loggedOut: true });
}
