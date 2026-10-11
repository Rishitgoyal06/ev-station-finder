import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders } from "@/lib/backend";

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/admin/bookings`, {
      method: "GET",
      headers: getForwardHeaders(request),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Admin bookings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === "update-expired") {
      // Call the backend endpoint to update expired bookings
      const res = await fetch(`${BACKEND_BASE_URL}/admin/update-expired`, {
        method: "POST",
        headers: getForwardHeaders(request),
      });
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin bookings action error:", error);
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
  }
}
