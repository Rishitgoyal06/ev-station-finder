import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders } from "@/lib/backend";

/**
 * Verify a Turnstile token by calling Cloudflare's siteverify endpoint.
 */
async function verifyTurnstileToken(
  token: string,
  expectedAction: string,
  clientIp?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) {
    console.error("TURNSTILE_SECRET not configured");
    return false;
  }

  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "localhost,127.0.0.1")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean)
  );
  if (expectedHostnames.size === 0) {
    console.error("TURNSTILE_HOSTNAMES is empty");
    return false;
  }

  if (!token || token.length === 0 || token.length > 2048) {
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          ...(clientIp ? { remoteip: clientIp } : {}),
        }),
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!response.ok) {
      console.error("Turnstile siteverify returned non-OK status:", response.status);
      return false;
    }

    const result = await response.json();

    if (
      !result.success ||
      result.action !== expectedAction ||
      !expectedHostnames.has(result.hostname)
    ) {
      console.warn("Turnstile verification failed:", {
        success: result.success,
        action: result.action,
        hostname: result.hostname,
        expectedAction,
        expectedHostnames: Array.from(expectedHostnames),
      });
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("Turnstile verification exception:", err.message);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const turnstileToken = body["cf-turnstile-response"];
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    // Verify Turnstile challenge before forwarding to backend
    const isVerified = await verifyTurnstileToken(
      turnstileToken,
      "signup",
      clientIp
    );
    if (!isVerified) {
      return NextResponse.json(
        { ok: false, error: "Human verification failed. Please try again." },
        { status: 403 }
      );
    }

    // Remove the Turnstile token before forwarding (backend doesn't need it)
    const { "cf-turnstile-response": _, ...backendBody } = body;

    const res = await fetch(`${BACKEND_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getForwardHeaders(request),
      body: JSON.stringify(backendBody),
    });
    const data = await res.json().catch(() => ({}));
    const response = NextResponse.json(data, { status: res.status });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) response.headers.set("set-cookie", setCookie);
    return response;
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Registration failed. Database error." },
      { status: 500 }
    );
  }
}
