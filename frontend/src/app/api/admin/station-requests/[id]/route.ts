import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders } from "@/lib/backend";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const res = await fetch(`${BACKEND_BASE_URL}/station-requests/${id}`, {
      method: "PATCH",
      headers: { ...getForwardHeaders(request), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Station request update error:", error);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}
