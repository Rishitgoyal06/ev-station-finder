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
<<<<<<< HEAD
    return NextResponse.json({ ok: false, detail: "Profile fetch error" }, { status: 500 });
=======
    return NextResponse.json({ ok: false, error: "Unable to load profile" }, { status: 500 });
>>>>>>> 7e3627b (feat: implement dynamic route calculation, profile update API, and centralized station fetching utility)
  }
}

export async function PUT(request: NextRequest) {
  try {
<<<<<<< HEAD
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
=======
    const res = await fetch(`${BACKEND_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: getForwardHeaders(request),
      body: await request.text(),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Unable to update profile" }, { status: 500 });
>>>>>>> 7e3627b (feat: implement dynamic route calculation, profile update API, and centralized station fetching utility)
  }
}
