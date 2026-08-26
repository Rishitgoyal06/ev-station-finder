import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders } from "@/lib/backend";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const res = await fetch(`${BACKEND_BASE_URL}/ev-stations?${url.searchParams.toString()}`, {
      method: "GET",
      headers: getForwardHeaders(request),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ count: 0, results: [], error: error.message || "Failed to fetch stations" }, { status: 500 });
  }
}
