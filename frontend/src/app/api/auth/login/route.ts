import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders } from "@/lib/backend";

export async function POST(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getForwardHeaders(request),
      body: await request.text(),
    });
    const data = await res.json().catch(() => ({}));
    const response = NextResponse.json(data, { status: res.status });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) response.headers.set("set-cookie", setCookie);
    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
