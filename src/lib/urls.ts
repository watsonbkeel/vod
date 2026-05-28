export function getAppOrigin(request: Request, appUrl = process.env.APP_URL) {
  const configuredUrl = appUrl?.trim();

  if (configuredUrl) {
    return new URL(configuredUrl).origin;
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");

  if (host) {
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProto || new URL(request.url).protocol.replace(":", "");

    return `${protocol}://${host}`;
  }

  return new URL(request.url).origin;
}

export function getAppUrl(path: string, request: Request, appUrl = process.env.APP_URL) {
  return new URL(path, getAppOrigin(request, appUrl));
}
