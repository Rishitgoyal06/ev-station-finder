export const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  "http://127.0.0.1:8001";

// Client-safe version — uses NEXT_PUBLIC_ prefix so it's available in the browser
// Used by client components like DashboardMap, LiveMap, DirectionsMap
// NOTE: BACKEND_BASE_URL is server-only and never visible in the browser,
//       so CLIENT_BACKEND_URL must rely solely on NEXT_PUBLIC_BACKEND_BASE_URL.
export const CLIENT_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  "http://127.0.0.1:8001";

export function getForwardHeaders(request: Request) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");

  if (contentType) headers.set("content-type", contentType);
  if (authorization) headers.set("authorization", authorization);
  if (cookie) headers.set("cookie", cookie);

  return headers;
}

/**
 * Attach to any NextResponse when the backend returns 401.
 * Deletes the stale chargeiq_token cookie so the browser stops
 * sending it on every subsequent request after token expiry.
 */
export function clearAuthCookieOnResponse(response: import("next/server").NextResponse): void {
  response.cookies.set("chargeiq_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  });
}
