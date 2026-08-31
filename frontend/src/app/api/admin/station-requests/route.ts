import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders } from "@/lib/backend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_BASE_URL}/station-requests`, {
      method: "POST",
      headers: { ...getForwardHeaders(request), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Station request submit error:", error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const ownerEmail = url.searchParams.get("owner_email");
    const backendUrl = ownerEmail
      ? `${BACKEND_BASE_URL}/station-requests?owner_email=${encodeURIComponent(ownerEmail)}`
      : `${BACKEND_BASE_URL}/station-requests`;
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: getForwardHeaders(request),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Station requests fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
