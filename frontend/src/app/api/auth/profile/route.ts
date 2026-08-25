import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders } from "@/lib/backend";

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: getForwardHeaders(request),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ ok: false, detail: "Profile fetch error" }, { status: 500 });
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
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ ok: false, detail: "Profile update error" }, { status: 500 });
  }
}
