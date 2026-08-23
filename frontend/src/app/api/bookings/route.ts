import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders } from "@/lib/backend";

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/bookings`, {
      method: "GET",
      headers: getForwardHeaders(request),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/bookings`, {
      method: "POST",
      headers: getForwardHeaders(request),
      body: await request.text(),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Booking create error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
