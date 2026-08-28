import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders, clearAuthCookieOnResponse } from "@/lib/backend";

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: getForwardHeaders(request),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    const response = NextResponse.json(data, { status: res.status });

    if (res.status === 401) {
      clearAuthCookieOnResponse(response);
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Unable to load profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const res = await fetch(`${BACKEND_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: getForwardHeaders(request),
      body: bodyText,
    });
    const data = await res.json().catch(() => ({}));
    const response = NextResponse.json(data, { status: res.status });

    if (res.status === 401) {
      clearAuthCookieOnResponse(response);
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Unable to update profile" }, { status: 500 });
  }
}
